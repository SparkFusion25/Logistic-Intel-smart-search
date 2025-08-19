import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface XMLEnrichmentRequest {
  import_id: string;
  records: any[];
  filename: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { import_id, records, filename }: XMLEnrichmentRequest = await req.json();

    console.log(`XML AI enrichment starting for import ${import_id}, ${records.length} records`);

    // Update status to enriching
    await supabaseClient
      .from('bulk_imports')
      .update({ status: 'enriching', updated_at: new Date().toISOString() })
      .eq('id', import_id);

    // Get sample data for AI analysis (first 10 rows for better analysis)
    const sampleData = records.slice(0, Math.min(10, records.length));
    
    // Run AI analysis
    try {
      const aiAnalysisResponse = await supabaseClient.functions.invoke('ai-file-analyzer', {
        body: {
          import_id,
          file_sample: sampleData,
          file_type: 'xml',
          filename: filename,
          full_record_count: records.length
        }
      });
      
      if (aiAnalysisResponse.error) {
        console.error('AI analysis failed:', aiAnalysisResponse.error);
        throw new Error(`AI analysis failed: ${aiAnalysisResponse.error.message}`);
      } else {
        console.log('XML AI analysis completed successfully');
      }
    } catch (aiError) {
      console.error('XML AI analysis error:', aiError);
      throw new Error(`XML AI enrichment failed: ${aiError.message}`);
    }

    // Perform XML-specific enrichment
    console.log('XML file: Enriching all records with company data...');
    const enrichedRecords = await enrichAllRecords(records, supabaseClient, import_id);

    console.log('XML file: Validating enriched records...');
    const validatedRecords = await validateEnrichedRecordsByFileType(enrichedRecords, 'xml');

    console.log(`XML enrichment completed: ${validatedRecords.length} valid records`);

    return new Response(JSON.stringify({
      success: true,
      enriched_records: validatedRecords,
      message: 'XML enrichment completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in XML AI enrichment:', error);
    
    // Update import status to error
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      const { import_id } = await req.json();
      await supabaseClient
        .from('bulk_imports')
        .update({ 
          status: 'error', 
          error_message: error.message,
          updated_at: new Date().toISOString() 
        })
        .eq('id', import_id);
    } catch (updateError) {
      console.error('Failed to update import status:', updateError);
    }

    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// XML-specific enrichment functions
async function enrichAllRecords(records: any[], supabaseClient: any, import_id: string) {
  console.log(`Enriching ${records.length} XML records...`);
  
  const enrichedRecords = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    // XML-specific company name validation and enrichment
    let enrichedCompanyName = record.unified_company_name || record.shipper_name || record.consignee_name;
    
    // Apply XML-specific enrichment rules
    if (!isValidCompanyName(enrichedCompanyName)) {
      // Try to extract company name from address or other fields
      enrichedCompanyName = extractCompanyFromAddress(record) || 'Unknown Company';
    }
    
    enrichedRecords.push({
      ...record,
      unified_company_name: enrichedCompanyName,
      enriched: true,
      enrichment_source: 'xml_ai_enrichment'
    });
    
    // Log progress every 100 records
    if ((i + 1) % 100 === 0) {
      console.log(`Enriched ${i + 1}/${records.length} XML records`);
    }
  }
  
  console.log(`XML enrichment completed: ${enrichedRecords.length} records enriched`);
  return enrichedRecords;
}

function isValidCompanyName(companyName: string): boolean {
  if (!companyName || typeof companyName !== 'string') return false;
  
  const trimmed = companyName.trim();
  if (trimmed.length < 3) return false;
  
  // Check for generic/placeholder names
  const invalidNames = [
    'unknown', 'unknown company', 'n/a', 'na', 'none', 'null',
    'not available', 'tbd', 'pending', 'missing', 'unnamed'
  ];
  
  if (invalidNames.includes(trimmed.toLowerCase())) return false;
  
  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(trimmed)) return false;
  
  return true;
}

function extractCompanyFromAddress(record: any): string | null {
  // Try to extract company name from various address fields
  const addressFields = [
    record.shipper_address,
    record.consignee_address,
    record.notify_party,
    record.bill_to_party
  ];
  
  for (const address of addressFields) {
    if (address && typeof address === 'string') {
      // Simple extraction: take first line that looks like a company name
      const lines = address.split('\n').map(line => line.trim());
      for (const line of lines) {
        if (line.length > 3 && isValidCompanyName(line)) {
          return line;
        }
      }
    }
  }
  
  return null;
}

async function validateEnrichedRecordsByFileType(records: any[], fileType: string) {
  const validatedRecords = [];
  
  for (const record of records) {
    const failures = [];
    
    // XML files: Strict validation
    if (!record.org_id) {
      failures.push('missing org_id');
    }
    
    if (!record.unified_company_name || !isValidCompanyName(record.unified_company_name)) {
      failures.push('invalid or missing company name');
    }
    
    // XML requires more fields
    if (!record.hs_code && !record.commodity_description) {
      failures.push('missing commodity information');
    }
    
    if (failures.length === 0) {
      validatedRecords.push(record);
    } else {
      console.log(`XML validation failed for record: ${failures.join(', ')}`);
    }
  }
  
  console.log(`XML validation completed: ${validatedRecords.length}/${records.length} records passed validation`);
  return validatedRecords;
}