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
    console.log(`Starting background processing for import ${import_id}`);

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
      console.log(`Processing file type: ${file_type}`);
      
      if (file_type === 'csv') {
        const fileText = await fileData.text();
        records = parseCSV(fileText);
      } else if (file_type === 'xml') {
        const fileText = await fileData.text();
        records = parseXML(fileText);
      } else if (file_type === 'xlsx') {
        console.log('Processing XLSX file...');
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

      // **CRITICAL: AI ENRICHMENT BEFORE DATABASE OPERATIONS**
      console.log('Starting AI enrichment phase...');
      await supabaseClient
        .from('bulk_imports')
        .update({ status: 'enriching', updated_at: new Date().toISOString() })
        .eq('id', import_id);

      // Get sample data for AI analysis (first 10 rows for better analysis)
      const sampleData = records.slice(0, Math.min(10, records.length));
      
      try {
        const aiAnalysisResponse = await supabaseClient.functions.invoke('ai-file-analyzer', {
          body: {
            import_id,
            file_sample: sampleData,
            file_type,
            filename: file_path.split('/').pop(),
            full_record_count: records.length
          }
        });
        
        if (aiAnalysisResponse.error) {
          console.error('AI analysis failed:', aiAnalysisResponse.error);
          throw new Error(`AI analysis failed: ${aiAnalysisResponse.error.message}`);
        } else {
          console.log('AI analysis completed successfully');
        }
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
        throw new Error(`AI enrichment required but failed: ${aiError.message}`);
      }

      // **STEP 2: ENRICH ALL RECORDS WITH COMPANY DATA**
      console.log('Enriching all records with company data...');
      const enrichedRecords = await enrichAllRecords(records, supabaseClient, import_id);
      
      if (enrichedRecords.length === 0) {
        throw new Error('No records could be enriched with valid company data');
      }

      console.log(`Successfully enriched ${enrichedRecords.length}/${records.length} records`);

      // **STEP 3: VALIDATE ALL ENRICHED RECORDS**
      const validatedRecords = validateEnrichedRecords(enrichedRecords);
      
      if (validatedRecords.length === 0) {
        throw new Error('No records passed validation after enrichment');
      }

      // Update status to processing_batches
      await supabaseClient
        .from('bulk_imports')
        .update({ 
          status: 'processing_batches',
          total_records: validatedRecords.length, // Update with validated count
          processing_metadata: { 
            batch_size: 500,
            total_batches: Math.ceil(validatedRecords.length / 500),
            current_batch: 0,
            enriched_records: enrichedRecords.length,
            original_records: records.length,
            validation_passed: validatedRecords.length
          },
          updated_at: new Date().toISOString() 
        })
        .eq('id', import_id);

      // Process validated records in smaller, more manageable batches
      const batchSize = 500;
      let processedCount = 0;
      let duplicateCount = 0;
      let errorCount = 0;

      console.log(`Starting batch processing: ${validatedRecords.length} validated records in batches of ${batchSize}`);

      // Process in fixed batches of 500
      for (let i = 0; i < validatedRecords.length; i += batchSize) {
        const batchNumber = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(validatedRecords.length / batchSize);
        
        console.log(`Processing batch ${batchNumber}/${totalBatches} (records ${i + 1}-${Math.min(i + batchSize, validatedRecords.length)})`);
        
        const batch = validatedRecords.slice(i, i + batchSize);
        const processedBatch = await processBatch(batch, import_id, userId, supabaseClient);
        
        processedCount += processedBatch.processed;
        duplicateCount += processedBatch.duplicates;
        errorCount += processedBatch.errors;

        // Update detailed progress after each batch
        await supabaseClient
          .from('bulk_imports')
          .update({
            processed_records: processedCount,
            duplicate_records: duplicateCount,
            error_records: errorCount,
            processing_metadata: { 
              batch_size: batchSize,
              total_batches: totalBatches,
              current_batch: batchNumber,
              progress_percentage: Math.round((processedCount / validatedRecords.length) * 100),
              enriched_records: enrichedRecords.length,
              original_records: records.length,
              validation_passed: validatedRecords.length
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', import_id);

        console.log(`Batch ${batchNumber} completed: ${processedBatch.processed} processed, ${processedBatch.duplicates} duplicates, ${processedBatch.errors} errors`);
        
        // Small delay between batches to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`Batch processing completed: ${processedCount}/${validatedRecords.length} records processed successfully`);

      // Final status update
      await supabaseClient
        .from('bulk_imports')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', import_id);

      // Queue enrichment for companies in background (optional step)
      EdgeRuntime.waitUntil(queueEnrichment(import_id, supabaseClient));

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
    console.error('Error in background processing:', error);
    
    // Mark import as error if not already marked
    await supabaseClient
      .from('bulk_imports')
      .update({
        status: 'error',
        error_details: { message: error.message },
        updated_at: new Date().toISOString()
      })
      .eq('id', import_id);
  }
}

function parseXLSX(arrayBuffer: ArrayBuffer): TradeRecord[] {
  try {
    console.log('parseXLSX: Starting XLSX parsing...');
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    console.log(`parseXLSX: Found ${workbook.SheetNames.length} sheets`);
    
    // Check if this is a multi-tab Panjiva file by looking for specific sheet patterns
    const isPanjivaMultiTab = workbook.SheetNames.length > 1 && 
      (workbook.SheetNames.some(name => name.toLowerCase().includes('contact')) ||
       workbook.SheetNames.some(name => name.toLowerCase().includes('company')) ||
       workbook.SheetNames.some(name => name.toLowerCase().includes('shipment')));
    
    if (isPanjivaMultiTab) {
      console.log('parseXLSX: Detected Panjiva multi-tab file, processing all tabs');
      return parseMultiTabPanjivaXLSX(workbook);
    }
    
    // Default single-tab processing for regular files
    const sheetName = workbook.SheetNames[0]; // Use first sheet
      console.log(`parseXLSX: Processing single sheet: ${sheetName}`);
    return parseSingleSheetXLSX(workbook, sheetName);
  } catch (error) {
    console.error('parseXLSX: Error parsing XLSX:', error);
    throw new Error(`XLSX parsing failed: ${error.message}`);
  }
}

// Multi-tab Panjiva XLSX processing (optional feature)
function parseMultiTabPanjivaXLSX(workbook: any): TradeRecord[] {
  console.log('parseMultiTabPanjivaXLSX: Starting multi-tab processing');
  
  const allRecords: TradeRecord[] = [];
  
  // Process each sheet
  for (const sheetName of workbook.SheetNames) {
    console.log(`Processing sheet: ${sheetName}`);
    
    // Determine if this sheet contains contact data or shipment data
    const isContactSheet = sheetName.toLowerCase().includes('contact') || 
                          sheetName.toLowerCase().includes('company');
    
    if (isContactSheet) {
      console.log(`Skipping contact sheet for now: ${sheetName}`);
      // TODO: Process contact sheets in future implementation
      continue;
    }
    
    // Process as regular shipment data
    const sheetRecords = parseSingleSheetXLSX(workbook, sheetName);
    allRecords.push(...sheetRecords);
  }
  
  console.log(`parseMultiTabPanjivaXLSX: Processed ${allRecords.length} total records from ${workbook.SheetNames.length} sheets`);
  return allRecords;
}

// Single sheet XLSX processing (used by both single and multi-tab)
function parseSingleSheetXLSX(workbook: any, sheetName: string): TradeRecord[] {
  console.log(`parseSingleSheetXLSX: Processing sheet: ${sheetName}`);
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON format
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  console.log(`parseSingleSheetXLSX: Converted to JSON, ${jsonData.length} rows`);

  if (jsonData.length === 0) {
    console.log('parseSingleSheetXLSX: No data found in worksheet');
    return [];
  }

  // First row should be headers
  const headers = jsonData[0] as string[];
  console.log(`parseSingleSheetXLSX: Headers found: ${headers.length} columns`);
  console.log(`parseSingleSheetXLSX: Sample headers: ${headers.slice(0, 5).join(', ')}`);

  const records: TradeRecord[] = [];

  // Process each row (skip header)
  console.log(`parseSingleSheetXLSX: Processing ${jsonData.length - 1} data rows`);

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

  console.log(`parseSingleSheetXLSX: Successfully parsed ${records.length} records from ${sheetName}`);
  return records;
}

function parseCSV(text: string): TradeRecord[] {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/\"/g, ''));
  const records: TradeRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/\"/g, ''));
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

// Enrichment and validation functions
async function enrichAllRecords(records: TradeRecord[], supabaseClient: any, importId: string): Promise<TradeRecord[]> {
  console.log(`Starting enrichment for ${records.length} records`);
  
  const enrichedRecords = [];
  const batchSize = 100;
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const enrichedBatch = await Promise.all(
      batch.map(async (record) => {
        // Enrich company names
        const enrichedRecord = { ...record };
        
        // Try to get a valid company name from available fields
        const companyFields = [
          record.unified_company_name,
          record.shipper_name,
          record.consignee_name,
          record.company_name
        ].filter(Boolean);
        
        let validCompanyName = null;
        for (const field of companyFields) {
          if (await isValidCompanyName(field, supabaseClient)) {
            validCompanyName = field;
            break;
          }
        }
        
        // If no valid company name found, queue for enrichment and use null
        if (!validCompanyName && companyFields.length > 0) {
          // Queue the invalid company for enrichment
          const invalidCompany = companyFields[0];
          console.log(`Queueing invalid company for enrichment: ${invalidCompany}`);
          
          try {
            await supabaseClient
              .from('pending_enrichment_records')
              .insert({
                org_id: record.org_id || 'bb997b6b-fa1a-46c8-9957-fabe835eee55',
                company_name: invalidCompany,
                invalid_company_name: invalidCompany,
                source_table: 'unified_shipments',
                original_data: record,
                status: 'pending'
              });
          } catch (error) {
            console.error('Error queueing company for enrichment:', error);
          }
          
          enrichedRecord.unified_company_name = null; // Will be enriched later
        } else {
          enrichedRecord.unified_company_name = validCompanyName;
        }
        
        // Ensure required fields are present
        enrichedRecord.org_id = record.org_id || 'bb997b6b-fa1a-46c8-9957-fabe835eee55';
        enrichedRecord.hs_code = record.hs_code || 'UNKNOWN';
        enrichedRecord.mode = record.mode || 'unknown';
        
        return enrichedRecord;
      })
    );
    
    enrichedRecords.push(...enrichedBatch);
    
    // Update progress
    const progressPercent = Math.round(((i + batchSize) / records.length) * 100);
    await supabaseClient
      .from('bulk_imports')
      .update({ 
        processing_metadata: { 
          phase: 'enriching',
          progress: progressPercent,
          current_batch: Math.floor(i / batchSize) + 1,
          total_batches: Math.ceil(records.length / batchSize)
        }
      })
      .eq('id', importId);
  }
  
  console.log(`Enrichment completed for ${enrichedRecords.length} records`);
  return enrichedRecords;
}

// Helper function to validate company names using database function
async function isValidCompanyName(companyName: string, supabaseClient: any): Promise<boolean> {
  if (!companyName || companyName.trim().length === 0) {
    return false;
  }
  
  try {
    const { data, error } = await supabaseClient.rpc('is_valid_company_name', {
      company_name: companyName
    });
    
    if (error) {
      console.error('Error validating company name:', error);
      return false;
    }
    
    return data;
  } catch (error) {
    console.error('Exception validating company name:', error);
    return false;
  }
}

function validateEnrichedRecords(records: TradeRecord[]): TradeRecord[] {
  console.log(`Starting validation for ${records.length} enriched records`);
  
  const validRecords = records.filter(record => {
    // Basic validation requirements
    if (!record.org_id) return false;
    if (!record.hs_code || record.hs_code === 'UNKNOWN') return false;
    if (!record.mode || record.mode === 'unknown') return false;
    
    // At least one location field should be present
    const hasLocation = record.origin_country || record.destination_country || 
                       record.origin_city || record.destination_city ||
                       record.port_of_loading || record.port_of_discharge;
    
    return hasLocation;
  });
  
  console.log(`Validation completed: ${validRecords.length}/${records.length} records passed`);
  return validRecords;
}

// Helper functions
function normalizeFieldName(field: string): string | null {
  if (!field) return null;
  
  const normalized = field.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\\w]/g, '')
    .trim();

  // Map various field name variations to standardized names
  const fieldMappings: { [key: string]: string } = {
    // Company fields
    'shipper': 'shipper_name',
    'shippername': 'shipper_name',
    'shipper_company': 'shipper_name',
    'consignee': 'consignee_name',
    'consigneename': 'consignee_name',
    'consignee_company': 'consignee_name',
    'company': 'company_name',
    'companyname': 'company_name',
    'importer': 'consignee_name',
    'exporter': 'shipper_name',
    
    // Location fields
    'origin': 'origin_country',
    'origincountry': 'origin_country',
    'destination': 'destination_country',
    'destinationcountry': 'destination_country',
    'origincity': 'origin_city',
    'destinationcity': 'destination_city',
    'originstate': 'origin_state',
    'destinationstate': 'destination_state',
    'originzip': 'origin_zip',
    'destinationzip': 'destination_zip',
    
    // Port fields
    'portofloading': 'port_of_loading',
    'portofunlading': 'port_of_discharge',
    'portofdischarge': 'port_of_discharge',
    'loadport': 'port_of_loading',
    'dischargeport': 'port_of_discharge',
    'originport': 'port_of_loading',
    'destinationport': 'port_of_discharge',
    
    // Date fields
    'date': 'shipment_date',
    'shipmentdate': 'shipment_date',
    'shippingdate': 'shipment_date',
    'arrivaldate': 'arrival_date',
    'departuredate': 'departure_date',
    
    // Commodity fields
    'commodity': 'commodity_description',
    'commoditydescription': 'commodity_description',
    'description': 'commodity_description',
    'goods': 'commodity_description',
    'goodsdescription': 'commodity_description',
    'hscode': 'hs_code',
    'commoditycode': 'commodity_code',
    
    // Value and weight fields
    'value': 'value_usd',
    'valueusd': 'value_usd',
    'amount': 'value_usd',
    'weight': 'weight_kg',
    'weightkg': 'weight_kg',
    'quantity': 'quantity',
    'qty': 'quantity',
    
    // Transport fields
    'mode': 'mode',
    'transportmode': 'mode',
    'transportationmode': 'mode',
    'vessel': 'vessel_name',
    'vesselname': 'vessel_name',
    'carrier': 'carrier_name',
    'carriername': 'carrier_name',
    
    // Container fields
    'container': 'container_number',
    'containernumber': 'container_number',
    'containercount': 'container_count',
    'containers': 'container_count',
    
    // Bill of lading
    'bol': 'bol_number',
    'bolnumber': 'bol_number',
    'billofladingno': 'bol_number'
  };

  return fieldMappings[normalized] || normalized;
}

function parseValue(value: string, fieldName: string): any {
  if (!value || value.trim() === '') return null;
  
  const trimmed = value.trim();
  
  // Parse numeric fields
  if (['weight_kg', 'value_usd', 'quantity', 'container_count'].includes(fieldName)) {
    const numericValue = parseFloat(trimmed.replace(/[,$]/g, ''));
    return isNaN(numericValue) ? null : numericValue;
  }
  
  // Parse date fields
  if (['shipment_date', 'arrival_date', 'departure_date'].includes(fieldName)) {
    const date = new Date(trimmed);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
  }
  
  // Clean and return string fields
  return trimmed;
}

async function processBatch(records: TradeRecord[], importId: string, userId: string, supabaseClient: any) {
  let processed = 0;
  let duplicates = 0;
  let errors = 0;

  console.log(`Processing batch of ${records.length} records for import ${importId}`);

  // Check for duplicates before inserting
  const recordsToInsert = [];
  
  for (const record of records) {
    try {
      // Check for existing record based on key fields
      const { data: existingRecords, error: checkError } = await supabaseClient
        .from('unified_shipments')
        .select('id')
        .eq('org_id', record.org_id)
        .eq('hs_code', record.hs_code)
        .eq('shipper_name', record.shipper_name || '')
        .eq('consignee_name', record.consignee_name || '')
        .eq('shipment_date', record.shipment_date || null)
        .limit(1);

      if (checkError) {
        console.error('Error checking for duplicates:', checkError);
        errors++;
        continue;
      }

      if (existingRecords && existingRecords.length > 0) {
        duplicates++;
        continue;
      }

      recordsToInsert.push({
        ...record,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error processing record:', error);
      errors++;
    }
  }

  // Insert records in smaller sub-batches
  const subBatchSize = 100;
  for (let i = 0; i < recordsToInsert.length; i += subBatchSize) {
    const subBatch = recordsToInsert.slice(i, i + subBatchSize);
    
    try {
      const { error: insertError } = await supabaseClient
        .from('unified_shipments')
        .insert(subBatch);

      if (insertError) {
        console.error('Error inserting sub-batch:', insertError);
        errors += subBatch.length;
      } else {
        processed += subBatch.length;
        console.log(`Successfully inserted sub-batch of ${subBatch.length} records`);
      }
    } catch (error) {
      console.error('Exception inserting sub-batch:', error);
      errors += subBatch.length;
    }
  }

  console.log(`Batch processing completed: ${processed} processed, ${duplicates} duplicates, ${errors} errors`);
  
  return { processed, duplicates, errors };
}

async function queueEnrichment(importId: string, supabaseClient: any) {
  try {
    console.log(`Queueing enrichment for import ${importId}`);
    
    // Get unique company names from the import
    const { data: companies, error } = await supabaseClient
      .from('unified_shipments')
      .select('unified_company_name')
      .not('unified_company_name', 'is', null)
      .neq('unified_company_name', '')
      .limit(1000);

    if (error) {
      console.error('Error fetching companies for enrichment:', error);
      return;
    }

    const uniqueCompanies = [...new Set(companies?.map(c => c.unified_company_name) || [])];
    console.log(`Found ${uniqueCompanies.length} unique companies to potentially enrich`);

    // Queue companies for enrichment (this would typically be a separate process)
    for (const companyName of uniqueCompanies.slice(0, 50)) { // Limit to first 50
      try {
        await supabaseClient.functions.invoke('contact-enrichment', {
          body: { company_name: companyName }
        });
      } catch (enrichError) {
        console.error(`Error enriching company ${companyName}:`, enrichError);
      }
    }

    console.log('Enrichment queueing completed');
  } catch (error) {
    console.error('Error in queueEnrichment:', error);
  }
}
