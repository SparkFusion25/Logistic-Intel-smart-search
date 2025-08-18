import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting pending enrichment processing...');

    // Get pending records (limit to prevent timeout)
    const { data: pendingRecords, error: fetchError } = await supabaseClient
      .from('pending_enrichment_records')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(100);

    if (fetchError) {
      console.error('Error fetching pending records:', fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!pendingRecords || pendingRecords.length === 0) {
      console.log('No pending records to process');
      return new Response(JSON.stringify({ message: 'No pending records', processed: 0 }), { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing ${pendingRecords.length} pending records...`);

    let processed = 0;
    let matched = 0;

    for (const record of pendingRecords) {
      try {
        console.log(`Processing record ${record.id} with company: "${record.invalid_company_name}"`);

        // Try to find a valid company name match using various strategies
        let validCompanyName = null;

        // Strategy 1: Exact match in unified_shipments with cleaned name
        const cleanedName = record.invalid_company_name?.trim().toLowerCase();
        if (cleanedName && cleanedName.length > 2) {
          const { data: exactMatch } = await supabaseClient
            .from('unified_shipments')
            .select('unified_company_name')
            .ilike('unified_company_name', cleanedName)
            .not('unified_company_name', 'is', null)
            .limit(1);

          if (exactMatch && exactMatch.length > 0) {
            validCompanyName = exactMatch[0].unified_company_name;
            console.log(`Found exact match: ${validCompanyName}`);
          }
        }

        // Strategy 2: Fuzzy match using similarity if no exact match
        if (!validCompanyName && cleanedName && cleanedName.length > 3) {
          const { data: similarMatches } = await supabaseClient
            .from('unified_shipments')
            .select('unified_company_name')
            .not('unified_company_name', 'is', null)
            .textSearch('unified_company_name', cleanedName)
            .limit(5);

          if (similarMatches && similarMatches.length > 0) {
            // Use the first similar match for now
            validCompanyName = similarMatches[0].unified_company_name;
            console.log(`Found similar match: ${validCompanyName}`);
          }
        }

        if (validCompanyName) {
          // Update the original record in unified_shipments
          const { error: updateError } = await supabaseClient
            .from('unified_shipments')
            .update({ 
              unified_company_name: validCompanyName,
              inferred_company_name: validCompanyName 
            })
            .eq('id', record.original_record_id);

          if (updateError) {
            console.error(`Error updating original record ${record.original_record_id}:`, updateError);
            
            // Mark as failed
            await supabaseClient
              .from('pending_enrichment_records')
              .update({ 
                status: 'failed',
                last_attempt_at: new Date().toISOString(),
                error_message: updateError.message
              })
              .eq('id', record.id);
          } else {
            console.log(`Successfully updated record ${record.original_record_id} with company: ${validCompanyName}`);
            
            // Mark as resolved
            await supabaseClient
              .from('pending_enrichment_records')
              .update({ 
                status: 'resolved',
                resolved_company_name: validCompanyName,
                resolved_at: new Date().toISOString()
              })
              .eq('id', record.id);

            matched++;
          }
        } else {
          console.log(`No match found for: "${record.invalid_company_name}"`);
          
          // Update last attempt time
          await supabaseClient
            .from('pending_enrichment_records')
            .update({ 
              last_attempt_at: new Date().toISOString(),
              attempt_count: (record.attempt_count || 0) + 1
            })
            .eq('id', record.id);
        }

        processed++;
      } catch (error) {
        console.error(`Error processing record ${record.id}:`, error);
        
        // Mark as failed
        await supabaseClient
          .from('pending_enrichment_records')
          .update({ 
            status: 'failed',
            last_attempt_at: new Date().toISOString(),
            error_message: error.message
          })
          .eq('id', record.id);
      }
    }

    console.log(`Processing complete. Processed: ${processed}, Matched: ${matched}`);

    return new Response(JSON.stringify({ 
      message: 'Processing complete',
      processed,
      matched,
      totalPending: pendingRecords.length
    }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in process-pending-enrichment:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});