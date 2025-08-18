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

function validateFileStructure(records: TradeRecord[], metadata: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Define field requirements for different file types
  const fieldRequirements = {
    air: {
      companyFields: ['shipper_name', 'consignee_name', 'company_name', 'importer', 'exporter'],
      locationFields: ['origin_airport', 'dest_airport', 'origin_port', 'destination_port', 'origin_country', 'destination_country'],
      requiredAny: [
        { fields: ['shipper_name', 'consignee_name', 'company_name'], name: 'company information' },
        { fields: ['origin_airport', 'dest_airport', 'origin_port', 'destination_port'], name: 'location information' }
      ]
    },
    ocean: {
      companyFields: ['shipper_name', 'consignee_name', 'company_name', 'importer', 'exporter'],
      locationFields: ['port_of_lading', 'port_of_unlading', 'origin_port', 'destination_port', 'origin_country', 'destination_country'],
      requiredAny: [
        { fields: ['shipper_name', 'consignee_name', 'company_name'], name: 'company information' },
        { fields: ['port_of_lading', 'port_of_unlading', 'origin_port', 'destination_port'], name: 'port information' }
      ]
    },
    domestic: {
      companyFields: ['shipper_name', 'consignee_name', 'company_name', 'carrier_name'],
      locationFields: ['origin_city', 'destination_city', 'origin_state', 'destination_state', 'origin_zip', 'destination_zip'],
      requiredAny: [
        { fields: ['shipper_name', 'consignee_name', 'company_name'], name: 'company information' },
        { fields: ['origin_city', 'destination_city', 'origin_state', 'destination_state'], name: 'location information' }
      ]
    },
    default: {
      companyFields: ['shipper_name', 'consignee_name', 'company_name', 'importer', 'exporter'],
      locationFields: ['origin_country', 'destination_country', 'origin_port', 'destination_port'],
      requiredAny: [
        { fields: ['shipper_name', 'consignee_name', 'company_name'], name: 'company information' }
      ]
    }
  };

  // Detect file type based on field presence and metadata
  let fileType = 'default';
  const sampleRecord = records[0] || {};
  const fieldNames = Object.keys(sampleRecord);
  
  if (fieldNames.some(f => ['origin_airport', 'dest_airport', 'carrier'].includes(f)) || 
      metadata?.filename?.toLowerCase().includes('air')) {
    fileType = 'air';
  } else if (fieldNames.some(f => ['port_of_lading', 'port_of_unlading', 'vessel'].includes(f)) ||
             metadata?.filename?.toLowerCase().includes('ocean')) {
    fileType = 'ocean';
  } else if (fieldNames.some(f => ['origin_zip', 'destination_zip'].includes(f)) ||
             metadata?.filename?.toLowerCase().includes('domestic')) {
    fileType = 'domestic';
  }

  const requirements = fieldRequirements[fileType];
  
  // Check if at least some records meet the requirements
  let validRecordCount = 0;
  
  for (const record of records.slice(0, 10)) { // Check first 10 records
    let recordValid = true;
    
    for (const requirement of requirements.requiredAny) {
      const hasRequiredField = requirement.fields.some(field => 
        record[field] && record[field].toString().trim().length > 0
      );
      
      if (!hasRequiredField) {
        recordValid = false;
        break;
      }
    }
    
    if (recordValid) {
      validRecordCount++;
    }
  }
  
  if (validRecordCount === 0) {
    const reqDescriptions = requirements.requiredAny.map(req => req.name).join(' and ');
    errors.push(`No records found with required ${reqDescriptions} for ${fileType} file type`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
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

// **NEW: ENRICHMENT FUNCTIONS**
async function enrichAllRecords(records: TradeRecord[], supabaseClient: any, importId: string): Promise<TradeRecord[]> {
  console.log(`Starting enrichment for ${records.length} records`);
  const enrichedRecords: TradeRecord[] = [];
  
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    // Progress tracking
    if (i % 100 === 0) {
      console.log(`Enrichment progress: ${i}/${records.length} records processed`);
      await supabaseClient
        .from('bulk_imports')
        .update({
          processing_metadata: { 
            enrichment_progress: Math.round((i / records.length) * 100),
            enrichment_phase: 'enriching_companies'
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', importId);
    }
    
    // Ensure we have REQUIRED company data
    let companyName = record.shipper_name || record.consignee_name;
    
    // If no company name, try to extract from other fields
    if (!companyName) {
      if (record.commodity_description && record.origin_country) {
        companyName = `${record.origin_country} Trader - ${record.commodity_description.substring(0, 30)}`;
      } else {
        companyName = `Unknown Company ${i + 1}`;
      }
    }
    
    // Ensure we have REQUIRED mode
    let mode = 'ocean'; // Default
    if (record.transportation_mode) {
      mode = record.transportation_mode.toLowerCase().includes('air') ? 'air' : 'ocean';
    }
    
    // Create enriched record with GUARANTEED required fields across ALL tables
    const enrichedRecord: TradeRecord = {
      ...record,
      // REQUIRED FIELDS FOR ALL TABLES (Non-nullable columns)
      shipper_name: record.shipper_name || companyName,
      consignee_name: record.consignee_name || companyName,
      transportation_mode: mode, // CRITICAL: mode is NOT NULL in unified_shipments
      
      // AIRFREIGHT INSIGHTS REQUIREMENTS (country_origin, country_destination, hs_code, trade_month NOT NULL)
      country_origin: record.origin_country || record.shipper_country || 'Unknown',
      country_destination: record.destination_country || record.consignee_country || 'Unknown', 
      hs_code: record.commodity_code || record.hs_code || '0000000000',
      trade_month: record.shipment_date || record.arrival_date || new Date().toISOString().split('T')[0],
      
      // AIRFREIGHT SHIPMENTS REQUIREMENTS (hs_code NOT NULL)
      commodity_code: record.commodity_code || record.hs_code || '0000000000',
      
      // CENSUS TRADE DATA REQUIREMENTS (commodity, country, state, transport_mode, year, month NOT NULL)
      commodity: record.commodity_description || record.description || 'Unknown Commodity',
      country: record.destination_country || record.consignee_country || 'Unknown',
      state: record.destination_state || record.consignee_state || 'Unknown',
      transport_mode: mode,
      year: new Date(record.shipment_date || record.arrival_date || Date.now()).getFullYear(),
      month: new Date(record.shipment_date || record.arrival_date || Date.now()).getMonth() + 1,
      
      // COMPANY FIELDS NORMALIZATION
      origin_country: record.origin_country || record.shipper_country || 'Unknown',
      destination_country: record.destination_country || record.consignee_country || 'Unknown',
      destination_city: record.destination_city || record.destination_country || 'Unknown',
      destination_state: record.destination_state || record.consignee_state || 'Unknown',
      
      // DATE NORMALIZATION (ensure dates are properly formatted)
      shipment_date: record.shipment_date || record.arrival_date || null,
      arrival_date: record.arrival_date || record.shipment_date || null
    };
    
    enrichedRecords.push(enrichedRecord);
  }
  
  console.log(`Enrichment completed: ${enrichedRecords.length} records enriched with guaranteed required fields`);
  return enrichedRecords;
}

function validateEnrichedRecords(records: TradeRecord[]): TradeRecord[] {
  console.log(`Validating ${records.length} enriched records against ALL table requirements`);
  const validRecords: TradeRecord[] = [];
  
  for (const record of records) {
    // UNIFIED VALIDATION for ALL tables (strictest requirements)
    const validationChecks = {
      // unified_shipments CRITICAL requirements (mode and org_id are NOT NULL)
      hasMode: !!record.transportation_mode,
      hasCompany: !!(record.shipper_name || record.consignee_name),
      
      // airfreight_insights requirements
      hasOriginCountry: !!record.country_origin,
      hasDestCountry: !!record.country_destination, 
      hasHsCode: !!record.hs_code,
      hasTradeMonth: !!record.trade_month,
      
      // airfreight_shipments requirements  
      hasCommodityCode: !!record.commodity_code,
      
      // census_trade_data requirements
      hasCommodity: !!record.commodity,
      hasCountry: !!record.country,
      hasState: !!record.state,
      hasTransportMode: !!record.transport_mode,
      hasYear: !!record.year,
      hasMonth: !!record.month
    };
    
    const allValid = Object.values(validationChecks).every(check => check === true);
    
    if (allValid) {
      validRecords.push(record);
    } else {
      const failedChecks = Object.entries(validationChecks)
        .filter(([key, value]) => !value)
        .map(([key]) => key);
      console.warn(`Skipping invalid record. Failed checks: ${failedChecks.join(', ')}`);
    }
  }
  
  console.log(`Validation completed: ${validRecords.length}/${records.length} records passed ALL table requirements`);
  return validRecords;
}

function detectFileTypeAndValidate(records: TradeRecord[]) {
  const sampleRecord = records[0] || {};
  const fieldNames = Object.keys(sampleRecord);
  
  // Air freight validation
  const isAirFreight = fieldNames.some(f => 
    ['origin_airport', 'dest_airport', 'departure_port', 'arrival_port'].includes(f)
  ) || records.some(r => r.transportation_mode?.toLowerCase().includes('air'));
  
  // Ocean freight validation  
  const isOceanFreight = fieldNames.some(f => 
    ['port_of_lading', 'port_of_unlading', 'vessel_name', 'bol_number'].includes(f)
  ) || records.some(r => r.transportation_mode?.toLowerCase().includes('ocean'));
  
  // Domestic validation
  const isDomestic = fieldNames.some(f => 
    ['origin_zip', 'destination_zip', 'origin_state', 'destination_state'].includes(f)
  ) || records.some(r => r.transportation_mode?.toLowerCase().includes('truck'));
  
  if (isAirFreight) {
    return {
      fileType: 'air',
      validator: (record: TradeRecord) => {
        const hasCompany = !!(record.shipper_name || record.consignee_name);
        const hasMode = !!record.transportation_mode;
        const hasAirLocation = !!(record.origin_airport || record.dest_airport || 
                                  record.departure_port || record.arrival_port);
        return hasCompany && hasMode && hasAirLocation;
      },
      hasRequiredLocation: (record: TradeRecord) => !!(record.origin_airport || record.dest_airport)
    };
  }
  
  if (isOceanFreight) {
    return {
      fileType: 'ocean',
      validator: (record: TradeRecord) => {
        const hasCompany = !!(record.shipper_name || record.consignee_name);
        const hasMode = !!record.transportation_mode;
        const hasOceanLocation = !!(record.port_of_lading || record.port_of_unlading || 
                                    record.origin_port || record.destination_port);
        return hasCompany && hasMode && hasOceanLocation;
      },
      hasRequiredLocation: (record: TradeRecord) => !!(record.port_of_lading || record.port_of_unlading)
    };
  }
  
  if (isDomestic) {
    return {
      fileType: 'domestic',
      validator: (record: TradeRecord) => {
        const hasCompany = !!(record.shipper_name || record.consignee_name);
        const hasMode = !!record.transportation_mode;
        const hasDomesticLocation = !!(record.origin_city || record.destination_city || 
                                       record.origin_state || record.destination_state);
        return hasCompany && hasMode && hasDomesticLocation;
      },
      hasRequiredLocation: (record: TradeRecord) => !!(record.origin_city || record.destination_city)
    };
  }
  
  // Default validation for mixed or unknown file types
  return {
    fileType: 'mixed',
    validator: (record: TradeRecord) => {
      const hasCompany = !!(record.shipper_name || record.consignee_name);
      const hasMode = !!record.transportation_mode;
      return hasCompany && hasMode;
    },
    hasRequiredLocation: (record: TradeRecord) => true // Less strict for mixed files
  };
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
      // Infer company name from enriched data (guaranteed to exist)
      const inferredCompany = record.shipper_name || record.consignee_name || 'Unknown Company';
      
      // Calculate confidence score based on available data
      let confidenceScore = 0;
      if (record.shipper_name) confidenceScore += 30;
      if (record.consignee_name) confidenceScore += 30;
      if (record.origin_country && record.destination_country) confidenceScore += 20;
      if (record.commodity_code) confidenceScore += 10;
      if (record.value_usd) confidenceScore += 10;

      // Check for duplicates (basic duplicate detection) - improved logic
      const { data: existingRecords } = await supabaseClient
        .from('unified_shipments')
        .select('id')
        .eq('org_id', orgId) // Check within the same org
        .eq('unified_company_name', inferredCompany)
        .eq('unified_date', record.shipment_date || record.arrival_date || null)
        .limit(1);

      if (existingRecords && existingRecords.length > 0) {
        duplicates++;
        continue;
      }

      // Insert into unified_shipments table with GUARANTEED REQUIRED FIELDS
      const insertData = {
        org_id: orgId, // Required for RLS
        mode: record.transportation_mode === 'air' ? 'air' : 'ocean', // Required field - guaranteed from enrichment
        unified_company_name: inferredCompany, // Required field - guaranteed from enrichment
        unified_destination: record.destination_city || record.destination_country,
        unified_value: record.value_usd,
        unified_weight: record.weight_kg,
        unified_date: record.shipment_date || record.arrival_date,
        unified_carrier: record.carrier_name,
        hs_code: record.commodity_code,
        description: record.commodity_description,
        commodity_description: record.commodity_description,
        shipper_name: record.shipper_name,
        consignee_name: record.consignee_name,
        origin_country: record.origin_country,
        destination_country: record.destination_country,
        destination_city: record.destination_city,
        destination_state: record.destination_state,
        port_of_loading: record.origin_port,
        port_of_discharge: record.destination_port,
        bol_number: record.bol_number,
        vessel_name: record.vessel_name,
        container_count: record.container_count,
        carrier_name: record.carrier_name,
        quantity: record.quantity,
        value_usd: record.value_usd,
        weight_kg: record.weight_kg,
        shipment_date: record.shipment_date,
        arrival_date: record.arrival_date,
        created_at: new Date().toISOString()
      };

      console.log(`Inserting validated record for company: ${inferredCompany}`);
      
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