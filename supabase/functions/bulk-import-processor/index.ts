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

interface ContactRecord {
  company_name?: string;
  full_name?: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  country?: string;
  city?: string;
  notes?: string;
  tags?: string[];
  source?: string;
  [key: string]: any;
}

interface ProcessedData {
  tradeRecords: TradeRecord[];
  contactRecords: ContactRecord[];
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

    // Parse file based on type - now supports dual data streams
    let processedData: ProcessedData = { tradeRecords: [], contactRecords: [] };

    try {
      console.log(`Processing file type: ${file_type}`);
      
      if (file_type === 'csv') {
        const fileText = await fileData.text();
        processedData.tradeRecords = parseCSV(fileText);
      } else if (file_type === 'xml') {
        const fileText = await fileData.text();
        processedData.tradeRecords = parseXML(fileText);
      } else if (file_type === 'xlsx') {
        console.log('Processing XLSX file...');
        const arrayBuffer = await fileData.arrayBuffer();
        console.log(`ArrayBuffer size: ${arrayBuffer.byteLength}`);
        
        // File size restriction removed for CSV/XLSX files
        
        processedData = parseXLSXWithContacts(arrayBuffer);
        console.log(`Parsed ${processedData.tradeRecords.length} trade records and ${processedData.contactRecords.length} contact records from XLSX`);
      } else {
        throw new Error(`Unsupported file type: ${file_type}`);
      }

      const records = processedData.tradeRecords;

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

      // **STEP 2: PROCESS RECORDS BASED ON FILE TYPE - NO GLOBAL AI ENRICHMENT**

      let finalRecords;
      
      if (file_type === 'xml') {
        // XML files: Call dedicated XML AI enrichment function
        console.log('XML file: Calling XML AI enrichment function...');
        const xmlEnrichmentResponse = await supabaseClient.functions.invoke('xml-ai-enrichment', {
          body: {
            import_id,
            records,
            filename: file_path.split('/').pop()
          }
        });
        
        if (xmlEnrichmentResponse.error) {
          console.error('XML enrichment failed:', xmlEnrichmentResponse.error);
          throw new Error(`XML enrichment failed: ${xmlEnrichmentResponse.error.message}`);
        }
        
        finalRecords = xmlEnrichmentResponse.data.enriched_records;
        
        if (finalRecords.length === 0) {
          throw new Error('No records could be enriched with valid company data');
        }

        console.log(`XML enrichment completed: ${finalRecords.length}/${records.length} records processed`);
      } else {
        // CSV/XLSX files: NO enrichment, NO validation (except duplicates later)
        console.log(`${file_type.toUpperCase()} file: Processing without enrichment or validation...`);
        finalRecords = records; // Use records as-is, no enrichment or validation
      }

      // Update status to processing
      await supabaseClient
        .from('bulk_imports')
        .update({ 
          status: 'processing',
          total_records: finalRecords.length,
          processing_metadata: { 
            batch_size: 500,
            total_batches: Math.ceil(finalRecords.length / 500),
            current_batch: 0,
            file_type: file_type,
            processing_mode: file_type === 'xml' ? 'enriched_and_validated' : 'as_is_with_duplicates_only',
            original_records: records.length,
            final_records: finalRecords.length
          },
          updated_at: new Date().toISOString() 
        })
        .eq('id', import_id);

      // **STEP 4: PROCESS CONTACT RECORDS (PARALLEL TO TRADE RECORDS)**
      let contactProcessedCount = 0;
      if (processedData.contactRecords.length > 0) {
        console.log(`Processing ${processedData.contactRecords.length} contact records...`);
        const linkedContacts = linkContactsToCompanies(processedData.contactRecords, finalRecords);
        contactProcessedCount = await processContactBatch(linkedContacts, import_id, userId, supabaseClient);
        console.log(`Successfully processed ${contactProcessedCount} contact records`);
      }

      // Process validated trade records in smaller, more manageable batches
      const batchSize = 500;
      let processedCount = 0;
      let duplicateCount = 0;
      let errorCount = 0;

      console.log(`Starting batch processing: ${finalRecords.length} trade records in batches of ${batchSize}`);

      // Process in fixed batches of 500
      for (let i = 0; i < finalRecords.length; i += batchSize) {
        const batchNumber = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(finalRecords.length / batchSize);
        
        console.log(`Processing trade batch ${batchNumber}/${totalBatches} (records ${i + 1}-${Math.min(i + batchSize, finalRecords.length)})`);

        const batch = finalRecords.slice(i, i + batchSize);
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
              progress_percentage: Math.round((processedCount / finalRecords.length) * 100),
              enriched_records: finalRecords.length,
              original_records: records.length,
              validation_passed: finalRecords.length,
              contact_records_processed: contactProcessedCount,
              contact_records_total: processedData.contactRecords.length
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', import_id);

        console.log(`Batch ${batchNumber} completed: ${processedBatch.processed} processed, ${processedBatch.duplicates} duplicates, ${processedBatch.errors} errors`);
        
        // Small delay between batches to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`Batch processing completed: ${processedCount}/${finalRecords.length} records processed successfully`);

      // Final status update
      await supabaseClient
        .from('bulk_imports')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', import_id);

      // Apollo enrichment removed - only store data during file upload
      console.log('File processing completed - data stored without external enrichment');

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

function parseXLSXWithContacts(arrayBuffer: ArrayBuffer): ProcessedData {
  try {
    console.log('parseXLSXWithContacts: Starting XLSX parsing...');
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    console.log(`parseXLSXWithContacts: Found ${workbook.SheetNames.length} sheets`);
    
    // Check if this is a multi-tab Panjiva file by looking for specific sheet patterns
    const isPanjivaMultiTab = workbook.SheetNames.length > 1 && 
      (workbook.SheetNames.some(name => name.toLowerCase().includes('contact')) ||
       workbook.SheetNames.some(name => name.toLowerCase().includes('company')) ||
       workbook.SheetNames.some(name => name.toLowerCase().includes('shipment')));
    
    if (isPanjivaMultiTab) {
      console.log('parseXLSXWithContacts: Detected Panjiva multi-tab file, processing all tabs');
      return parseMultiTabPanjivaXLSXWithContacts(workbook);
    }
    
    // Default single-tab processing for regular files
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    console.log(`parseXLSXWithContacts: Processing single sheet: ${sheetName}`);
    return {
      tradeRecords: parseSingleSheetXLSX(workbook, sheetName),
      contactRecords: []
    };
  } catch (error) {
    console.error('parseXLSXWithContacts: Error parsing XLSX:', error);
    throw new Error(`XLSX parsing failed: ${error.message}`);
  }
}

// Multi-tab Panjiva XLSX processing with contact support
function parseMultiTabPanjivaXLSXWithContacts(workbook: any): ProcessedData {
  console.log('parseMultiTabPanjivaXLSXWithContacts: Starting multi-tab processing');
  
  const tradeRecords: TradeRecord[] = [];
  const contactRecords: ContactRecord[] = [];
  
  // Process each sheet
  for (const sheetName of workbook.SheetNames) {
    console.log(`Processing sheet: ${sheetName}`);
    
    // Determine if this sheet contains contact data or shipment data
    const isContactSheet = sheetName.toLowerCase().includes('contact') || 
                          sheetName.toLowerCase().includes('company');
    
    if (isContactSheet) {
      console.log(`Processing contact sheet: ${sheetName}`);
      const sheetContacts = parseContactSheet(workbook, sheetName);
      contactRecords.push(...sheetContacts);
    } else {
      // Process as regular shipment data
      const sheetRecords = parseSingleSheetXLSX(workbook, sheetName);
      tradeRecords.push(...sheetRecords);
    }
  }
  
  console.log(`parseMultiTabPanjivaXLSXWithContacts: Processed ${tradeRecords.length} trade records and ${contactRecords.length} contact records from ${workbook.SheetNames.length} sheets`);
  return { tradeRecords, contactRecords };
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

// Contact sheet processing for multi-tab files
function parseContactSheet(workbook: any, sheetName: string): ContactRecord[] {
  console.log(`parseContactSheet: Processing contact sheet: ${sheetName}`);
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON format
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  console.log(`parseContactSheet: Converted to JSON, ${jsonData.length} rows`);

  if (jsonData.length === 0) {
    console.log('parseContactSheet: No data found in worksheet');
    return [];
  }

  // First row should be headers
  const headers = jsonData[0] as string[];
  console.log(`parseContactSheet: Headers found: ${headers.length} columns`);
  console.log(`parseContactSheet: Sample headers: ${headers.slice(0, 5).join(', ')}`);

  const records: ContactRecord[] = [];

  // Process each row (skip header)
  console.log(`parseContactSheet: Processing ${jsonData.length - 1} contact rows`);

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    const record: ContactRecord = { source: 'panjiva_multitab' };

    headers.forEach((header, index) => {
      const value = row[index];
      if (value !== undefined && value !== null && value !== '') {
        const normalizedHeader = normalizeContactFieldName(header);
        if (normalizedHeader) {
          record[normalizedHeader] = parseContactValue(String(value), normalizedHeader);
        }
      }
    });

    // Ensure we have at least company name
    if (record.company_name && record.company_name.toString().trim().length > 0) {
      records.push(record);
    }
  }

  console.log(`parseContactSheet: Successfully parsed ${records.length} contact records from ${sheetName}`);
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
async function enrichAllRecords(records: TradeRecord[], supabaseClient: any, importId: string, fileType: string): Promise<TradeRecord[]> {
  console.log(`Starting enrichment for ${records.length} records (file type: ${fileType})`);
  
  const enrichedRecords = [];
  const batchSize = 100;
  
  // File-type-specific processing logic
  const isExcelFile = fileType.toLowerCase() === 'xlsx';
  const isXmlFile = fileType.toLowerCase() === 'xml';
  
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
        
        // File-type-specific validation approach
        if (isExcelFile) {
          // For Excel files: Use relaxed validation, accept first available company name
          console.log(`Excel file: Using relaxed validation for company names`);
          for (const field of companyFields) {
            if (await isValidCompanyNameExcel(field, supabaseClient)) {
              validCompanyName = field;
              break;
            }
          }
          // For Excel, even if no "valid" company name, still use the first available
          if (!validCompanyName && companyFields.length > 0) {
            validCompanyName = companyFields[0];
            console.log(`Excel file: Using first available company name: ${validCompanyName}`);
          }
        } else if (isXmlFile) {
          // For XML files: Use strict validation
          console.log(`XML file: Using strict validation for company names`);
          for (const field of companyFields) {
            if (await isValidCompanyName(field, supabaseClient)) {
              validCompanyName = field;
              break;
            }
          }
        } else {
          // For CSV files: Use relaxed validation (same as Excel)
          console.log(`CSV file: Using relaxed validation for company names (same as Excel)`);
          for (const field of companyFields) {
            if (await isValidCompanyNameExcel(field, supabaseClient)) {
              validCompanyName = field;
              break;
            }
          }
          // For CSV, even if no "valid" company name, still use the first available (like Excel)
          if (!validCompanyName && companyFields.length > 0) {
            validCompanyName = companyFields[0];
            console.log(`CSV file: Using first available company name: ${validCompanyName}`);
          }
        }
        
        // Queue for enrichment only for XML files with invalid company names
        if (!validCompanyName && companyFields.length > 0 && isXmlFile) {
          // Queue the invalid company for enrichment (XML only)
          const invalidCompany = companyFields[0];
          console.log(`XML file: Queueing invalid company for enrichment: ${invalidCompany}`);
          
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
        
        // File-type-specific field handling
        if (isExcelFile) {
          // Excel: More flexible field handling - accept sparse data
          enrichedRecord.org_id = record.org_id || 'bb997b6b-fa1a-46c8-9957-fabe835eee55';
          enrichedRecord.hs_code = record.hs_code || null; // Allow null for Excel
          enrichedRecord.mode = record.mode || null; // Allow null for Excel
        } else if (fileType === 'xml') {
          // XML: Standard field handling (strict)
          enrichedRecord.org_id = record.org_id || 'bb997b6b-fa1a-46c8-9957-fabe835eee55';
          enrichedRecord.hs_code = record.hs_code || 'PENDING_ENRICHMENT';
          enrichedRecord.mode = record.mode || 'PENDING_ENRICHMENT';
        } else {
          // CSV: Flexible field handling (same as Excel) - accept sparse data
          enrichedRecord.org_id = record.org_id || 'bb997b6b-fa1a-46c8-9957-fabe835eee55';
          enrichedRecord.hs_code = record.hs_code || null; // Allow null for CSV (like Excel)
          enrichedRecord.mode = record.mode || null; // Allow null for CSV (like Excel)
        }
        
        console.log(`Enriched record (${fileType}): company=${enrichedRecord.unified_company_name || 'NULL'}, hs_code=${enrichedRecord.hs_code || 'NULL'}, mode=${enrichedRecord.mode || 'NULL'}`);
        
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

// Helper function to validate company names using database function (STRICT for XML)
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

// Excel-specific relaxed company name validation
async function isValidCompanyNameExcel(companyName: string, supabaseClient: any): Promise<boolean> {
  if (!companyName || companyName.trim().length === 0) {
    return false;
  }
  
  try {
    const { data, error } = await supabaseClient.rpc('is_valid_company_name_excel', {
      company_name: companyName
    });
    
    if (error) {
      console.log('Excel validation: Database function not found, using fallback validation');
      // Fallback: More permissive validation for Excel files
      const trimmed = companyName.trim();
      
      // Accept if:
      // 1. Not null and not empty
      // 2. More than 1 character (very permissive)
      // 3. Contains at least one letter
      if (trimmed.length > 1 && /[a-zA-Z]/.test(trimmed)) {
        return true;
      }
      
      return false;
    }
    
    return data;
  } catch (error) {
    console.log('Excel validation: Exception, using fallback validation');
    // Fallback: More permissive validation for Excel files
    const trimmed = companyName.trim();
    
    // Accept if:
    // 1. Not null and not empty
    // 2. More than 1 character (very permissive)
    // 3. Contains at least one letter
    if (trimmed.length > 1 && /[a-zA-Z]/.test(trimmed)) {
      return true;
    }
    
    return false;
  }
}

// File-type-specific validation functions
function validateEnrichedRecordsByFileType(records: TradeRecord[], fileType: string): TradeRecord[] {
  console.log(`Starting validation for ${records.length} enriched records with file-type-specific rules (${fileType})`);
  
  const isExcelFile = fileType.toLowerCase() === 'xlsx';
  const isXmlFile = fileType.toLowerCase() === 'xml';
  
  if (isExcelFile) {
    return validateXLSXRecords(records);
  } else if (isXmlFile) {
    return validateXMLRecords(records);
  } else {
    return validateCSVRecords(records);
  }
}

// XLSX/Excel validation - MINIMAL REQUIREMENTS
function validateXLSXRecords(records: TradeRecord[]): TradeRecord[] {
  console.log(`Excel validation: Using MINIMAL validation - accepting sparse data`);
  
  const validRecords = [];
  const failedRecords = [];
  
  for (const record of records) {
    const failures = [];
    
    // NO VALIDATION for Excel files - accept everything
    // Completely permissive upload
    
    // Accept ALL records with org_id - even completely sparse data
    // This handles Excel files with lots of empty cells
    
    if (failures.length === 0) {
      validRecords.push(record);
    } else {
      failedRecords.push({ failures, sample_data: {
        org_id: record.org_id,
        hs_code: record.hs_code || 'SPARSE_DATA',
        mode: record.mode || 'SPARSE_DATA',
        unified_company_name: record.unified_company_name || 'SPARSE_DATA'
      }});
    }
  }
  
  console.log(`Excel validation completed: ${validRecords.length}/${records.length} records passed (minimal validation)`);
  console.log(`Excel files: Accepting all sparse data to maximize import success`);
  
  return validRecords;
}

// XML validation - STRICT REQUIREMENTS
function validateXMLRecords(records: TradeRecord[]): TradeRecord[] {
  console.log(`XML validation: Using STRICT validation - ensuring data quality`);
  
  const validRecords = [];
  const failedRecords = [];
  
  for (const record of records) {
    const failures = [];
    
    // STRICT VALIDATION for XML files
    if (!record.org_id) {
      failures.push('missing org_id');
    }
    
    if (!record.hs_code || record.hs_code === 'PENDING_ENRICHMENT') {
      failures.push('missing or invalid hs_code');
    }
    
    if (!record.mode || record.mode === 'PENDING_ENRICHMENT') {
      failures.push('missing or invalid mode');
    }
    
    if (!record.unified_company_name) {
      failures.push('missing unified_company_name');
    }
    
    if (failures.length === 0) {
      validRecords.push(record);
    } else {
      failedRecords.push({ failures, sample_data: {
        org_id: record.org_id,
        hs_code: record.hs_code,
        mode: record.mode,
        origin_country: record.origin_country,
        destination_country: record.destination_country,
        unified_company_name: record.unified_company_name
      }});
    }
  }
  
  console.log(`XML validation completed: ${validRecords.length}/${records.length} records passed (strict validation)`);
  
  if (failedRecords.length > 0) {
    console.log('XML validation failures:', JSON.stringify(failedRecords.slice(0, 3), null, 2));
  }
  
  return validRecords;
}

// CSV validation - MINIMAL REQUIREMENTS (same as XLSX)
function validateCSVRecords(records: TradeRecord[]): TradeRecord[] {
  console.log(`CSV validation: Using MINIMAL validation - accepting sparse data (same as XLSX)`);
  
  const validRecords = [];
  const failedRecords = [];
  
  for (const record of records) {
    const failures = [];
    
    // NO VALIDATION for CSV files - accept everything  
    // Completely permissive upload (same as XLSX)
    
    // Accept ALL records with org_id - even completely sparse data
    // This handles CSV files with lots of empty cells (from Panjiva)
    
    if (failures.length === 0) {
      validRecords.push(record);
    } else {
      failedRecords.push({ failures, sample_data: {
        org_id: record.org_id,
        hs_code: record.hs_code || 'SPARSE_DATA',
        mode: record.mode || 'SPARSE_DATA',
        unified_company_name: record.unified_company_name || 'SPARSE_DATA'
      }});
    }
  }
  
  console.log(`CSV validation completed: ${validRecords.length}/${records.length} records passed (minimal validation)`);
  console.log(`CSV files: Accepting all sparse data to maximize import success (same as XLSX)`);
  
  return validRecords;
}

// Legacy validation function - now redirects to file-type-specific validation
function validateEnrichedRecords(records: TradeRecord[]): TradeRecord[] {
  console.log(`Legacy validation function called - using flexible validation as fallback`);
  return validateCSVRecords(records); // Default to medium validation
}

// Helper functions
function normalizeFieldName(field: string): string | null {
  if (!field) return null;
  
  const normalized = field.toLowerCase()
    .replace(/[^\w]/g, '')
    .trim();

  // Comprehensive mappings for your Excel column headers
  const fieldMappings: { [key: string]: string } = {
    // Basic company/shipper/consignee mappings
    'billofladingnumber': 'bol_number',
    'arrivaldate': 'arrival_date', 
    'matchingfields': 'matching_fields',
    'consignee': 'consignee_name',
    'consigneeaddress': 'consignee_address',
    'consigneecity': 'consignee_city',
    'consigneestateregion': 'consignee_state_region',
    'consigneepostalcode': 'consignee_postal_code',
    'consigneefulladdress': 'consignee_full_address',
    'consigneeemail1': 'consignee_email_1',
    'consigneephone1': 'consignee_phone_1',
    'consigneewebsite1': 'consignee_website_1',
    'consigneeindustry': 'consignee_industry',
    'consigneerevenue': 'consignee_revenue',
    'consigneeemployees': 'consignee_employees',
    'consigneetraderoles': 'consignee_trade_roles',
    'shipper': 'shipper_name',
    'shipperaddress': 'shipper_address',
    'shippercity': 'shipper_city',
    'shipperstateregion': 'shipper_state_region',
    'shipperpostalcode': 'shipper_postal_code',
    'shipperfulladdress': 'shipper_full_address',
    'shipperemail1': 'shipper_email_1',
    'shipperphone1': 'shipper_phone_1',
    'shipperindustry': 'shipper_industry',
    'shipperrevenue': 'shipper_revenue',
    'shipperemployees': 'shipper_employees',
    'shippertraderoles': 'shipper_trade_roles',
    'shipmentorigin': 'shipment_origin',
    'shipmentdestination': 'shipment_destination',
    'shipmentdestinationregion': 'shipment_destination_region',
    'portofunlading': 'port_of_unlading',
    'portofunladingregion': 'port_of_unlading_region',
    'portoflading': 'port_of_lading',
    'portofladingregion': 'port_of_lading_region',
    'portofladingcountry': 'port_of_lading_country',
    'transportmethod': 'transport_method',
    'vessel': 'vessel',
    'vesselvoyageid': 'vessel_voyage_id',
    'vesselimo': 'vessel_imo',
    'quantity': 'quantity',
    'weightkg': 'weight_kg',
    'weightt': 'weight_t',
    'weightoriginalformat': 'weight_original_format',
    'numberofcontainers': 'number_of_containers',
    'goodsshipped': 'goods_shipped',
    'containermarks': 'container_marks',
    'company': 'company_name',
    'contacttype': 'contact_type',
    'contactname': 'contact_name',
    'position': 'title',
    'email': 'email',
    'phone': 'phone',
    'profileurl': 'linkedin',
    'companyurl': 'company_website',
    
    // Legacy mappings
    'shippername': 'shipper_name',
    'shipper_company': 'shipper_name',
    'consigneename': 'consignee_name',
    'consignee_company': 'consignee_name',
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
  
  // **CRITICAL FIX**: Handle string "null" from Excel XLSX.utils.sheet_to_json()
  // Excel parsing converts empty cells to the string "null", not actual null
  if (trimmed === 'null') {
    console.log(`Excel parsing: Converting string "null" to actual null for field: ${fieldName}`);
    return null;
  }
  
  // Parse numeric fields
  if (['weight_kg', 'value_usd', 'quantity', 'container_count'].includes(fieldName)) {
    // Additional safety check for string "null" in numeric fields
    if (trimmed === 'null' || trimmed === 'NULL') return null;
    
    const numericValue = parseFloat(trimmed.replace(/[,$]/g, ''));
    return isNaN(numericValue) ? null : numericValue;
  }
  
  // Parse date fields with enhanced null handling
  if (['shipment_date', 'arrival_date', 'departure_date'].includes(fieldName)) {
    // **CRITICAL FIX**: Handle various null representations that cause "invalid input syntax for type date"
    if (trimmed === 'null' || trimmed === 'NULL' || trimmed === '' || 
        trimmed === 'undefined' || trimmed === 'nil' || 
        trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'n/a') {
      console.log(`Date parsing: Converting "${trimmed}" to SQL NULL for field: ${fieldName}`);
      return null;
    }
    
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) {
      console.log(`Date parsing: Invalid date "${trimmed}" for field: ${fieldName}, returning null`);
      return null;
    }
    
    // **CRITICAL FIX**: Validate date is within reasonable range to prevent PostgreSQL errors
    const year = date.getFullYear();
    if (year < 1900 || year > 2100) {
      console.log(`Date parsing: Date "${trimmed}" has invalid year ${year}, returning null`);
      return null;
    }
    
    return date.toISOString().split('T')[0];
  }
  
  // Clean and return string fields
  // Additional safety check for string "null" in text fields
  if (trimmed === 'null' || trimmed === 'NULL') return null;
  
  return trimmed;
}

async function processBatch(records: TradeRecord[], importId: string, userId: string, supabaseClient: any) {
  let processed = 0;
  let duplicates = 0;
  let errors = 0;

  console.log(`Processing batch of ${records.length} records for import ${importId}`);

  // **DEBUG**: Log sample record structure
  if (records.length > 0) {
    console.log('Sample record structure:', JSON.stringify(records[0], null, 2));
  }

  // Check for duplicates before inserting
  const recordsToInsert = [];
  
  for (const record of records) {
    try {
      // Check for existing record based on unique shipment logistics identifiers
      // Focus on actual shipment details, not business entities that repeat
      let duplicateQuery = supabaseClient
        .from('unified_shipments')
        .select('id');

      // Primary approach: Use BOL number (check both possible field names) + date
      const bolNumber = record.bol_number || record.bill_of_lading_number;
      if (bolNumber && bolNumber.trim() !== '') {
        // Check for duplicates in either BOL field
        const { data: bolDuplicates, error: bolError } = await supabaseClient
          .from('unified_shipments')
          .select('id')
          .or(`bol_number.eq.${bolNumber.trim()},bill_of_lading_number.eq.${bolNumber.trim()}`)
          .eq('arrival_date', record.arrival_date || record.unified_date || null)
          .limit(1);
          
        if (bolError) {
          console.error('Error checking BOL duplicates:', bolError);
          errors++;
          continue;
        }
        
        if (bolDuplicates && bolDuplicates.length > 0) {
          duplicates++;
          continue;
        }
      } else {
        // Fallback: Use vessel + date + transport method for unique shipment identification
        const vessel = record.vessel || record.vessel_name || record.carrier_name;
        const shipmentDate = record.arrival_date || record.unified_date || record.shipment_date;
        
        if (vessel && shipmentDate) {
          const { data: vesselDuplicates, error: vesselError } = await supabaseClient
            .from('unified_shipments')
            .select('id')
            .eq('vessel', record.vessel || null)
            .eq('transport_method', record.transport_method || null)
            .eq('arrival_date', record.arrival_date || null)
            .eq('port_of_lading', record.port_of_lading || null)
            .eq('port_of_unlading', record.port_of_unlading || null)
            .limit(1);
            
          if (vesselError) {
            console.error('Error checking vessel duplicates:', vesselError);
            errors++;
            continue;
          }
          
          if (vesselDuplicates && vesselDuplicates.length > 0) {
            duplicates++;
            continue;
          }
        }
        // If no vessel info, proceed with insert (no duplicate check possible)
      }

      // **ONLY**: Fix date string "null" to actual null and add timestamps + org_id
      // Map BOL to both possible field names for comprehensive coverage
      const bolValue = record.bol_number || record.bill_of_lading_number;
      const cleanRecord = {
        ...record,
        // Ensure org_id is properly set for CSV/XLSX files
        org_id: record.org_id || 'bb997b6b-fa1a-46c8-9957-fabe835eee55',
        // Map your Excel "Bill of Lading Number" to both database fields
        bol_number: bolValue,
        bill_of_lading_number: bolValue,
        // Fix date fields only
        shipment_date: record.shipment_date === 'null' || record.shipment_date === '' ? null : record.shipment_date,
        arrival_date: record.arrival_date === 'null' || record.arrival_date === '' ? null : record.arrival_date,
        departure_date: record.departure_date === 'null' || record.departure_date === '' ? null : record.departure_date,
        // Timestamps only
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      recordsToInsert.push(cleanRecord);
      console.log(`Record added to insert queue: BOL=${bolValue}, Arrival=${cleanRecord.arrival_date}`);

    } catch (error) {
      console.error('Error processing record:', error);
      console.error('Problematic record:', JSON.stringify(record, null, 2));
      errors++;
    }
  }

  console.log(`Records to insert: ${recordsToInsert.length}, Duplicates: ${duplicates}, Errors: ${errors}`);

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
        console.error('Failed records sample:', JSON.stringify(subBatch[0], null, 2));
        console.error('Auth role:', supabaseClient.auth.user?.role || 'unknown');
        console.error('RLS Policy Error Details:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details
        });
        
        // Update bulk import with specific error details
        await supabaseClient
          .from('bulk_imports')
          .update({
            error_details: {
              database_error: insertError.message,
              error_code: insertError.code,
              failed_batch_sample: subBatch[0]
            }
          })
          .eq('id', importId);
          
        errors += subBatch.length;
      } else {
        processed += subBatch.length;
        console.log(`Successfully inserted sub-batch of ${subBatch.length} records`);
      }
    } catch (error) {
      console.error('Exception inserting sub-batch:', error);
      console.error('Exception details:', error.message);
      
      // Update bulk import with exception details
      await supabaseClient
        .from('bulk_imports')
        .update({
          error_details: {
            exception_error: error.message,
            failed_batch_sample: subBatch[0]
          }
        })
        .eq('id', importId);
        
      errors += subBatch.length;
    }
  }

  console.log(`Batch processing completed: ${processed} processed, ${duplicates} duplicates, ${errors} errors`);
  
  return { processed, duplicates, errors };
}

// Contact field normalization for contact sheets
function normalizeContactFieldName(field: string): string | null {
  if (!field) return null;
  
  const normalized = field.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\\w]/g, '')
    .trim();

  // Contact-specific field mappings for your Excel headers
  const fieldMappings: { [key: string]: string } = {
    // Company fields
    'company': 'company_name',
    'companyname': 'company_name',
    'organization': 'company_name',
    'firm': 'company_name',
    'business': 'company_name',
    
    // Contact name fields
    'contactname': 'full_name',
    'name': 'full_name',
    'fullname': 'full_name',
    'personname': 'full_name',
    'firstname': 'full_name',
    'lastname': 'full_name',
    
    // Contact type mapping
    'contacttype': 'contact_type',
    
    // Title fields
    'position': 'title',
    'title': 'title',
    'jobtitle': 'title',
    'role': 'title',
    'designation': 'title',
    
    // Contact fields
    'email': 'email',
    'emailaddress': 'email',
    'mail': 'email',
    'phone': 'phone',
    'phonenumber': 'phone',
    'telephone': 'phone',
    'mobile': 'phone',
    
    // URL mappings
    'profileurl': 'linkedin',
    'linkedin': 'linkedin',
    'linkedinurl': 'linkedin',
    'linkedinprofile': 'linkedin',
    'companyurl': 'company_website',
    'website': 'company_website',
    'companywebsite': 'company_website',
    
    // Location fields
    'country': 'country',
    'city': 'city',
    'location': 'city',
    'address': 'city',
    
    // Additional fields
    'notes': 'notes',
    'note': 'notes',
    'comments': 'notes',
    'tags': 'tags',
    'tag': 'tags'
  };

  return fieldMappings[normalized] || normalized;
}

// Contact value parsing
function parseContactValue(value: string, fieldName: string): any {
  if (!value || value.trim() === '') return null;
  
  const trimmed = value.trim();
  
  // Parse tags as array
  if (fieldName === 'tags') {
    return trimmed.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  
  // Clean email fields
  if (fieldName === 'email') {
    const email = trimmed.toLowerCase();
    return email.includes('@') ? email : null;
  }
  
  // Clean LinkedIn URLs
  if (fieldName === 'linkedin') {
    if (trimmed.includes('linkedin.com') || trimmed.startsWith('http')) {
      return trimmed;
    }
    return null;
  }
  
  // Clean phone numbers
  if (fieldName === 'phone') {
    const cleaned = trimmed.replace(/[^\d+\-\(\)\s]/g, '');
    return cleaned.length > 5 ? cleaned : null;
  }
  
  // Return cleaned string for other fields
  return trimmed;
}

// Link contacts to companies using fuzzy matching
function linkContactsToCompanies(contactRecords: ContactRecord[], tradeRecords: TradeRecord[]): ContactRecord[] {
  console.log(`Linking ${contactRecords.length} contacts to companies from ${tradeRecords.length} trade records`);
  
  // Create a set of standardized company names from trade records
  const tradeCompanies = new Set<string>();
  tradeRecords.forEach(record => {
    if (record.unified_company_name) {
      tradeCompanies.add(standardizeCompanyName(record.unified_company_name));
    }
    if (record.shipper_name) {
      tradeCompanies.add(standardizeCompanyName(record.shipper_name));
    }
    if (record.consignee_name) {
      tradeCompanies.add(standardizeCompanyName(record.consignee_name));
    }
  });

  const linkedContacts: ContactRecord[] = [];
  let matchedCount = 0;
  let unmatchedCount = 0;

  contactRecords.forEach(contact => {
    if (!contact.company_name) {
      unmatchedCount++;
      return;
    }

    const standardizedContactCompany = standardizeCompanyName(contact.company_name);
    
    // Direct match
    if (tradeCompanies.has(standardizedContactCompany)) {
      linkedContacts.push(contact);
      matchedCount++;
      return;
    }

    // Fuzzy matching - check if any trade company contains the contact company or vice versa
    let fuzzyMatch = false;
    for (const tradeCompany of tradeCompanies) {
      if (tradeCompany.length > 5 && standardizedContactCompany.length > 5) {
        if (tradeCompany.includes(standardizedContactCompany) || 
            standardizedContactCompany.includes(tradeCompany)) {
          linkedContacts.push(contact);
          matchedCount++;
          fuzzyMatch = true;
          break;
        }
      }
    }

    if (!fuzzyMatch) {
      unmatchedCount++;
    }
  });

  console.log(`Contact linking completed: ${matchedCount} matched, ${unmatchedCount} unmatched`);
  return linkedContacts;
}

// Standardize company names for matching
function standardizeCompanyName(name: string): string {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s&.-]/g, '')
    .replace(/\b(inc|llc|ltd|corp|corporation|company|co|sa|gmbh|bv)\b/g, '')
    .trim();
}

