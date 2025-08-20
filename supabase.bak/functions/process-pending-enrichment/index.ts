import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// AI-enhanced company matching function
async function findCompanyUsingAI(supabaseClient: any, record: any, originalData: any) {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not found, skipping AI matching');
      return null;
    }

    // Get contextual data for intelligent matching
    const contextualData = await getContextualData(supabaseClient, originalData);
    
    // Prepare AI prompt with multiple data points
    const prompt = `
You are an AI expert in logistics and trade data analysis. Your task is to match an unknown/invalid company name with a valid company name from our database using multiple contextual clues.

UNKNOWN COMPANY: "${record.invalid_company_name}"

CONTEXTUAL DATA:
- HS Code: ${originalData.hs_code || 'N/A'}
- Commodity: ${originalData.commodity_description || originalData.goods_description || 'N/A'}
- Mode: ${originalData.mode || 'N/A'}
- Value USD: ${originalData.value_usd || 'N/A'}
- Port/Location: ${originalData.port_of_lading || originalData.departure_port || 'N/A'} to ${originalData.port_of_unlading || originalData.destination_port || 'N/A'}
- Date: ${originalData.shipment_date || originalData.arrival_date || 'N/A'}
- Shipper Info: ${originalData.shipper_name || 'N/A'}
- Consignee Info: ${originalData.consignee_name || originalData.consignee_city || 'N/A'}

CANDIDATE COMPANIES FROM DATABASE:
${contextualData.candidates.map((c: any, i: number) => `${i+1}. ${c.company_name} (Ships: ${c.commodity_match ? c.commodity_description : 'Various'}, Ports: ${c.common_ports || 'Various'}, Frequency: ${c.shipment_count})`).join('\n')}

ANALYSIS REQUIREMENTS:
1. Consider geographic proximity (same ports, cities, regions)
2. Analyze commodity/HS code patterns and specializations
3. Evaluate shipment frequency and volume patterns
4. Look for naming similarities (abbreviations, subsidiaries, misspellings)
5. Consider business relationships (importers vs exporters)
6. Factor in timing patterns and trade routes

IMPORTANCE SCORING:
- High importance: Large trade volumes, frequent shipments, strategic commodities
- Medium importance: Regular trade patterns, regional significance
- Low importance: Infrequent or small-scale operations

Return ONLY the exact company name from the candidates list that best matches, or "NO_MATCH" if no strong match exists. Do not return explanations or multiple options.

RESPONSE:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are an expert in trade data analysis and company matching. Provide precise, single-word company name matches only.' },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 100,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    const aiMatch = data.choices[0]?.message?.content?.trim();
    
    if (aiMatch && aiMatch !== 'NO_MATCH' && contextualData.candidates.some((c: any) => c.company_name === aiMatch)) {
      console.log(`AI found contextual match: ${aiMatch}`);
      return aiMatch;
    }

    return null;
  } catch (error) {
    console.error('Error in AI matching:', error);
    return null;
  }
}

// Get contextual data for AI analysis
async function getContextualData(supabaseClient: any, originalData: any) {
  const candidates = [];
  
  try {
    // Strategy 1: Find companies with similar commodities/HS codes
    if (originalData.hs_code) {
      const { data: commodityMatches } = await supabaseClient
        .from('unified_shipments')
        .select('unified_company_name, hs_code, commodity_description, value_usd, port_of_lading, port_of_unlading')
        .eq('hs_code', originalData.hs_code)
        .not('unified_company_name', 'is', null)
        .order('value_usd', { ascending: false })
        .limit(10);

      if (commodityMatches) {
        candidates.push(...commodityMatches.map((m: any) => ({
          company_name: m.unified_company_name,
          commodity_match: true,
          commodity_description: m.commodity_description,
          match_reason: 'HS_CODE'
        })));
      }
    }

    // Strategy 2: Find companies with similar routes/ports
    if (originalData.port_of_lading && originalData.port_of_unlading) {
      const { data: routeMatches } = await supabaseClient
        .from('unified_shipments')
        .select('unified_company_name, port_of_lading, port_of_unlading, mode, value_usd')
        .eq('port_of_lading', originalData.port_of_lading)
        .eq('port_of_unlading', originalData.port_of_unlading)
        .not('unified_company_name', 'is', null)
        .order('value_usd', { ascending: false })
        .limit(10);

      if (routeMatches) {
        candidates.push(...routeMatches.map((m: any) => ({
          company_name: m.unified_company_name,
          route_match: true,
          common_ports: `${m.port_of_lading} → ${m.port_of_unlading}`,
          match_reason: 'ROUTE'
        })));
      }
    }

    // Strategy 3: Find companies by geographic proximity
    if (originalData.consignee_city || originalData.shipper_country) {
      const { data: geoMatches } = await supabaseClient
        .from('unified_shipments')
        .select('unified_company_name, consignee_city, shipper_country, value_usd')
        .or(`consignee_city.ilike.%${originalData.consignee_city}%,shipper_country.ilike.%${originalData.shipper_country}%`)
        .not('unified_company_name', 'is', null)
        .order('value_usd', { ascending: false })
        .limit(10);

      if (geoMatches) {
        candidates.push(...geoMatches.map((m: any) => ({
          company_name: m.unified_company_name,
          geographic_match: true,
          location: `${m.consignee_city || ''} ${m.shipper_country || ''}`.trim(),
          match_reason: 'GEOGRAPHY'
        })));
      }
    }

    // Strategy 4: Aggregate company importance scores
    const companyStats = new Map();
    candidates.forEach(c => {
      const existing = companyStats.get(c.company_name) || { 
        company_name: c.company_name, 
        shipment_count: 0, 
        match_reasons: new Set(),
        total_value: 0 
      };
      existing.shipment_count++;
      existing.match_reasons.add(c.match_reason);
      if (c.value_usd) existing.total_value += parseFloat(c.value_usd) || 0;
      companyStats.set(c.company_name, existing);
    });

    // Return unique candidates with importance scoring
    const uniqueCandidates = Array.from(companyStats.values())
      .sort((a, b) => (b.shipment_count * b.total_value) - (a.shipment_count * a.total_value))
      .slice(0, 15);

    return { candidates: uniqueCandidates };
  } catch (error) {
    console.error('Error getting contextual data:', error);
    return { candidates: [] };
  }
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

    // Get pending records with flexible criteria (limit to prevent timeout)
    const { data: pendingRecords, error: fetchError } = await supabaseClient
      .from('pending_enrichment_records')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(100);
      
    console.log(`Processing ${pendingRecords?.length || 0} pending enrichment records with flexible validation`);

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
        console.log(`Processing record ${record.id} with company: "${record.company_name}" from table: ${record.source_table}`);

        // Try to find a valid company name match using AI-enhanced strategies
        let validCompanyName = null;
        const originalData = record.original_data || {};

        // Strategy 1: Very flexible exact match with minimal requirements
        const cleanedName = record.company_name?.trim().toLowerCase();
        if (cleanedName && cleanedName.length > 0) { // Accept even single character names
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

        // Strategy 2: AI-enhanced contextual matching
        if (!validCompanyName) {
          validCompanyName = await findCompanyUsingAI(supabaseClient, record, originalData);
        }

        // Strategy 3: Very flexible fuzzy match - accept shorter names
        if (!validCompanyName && cleanedName && cleanedName.length > 1) { // Reduced from 3 to 1
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
          // Update the original record in the source table
          let updateError = null;
          
          if (record.source_table === 'unified_shipments') {
            const { error } = await supabaseClient
              .from('unified_shipments')
              .update({ 
                unified_company_name: validCompanyName,
                inferred_company_name: validCompanyName 
              })
              .eq('id', record.original_record_id);
            updateError = error;
          } else if (record.source_table === 'trade_shipments') {
            const { error } = await supabaseClient
              .from('trade_shipments')
              .update({ inferred_company_name: validCompanyName })
              .eq('id', record.original_record_id);
            updateError = error;
          } else if (record.source_table === 'ocean_shipments') {
            const { error } = await supabaseClient
              .from('ocean_shipments')
              .update({ company_name: validCompanyName })
              .eq('id', record.original_record_id);
            updateError = error;
          } else if (record.source_table === 'airfreight_shipments') {
            // For airfreight, update shipper_name if that was the invalid field
            const { error } = await supabaseClient
              .from('airfreight_shipments')
              .update({ shipper_name: validCompanyName })
              .eq('id', record.original_record_id);
            updateError = error;
          }

          if (updateError) {
            console.error(`Error updating original record ${record.original_record_id} in ${record.source_table}:`, updateError);
            
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
            console.log(`Successfully updated record ${record.original_record_id} in ${record.source_table} with company: ${validCompanyName}`);
            
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
          console.log(`No match found for: "${record.company_name}" from ${record.source_table}`);
          
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