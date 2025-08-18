import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportRequest {
  import_id: string;
  file_path: string;
  file_type: string;
}

interface TradeRecord {
  shipper_name?: string;
  consignee_name?: string;
  origin_country?: string;
  origin_state?: string;
  origin_city?: string;
  destination_country?: string;
  destination_state?: string;
  destination_city?: string;
  commodity_code?: string;
  commodity_description?: string;
  transportation_mode?: string;
  weight_kg?: number;
  value_usd?: number;
  shipment_date?: string;
  arrival_date?: string;
  [key: string]: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { import_id, file_path, file_type }: ImportRequest = await req.json();

    console.log(`Processing import ${import_id} for file ${file_path}`);

    // Update status to processing
    await supabaseClient
      .from('bulk_imports')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', import_id);

    // Download and process file
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('bulk-imports')
      .download(file_path);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // Parse file based on type
    let records: TradeRecord[] = [];

    try {
      if (file_type === 'csv') {
        const fileText = await fileData.text();
        records = parseCSV(fileText);
      } else if (file_type === 'xml') {
        const fileText = await fileData.text();
        records = parseXML(fileText);
      } else if (file_type === 'xlsx') {
        // Parse XLSX using binary data
        const arrayBuffer = await fileData.arrayBuffer();
        records = parseXLSX(arrayBuffer);
      } else {
        throw new Error(`Unsupported file type: ${file_type}`);
      }

      console.log(`Parsed ${records.length} records from ${file_type} file`);

      // Update status to parsed
      await supabaseClient
        .from('bulk_imports')
        .update({ 
          status: 'parsed', 
          total_records: records.length,
          updated_at: new Date().toISOString() 
        })
        .eq('id', import_id);

      // Process records in batches
      const batchSize = 100;
      let processedCount = 0;
      let duplicateCount = 0;
      let errorCount = 0;

      // Update status to deduplicating
      await supabaseClient
        .from('bulk_imports')
        .update({ status: 'deduplicating', updated_at: new Date().toISOString() })
        .eq('id', import_id);

      // Process in batches
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const processedBatch = await processBatch(batch, import_id, user.id, supabaseClient);
        
        processedCount += processedBatch.processed;
        duplicateCount += processedBatch.duplicates;
        errorCount += processedBatch.errors;

        // Update progress
        await supabaseClient
          .from('bulk_imports')
          .update({
            processed_records: processedCount,
            duplicate_records: duplicateCount,
            error_records: errorCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', import_id);
      }

      // Mark as completed
      await supabaseClient
        .from('bulk_imports')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', import_id);

      // Queue enrichment for companies
      EdgeRuntime.waitUntil(queueEnrichment(import_id, supabaseClient));

      return new Response(JSON.stringify({
        success: true,
        processed: processedCount,
        duplicates: duplicateCount,
        errors: errorCount
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (parseError) {
      console.error('Parse error:', parseError);
      
      // Mark import as error
      await supabaseClient
        .from('bulk_imports')
        .update({
          status: 'error',
          error_details: { message: parseError.message },
          updated_at: new Date().toISOString()
        })
        .eq('id', import_id);

      throw parseError;
    }

  } catch (error) {
    console.error('Error in bulk-import-processor:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parseXLSX(arrayBuffer: ArrayBuffer): TradeRecord[] {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0]; // Use first sheet
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON format
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  if (jsonData.length === 0) return [];
  
  // First row should be headers
  const headers = jsonData[0] as string[];
  const records: TradeRecord[] = [];
  
  // Process each row (skip header)
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    const record: TradeRecord = {};
    
    headers.forEach((header, index) => {
      const value = row[index];
      if (value !== undefined && value !== null && value !== '') {
        const normalizedHeader = normalizeFieldName(header);
        if (normalizedHeader) {
          record[normalizedHeader] = parseValue(String(value), normalizedHeader);
        }
      }
    });
    
    if (Object.keys(record).length > 0) {
      records.push(record);
    }
  }
  
  return records;
}

function parseCSV(text: string): TradeRecord[] {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const records: TradeRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const record: TradeRecord = {};

    headers.forEach((header, index) => {
      const value = values[index];
      if (value) {
        // Map common field names
        const normalizedHeader = normalizeFieldName(header);
        if (normalizedHeader) {
          record[normalizedHeader] = parseValue(value, normalizedHeader);
        }
      }
    });

    if (Object.keys(record).length > 0) {
      records.push(record);
    }
  }

  return records;
}

function parseXML(text: string): TradeRecord[] {
  // Basic XML parsing - this would need to be enhanced based on specific XML schemas
  const records: TradeRecord[] = [];
  
  // Look for common XML patterns in trade data
  const recordPattern = /<(?:shipment|record|trade|transaction)[^>]*>(.*?)<\/(?:shipment|record|trade|transaction)>/gis;
  const matches = text.match(recordPattern);

  if (matches) {
    matches.forEach(match => {
      const record: TradeRecord = {};
      
      // Extract field values from XML
      const fieldPattern = /<([^>]+)>([^<]*)<\/[^>]+>/g;
      let fieldMatch;
      
      while ((fieldMatch = fieldPattern.exec(match)) !== null) {
        const fieldName = normalizeFieldName(fieldMatch[1]);
        const fieldValue = fieldMatch[2];
        
        if (fieldName && fieldValue) {
          record[fieldName] = parseValue(fieldValue, fieldName);
        }
      }
      
      if (Object.keys(record).length > 0) {
        records.push(record);
      }
    });
  }

  return records;
}

function normalizeFieldName(field: string): string | null {
  const normalized = field.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Map common field variations to our schema
  const fieldMap: Record<string, string> = {
    // Company names
    'shipper': 'shipper_name',
    'shippername': 'shipper_name',
    'consignee': 'consignee_name',
    'consigneename': 'consignee_name',
    'company': 'shipper_name',
    'companyname': 'shipper_name',
    
    // Locations
    'origincountry': 'origin_country',
    'originstate': 'origin_state',
    'origincity': 'origin_city',
    'destinationcountry': 'destination_country',
    'destinationstate': 'destination_state',
    'destinationcity': 'destination_city',
    'destcountry': 'destination_country',
    'deststate': 'destination_state',
    'destcity': 'destination_city',
    
    // Commodity
    'commodity': 'commodity_description',
    'commoditycode': 'commodity_code',
    'commoditydescription': 'commodity_description',
    'hscode': 'commodity_code',
    'sctgcode': 'commodity_code',
    
    // Transport
    'mode': 'transportation_mode',
    'transportmode': 'transportation_mode',
    'vessel': 'vessel_name',
    'vesselname': 'vessel_name',
    
    // Values
    'weight': 'weight_kg',
    'weightkg': 'weight_kg',
    'value': 'value_usd',
    'valueusd': 'value_usd',
    'totalvalue': 'value_usd',
    
    // Dates
    'shipmentdate': 'shipment_date',
    'arrivaldate': 'arrival_date',
    'date': 'shipment_date'
  };

  return fieldMap[normalized] || null;
}

function parseValue(value: string, fieldName: string): any {
  if (!value || value.trim() === '') return null;

  // Parse numeric fields
  if (fieldName.includes('weight') || fieldName.includes('value')) {
    const numeric = parseFloat(value.replace(/[^0-9.-]/g, ''));
    return isNaN(numeric) ? null : numeric;
  }

  // Parse dates
  if (fieldName.includes('date')) {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
  }

  return value.trim();
}

async function processBatch(
  records: TradeRecord[], 
  importId: string, 
  orgId: string, 
  supabaseClient: any
): Promise<{ processed: number; duplicates: number; errors: number }> {
  let processed = 0;
  let duplicates = 0;
  let errors = 0;

  for (const record of records) {
    try {
      // Infer company name from available data
      const inferredCompany = record.shipper_name || record.consignee_name || 'Unknown Company';
      
      // Calculate confidence score based on available data
      let confidenceScore = 0;
      if (record.shipper_name) confidenceScore += 30;
      if (record.consignee_name) confidenceScore += 30;
      if (record.origin_country && record.destination_country) confidenceScore += 20;
      if (record.commodity_code) confidenceScore += 10;
      if (record.value_usd) confidenceScore += 10;

      // Check for duplicates (basic duplicate detection)
      const { data: existingRecords } = await supabaseClient
        .from('trade_shipments')
        .select('id')
        .eq('org_id', orgId)
        .eq('inferred_company_name', inferredCompany)
        .eq('shipment_date', record.shipment_date || null)
        .eq('commodity_code', record.commodity_code || null)
        .limit(1);

      if (existingRecords && existingRecords.length > 0) {
        duplicates++;
        continue;
      }

      // Insert trade shipment record
      const { error: insertError } = await supabaseClient
        .from('trade_shipments')
        .insert({
          import_id: importId,
          org_id: orgId,
          shipper_name: record.shipper_name,
          consignee_name: record.consignee_name,
          inferred_company_name: inferredCompany,
          confidence_score: confidenceScore,
          origin_country: record.origin_country,
          origin_state: record.origin_state,
          origin_city: record.origin_city,
          destination_country: record.destination_country,
          destination_state: record.destination_state,
          destination_city: record.destination_city,
          commodity_code: record.commodity_code,
          commodity_description: record.commodity_description,
          transportation_mode: record.transportation_mode,
          weight_kg: record.weight_kg,
          value_usd: record.value_usd,
          shipment_date: record.shipment_date,
          arrival_date: record.arrival_date
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        errors++;
      } else {
        processed++;
      }

    } catch (error) {
      console.error('Processing error:', error);
      errors++;
    }
  }

  return { processed, duplicates, errors };
}

async function queueEnrichment(importId: string, supabaseClient: any) {
  console.log(`Queueing enrichment for import ${importId}`);
  
  // Get unique companies from this import
  const { data: companies } = await supabaseClient
    .from('trade_shipments')
    .select('inferred_company_name, org_id')
    .eq('import_id', importId)
    .not('inferred_company_name', 'is', null);

  const uniqueCompanies = [...new Set(companies?.map(c => c.inferred_company_name))];

  // Queue Apollo enrichment for each company
  for (const companyName of uniqueCompanies) {
    try {
      await supabaseClient.functions.invoke('apollo-enrichment', {
        body: {
          company_name: companyName,
          departments: ['sales', 'logistics', 'procurement']
        }
      });
    } catch (error) {
      console.error(`Failed to queue enrichment for ${companyName}:`, error);
    }
  }
}