// Process contact batch insertion
async function processContactBatch(contactRecords: ContactRecord[], importId: string, userId: string, supabaseClient: any): Promise<number> {
  console.log(`Processing ${contactRecords.length} contact records for CRM insertion`);
  
  let processedCount = 0;
  const batchSize = 100;

  for (let i = 0; i < contactRecords.length; i += batchSize) {
    const batch = contactRecords.slice(i, i + batchSize);
    
    for (const contact of batch) {
      try {
        // Use the upsert_crm_contact function to handle duplicates
        const { data: contactId, error } = await supabaseClient.rpc('upsert_crm_contact', {
          p_org_id: userId, // User ID serves as org_id
          p_company_name: contact.company_name || 'Unknown Company',
          p_full_name: contact.full_name || null,
          p_title: contact.title || null,
          p_email: contact.email || null,
          p_phone: contact.phone || null,
          p_linkedin: contact.linkedin || null,
          p_country: contact.country || null,
          p_city: contact.city || null,
          p_source: contact.source || 'panjiva_multitab',
          p_tags: contact.tags || [],
          p_notes: contact.notes || `Imported from multi-tab file during import ${importId}`
        });

        if (error) {
          console.error('Error inserting contact:', error);
        } else {
          processedCount++;
        }

      } catch (error) {
        console.error('Exception inserting contact:', error);
      }
    }

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log(`Contact batch processing completed: ${processedCount}/${contactRecords.length} contacts processed`);
  return processedCount;
}

// DISABLED: Apollo enrichment function removed from file processing
// Apollo enrichment is now only available through CRM manual enrichment
// This ensures file uploads only store data without external API calls
/*
async function queueEnrichment(importId: string, supabaseClient: any) {
  // This function has been disabled - Apollo enrichment removed from file processing
  // Use CRM enrichment features instead for Apollo integration
  console.log('Apollo enrichment disabled for file uploads - use CRM enrichment instead');
}
*/
