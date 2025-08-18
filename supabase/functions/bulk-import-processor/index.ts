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

    // Start background processing - this allows the entire file to be processed
    EdgeRuntime.waitUntil(processFileInBackground(supabaseClient, import_id, file_path, file_type, user.id));

    // Return immediate response to prevent timeout
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'File processing started in background',
      import_id 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in bulk import processor:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Background processing function that handles the entire file
async function processFileInBackground(supabaseClient: any, import_id: string, file_path: string, file_type: string, userId: string) {
  try {

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
      console.log(`Processing file type: ${file_type}`);
      
      if (file_type === 'csv') {
        const fileText = await fileData.text();
        records = parseCSV(fileText);
      } else if (file_type === 'xml') {
        const fileText = await fileData.text();
        records = parseXML(fileText);
      } else if (file_type === 'xlsx') {
        console.log('Processing XLSX file...');
        // Parse XLSX using streaming approach to avoid memory issues
        const arrayBuffer = await fileData.arrayBuffer();
        console.log(`ArrayBuffer size: ${arrayBuffer.byteLength}`);
        
        // Check file size and refuse if too large (>5MB)
        if (arrayBuffer.byteLength > 5 * 1024 * 1024) {
          throw new Error('File too large. Please upload files smaller than 5MB.');
        }
        
        records = parseXLSX(arrayBuffer);
        console.log(`Parsed ${records.length} records from XLSX`);
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

      // Process records in batches - adjust based on file size
      const batchSize = Math.min(records.length > 10000 ? 50 : 100, 500);
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
      // Queue enrichment in background to avoid timeout
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
  try {
    console.log('parseXLSX: Starting XLSX parsing...');
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    console.log(`parseXLSX: Found ${workbook.SheetNames.length} sheets`);
    
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    console.log(`parseXLSX: Processing sheet: ${sheetName}`);
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON format
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log(`parseXLSX: Converted to JSON, ${jsonData.length} rows`);
  
  if (jsonData.length === 0) {
    console.log('parseXLSX: No data found in worksheet');
    return [];
  }
  
  // First row should be headers
  const headers = jsonData[0] as string[];
  console.log(`parseXLSX: Headers found: ${headers.length} columns`);
  console.log(`parseXLSX: Sample headers: ${headers.slice(0, 5).join(', ')}`);
  
  const records: TradeRecord[] = [];
  
  // Process each row (skip header) - Process ALL records in background
  console.log(`parseXLSX: Processing ${jsonData.length - 1} data rows`);
  
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
  
  console.log(`parseXLSX: Successfully parsed ${records.length} records`);
  return records;
  } catch (error) {
    console.error('parseXLSX: Error parsing XLSX:', error);
    throw new Error(`XLSX parsing failed: ${error.message}`);
  }
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
  
  // Map common field variations to our schema - Enhanced for Panjiva data
  const fieldMap: Record<string, string> = {
    // Company names - Panjiva specific
    'shipper': 'shipper_name',
    'shippername': 'shipper_name',
    'shipperfullname': 'shipper_name',
    'consignee': 'consignee_name',
    'consigneename': 'consignee_name',
    'consigneefullname': 'consignee_name',
    'company': 'shipper_name',
    'companyname': 'shipper_name',
    'importer': 'consignee_name',
    'exporter': 'shipper_name',
    
    // Locations - Panjiva specific
    'origincountry': 'origin_country',
    'originstate': 'origin_state', 
    'origincity': 'origin_city',
    'originport': 'origin_port',
    'destinationcountry': 'destination_country',
    'destinationstate': 'destination_state',
    'destinationcity': 'destination_city',
    'destinationport': 'destination_port',
    'destcountry': 'destination_country',
    'deststate': 'destination_state',
    'destcity': 'destination_city',
    'portofloading': 'origin_port',
    'portofdischarge': 'destination_port',
    'portofunlading': 'destination_port',
    'city': 'destination_city',
    'state': 'destination_state',
    'country': 'destination_country',
    
    // Commodity - Panjiva specific
    'commodity': 'commodity_description',
    'commoditycode': 'commodity_code',
    'commoditydescription': 'commodity_description',
    'hscode': 'commodity_code',
    'sctgcode': 'commodity_code',
    'description': 'commodity_description',
    'productdescription': 'commodity_description',
    'goodsdescription': 'commodity_description',
    
    // Transport - Panjiva specific
    'mode': 'transportation_mode',
    'transportmode': 'transportation_mode',
    'transportationmode': 'transportation_mode',
    'vessel': 'vessel_name',
    'vesselname': 'vessel_name',
    'carriercode': 'carrier_code',
    'carrier': 'carrier_name',
    'carriername': 'carrier_name',
    
    // Values - Panjiva specific
    'weight': 'weight_kg',
    'weightkg': 'weight_kg',
    'grossweight': 'weight_kg',
    'netweight': 'weight_kg',
    'quantity': 'quantity',
    'qty': 'quantity',
    'value': 'value_usd',
    'valueusd': 'value_usd',
    'totalvalue': 'value_usd',
    'customsvalue': 'value_usd',
    'declaredvalue': 'value_usd',
    
    // Dates - Panjiva specific
    'shipmentdate': 'shipment_date',
    'arrivaldate': 'arrival_date',
    'date': 'shipment_date',
    'departuredate': 'shipment_date',
    'etd': 'shipment_date',
    'eta': 'arrival_date',
    
    // Panjiva specific fields
    'billofladingno': 'bol_number',
    'billofladingnumber': 'bol_number',
    'bolnumber': 'bol_number',
    'masterbolnumber': 'bol_number',
    'consigneeid': 'consignee_id',
    'shipperid': 'shipper_id',
    'containercount': 'container_count',
    'teu': 'container_count'
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
        .from('unified_shipments')
        .select('id')
        .eq('unified_company_name', inferredCompany)
        .eq('unified_date', record.shipment_date || null)
        .eq('hs_code', record.commodity_code || null)
        .limit(1);

      if (existingRecords && existingRecords.length > 0) {
        duplicates++;
        continue;
      }

      // Insert into unified_shipments table with enhanced mapping
      const insertData = {
        org_id: orgId,
        unified_company_name: inferredCompany,
        inferred_company_name: inferredCompany, // Keep this for search compatibility
        mode: record.transportation_mode === 'air' ? 'air' : 'ocean', // Normalize mode
        transport_mode: record.transportation_mode || 'ocean',
        shipper_name: record.shipper_name,
        consignee_name: record.consignee_name,
        origin_country: record.origin_country,
        destination_country: record.destination_country,
        destination_city: record.destination_city,
        destination_state: record.destination_state,
        unified_date: record.shipment_date || record.arrival_date,
        shipment_date: record.shipment_date, // Keep for compatibility
        arrival_date: record.arrival_date,
        unified_value: record.value_usd,
        value_usd: record.value_usd, // Keep for compatibility
        unified_weight: record.weight_kg,
        weight_kg: record.weight_kg, // Keep for compatibility
        hs_code: record.commodity_code,
        commodity_description: record.commodity_description,
        description: record.commodity_description, // Alias
        vessel_name: record.vessel_name,
        port_of_loading: record.origin_port,
        port_of_discharge: record.destination_port,
        bol_number: record.bol_number,
        container_count: record.container_count,
        carrier_name: record.carrier_name,
        quantity: record.quantity,
        created_at: new Date().toISOString()
      };

      console.log(`Inserting record for company: ${inferredCompany}`);
      
      const { error: insertError } = await supabaseClient
        .from('unified_shipments')
        .insert(insertData);

      if (insertError) {
        console.error(`Insert error for company ${inferredCompany}:`, insertError);
        console.error('Failed record data:', JSON.stringify(insertData, null, 2));
        errors++;
      } else {
        console.log(`Successfully inserted record for ${inferredCompany}`);
        processed++;
      }

    } catch (error) {
      console.error('Processing error for record:', error);
      console.error('Record data:', JSON.stringify(record, null, 2));
      errors++;
    }
  }

  console.log(`Batch complete: ${processed} processed, ${duplicates} duplicates, ${errors} errors`);
  return { processed, duplicates, errors };
}

async function queueEnrichment(importId: string, supabaseClient: any) {
  console.log(`Queueing enrichment for import ${importId}`);
  
  // Get unique companies from this import
  const { data: companies } = await supabaseClient
    .from('unified_shipments')
    .select('unified_company_name')
    .not('unified_company_name', 'is', null);

  const uniqueCompanies = [...new Set(companies?.map(c => c.unified_company_name))];

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