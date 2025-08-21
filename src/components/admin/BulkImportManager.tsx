import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  X,
  RefreshCw,
  Download
} from 'lucide-react';
import { buildMapping, applyMappingToRow } from '@/lib/import/matcher';
import { TABLE_SCHEMAS } from '@/lib/import/schema';
import { TABLE_ALIASES } from '@/lib/import/aliases';
import { saveImportMapping, loadImportMapping } from '@/repositories/import.repo';
import { insertCrmContacts, insertUnifiedShipments } from '@/repositories/search.repo';
import { parseXLSXFile, parseCSVFile } from '@/lib/import/xlsxParser';

// Types - matching the actual bulk_imports table schema
type BulkImport = {
  id: string;
  filename: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  aiProcessingStatus: 'pending' | 'ai_processing' | 'ai_completed' | 'ai_failed';
  totalRecords: number;
  processedRecords: number;
  errorRecords: number;
  duplicateRecords: number;
  createdAt: string;
  completedAt: string | null;
  processingMetadata: Record<string, any>;
  errorDetails: Record<string, any>;
  fileSize: number;
  fileType: string;
  filePath: string | null; // Add file_path to detect legacy imports
};

export function BulkImportManager() {
  const [imports, setImports] = useState<BulkImport[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  // Load imports on mount
  useEffect(() => {
    loadImports();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('bulk_imports_changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'bulk_imports' }, 
          () => {
            loadImports();
          }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Manual processing trigger for stuck imports
  const triggerProcessing = async (importId: string) => {
    try {
      setProcessing(importId);
      
      // Get import record to access stored file
      const { data: importRecord, error: fetchError } = await supabase
        .from('bulk_imports')
        .select('*')
        .eq('id', importId)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch import record: ${fetchError.message}`);
      }

      if (!importRecord.file_path) {
        toast.error('This is a legacy import without stored file. Please use "Re-upload" to upload the file again.');
        return;
      }

      // Download file from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('bulk-import-files')
        .download(importRecord.file_path);

      if (downloadError) {
        throw new Error(`Failed to download file: ${downloadError.message}`);
      }

      // Convert blob to file
      const file = new File([fileData], importRecord.filename, { 
        type: importRecord.file_type === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv'
      });

      // Process the file using existing logic
      await processFile(file, importId);
      
      toast.success('Processing completed successfully!');
      loadImports(); // Refresh the list
    } catch (error) {
      console.error('Failed to trigger processing:', error);
      toast.error(`Failed to start processing: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  // Delete/reset legacy import to allow re-upload
  const deleteImport = async (importId: string) => {
    try {
      const { error } = await supabase
        .from('bulk_imports')
        .delete()
        .eq('id', importId);

      if (error) {
        throw new Error(`Failed to delete import: ${error.message}`);
      }

      toast.success('Import deleted. You can now re-upload the file.');
      loadImports();
    } catch (error) {
      console.error('Failed to delete import:', error);
      toast.error(`Failed to delete import: ${error.message}`);
    }
  };

  const loadImports = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bulk_imports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedImports = (data || []).map((item): BulkImport => ({
        id: item.id,
        filename: item.filename,
        status: item.status as 'uploaded' | 'processing' | 'completed' | 'failed',
        aiProcessingStatus: item.ai_processing_status as 'pending' | 'ai_processing' | 'ai_completed' | 'ai_failed',
        totalRecords: item.total_records || 0,
        processedRecords: item.processed_records || 0,
        errorRecords: item.error_records || 0,
        duplicateRecords: item.duplicate_records || 0,
        createdAt: item.created_at || '',
        completedAt: item.completed_at,
        processingMetadata: (typeof item.processing_metadata === 'object' && item.processing_metadata !== null) ? item.processing_metadata as Record<string, any> : {},
        errorDetails: (typeof item.error_details === 'object' && item.error_details !== null) ? item.error_details as Record<string, any> : {},
        fileSize: item.file_size || 0,
        fileType: item.file_type || 'unknown',
        filePath: item.file_path || null // Add file_path mapping
      }));

      setImports(transformedImports);
    } catch (error) {
      console.error('Error loading imports:', error);
      toast.error('Failed to load import history');
    } finally {
      setLoading(false);
    }
  }, []);

  // Parse CSV/Excel files
  const parseFile = async (file: File): Promise<any[]> => {
    if (file.name.endsWith('.csv')) {
      return parseCSVFile(file);
    } else if (file.name.match(/\.(xlsx|xls)$/i)) {
      return parseXLSXFile(file);
    } else {
      throw new Error('Only CSV and XLSX files are supported');
    }
  };

  // Process uploaded file
  const processFile = async (file: File, importId: string) => {
    try {
      // Update status to processing
      await supabase
        .from('bulk_imports')
        .update({ status: 'processing' })
        .eq('id', importId);

      // Parse file
      const rows = await parseFile(file);
      if (rows.length === 0) {
        throw new Error('No data found in file');
      }

      // Determine target table based on headers - fixed logic
      const headers = Object.keys(rows[0]);
      
      // Look for CRM-specific indicators (genuine contact files)
      const hasCrmIndicators = headers.some(h => 
        ['email', 'linkedin', 'phone', 'contact_name', 'title', 'position'].some(keyword => 
          h.toLowerCase().includes(keyword)
        )
      );
      
      // Look for shipment/trade indicators (Panjiva files should go to shipments)
      const hasShipmentIndicators = headers.some(h => 
        ['shipper', 'consignee', 'vessel', 'hs_code', 'port', 'carrier', 'bol', 'container', 'freight'].some(keyword => 
          h.toLowerCase().includes(keyword)
        )
      );
      
      // Default to unified_shipments for trade files, only use crm_contacts for genuine CRM files
      const targetTable = (hasCrmIndicators && !hasShipmentIndicators) ? 'crm_contacts' : 'unified_shipments';

      // Build column mapping
      const tableSchema = TABLE_SCHEMAS[targetTable];
      const aliases = TABLE_ALIASES[targetTable] || {};
      const mappingResult = buildMapping(headers, tableSchema, aliases);
      
      // Save mapping as preset
      await saveImportMapping({
        org_id: null,
        table_name: targetTable,
        source_label: file.name.split('.')[0],
        mapping: mappingResult.mapping
      });

      // Apply mapping to rows
      const mappedRows = rows.map(row => applyMappingToRow(row, mappingResult.mapping));

      // Insert data
      let result;
      if (targetTable === 'crm_contacts') {
        result = await insertCrmContacts(mappedRows);
      } else {
        result = await insertUnifiedShipments(mappedRows);
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update import job status
      await supabase
        .from('bulk_imports')
        .update({
          status: 'completed',
          total_records: rows.length,
          processed_records: result.data.length,
          error_records: rows.length - result.data.length,
          completed_at: new Date().toISOString(),
          processing_metadata: {
            target_table: targetTable,
            mapping: mappingResult.mapping,
            original_filename: file.name,
            file_size: file.size,
            file_type: file.name.split('.').pop()
          }
        })
        .eq('id', importId);

      // Start AI processing for shipments with enhanced batch processing
      if (result.data.length > 0) {
        console.log(`Triggering AI processing for import ${importId}`);
        
        // Get unique company names from the imported data
        const uniqueCompanies = Array.from(new Set(mappedRows
          .filter(row => row.unified_company_name && row.unified_company_name.trim() !== '')
          .map(row => row.unified_company_name.trim())
        ));

        console.log(`Processing ${uniqueCompanies.length} unique companies with AI`);

        // Process companies in batches to avoid timeouts
        const batchSize = 5;
        let processedCompanies = 0;

        for (let i = 0; i < uniqueCompanies.length; i += batchSize) {
          const batch = uniqueCompanies.slice(i, i + batchSize);
          
          await Promise.allSettled(
            batch.map(async (companyName) => {
              try {
                const { error: aiError } = await supabase.functions.invoke('ai-company-processor', {
                  body: { 
                    importId,
                    companyName,
                    filename: file.name
                  }
                });

                if (!aiError) {
                  processedCompanies++;
                }
              } catch (error) {
                console.error(`AI processing failed for company ${companyName}:`, error);
              }
            })
          );
        }

        // Update final AI processing status
        await supabase
          .from('bulk_imports')
          .update({ 
            ai_processing_status: processedCompanies > 0 ? 'completed' : 'failed',
            processing_metadata: { 
              target_table: targetTable,
              mapping: mappingResult.mapping,
              original_filename: file.name,
              file_size: file.size,
              file_type: file.name.split('.').pop(),
              ai_companies_processed: processedCompanies,
              ai_total_companies: uniqueCompanies.length,
              ai_completed_at: new Date().toISOString()
            }
          })
          .eq('id', importId);

        console.log(`AI processing completed: ${processedCompanies}/${uniqueCompanies.length} companies processed`);
        toast.success(`Successfully imported ${result.data.length} records and processed ${processedCompanies} companies with AI`);
      } else {
        toast.success(`Successfully imported ${result.data.length} records to ${targetTable}`);
      }

    } catch (error) {
      console.error('Processing failed:', error);
      
      // Update status to error
      await supabase
        .from('bulk_imports')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_details: {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        })
        .eq('id', importId);

      throw error;
    }
  };

  // File upload handler
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Validate file
    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
      toast.error('Only CSV and XLSX files are supported');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    
    try {
      // Get current user from auth context
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id || 'bb997b6b-fa1a-46c8-9957-fabe835eee55';

      // Store file in Supabase storage for later processing
      const filePath = `bulk-imports/${currentUserId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('bulk-import-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      // Create import job record with file path
      const { data: importData, error: importError } = await supabase
        .from('bulk_imports')
        .insert({
          filename: file.name,
          file_type: file.name.split('.').pop() || 'csv',
          file_size: file.size,
          file_path: filePath,
          status: 'uploaded',
          total_records: 0,
          org_id: currentUserId,
          processing_metadata: {
            original_filename: file.name,
            file_size: file.size,
            file_type: file.name.split('.').pop(),
            storage_path: filePath
          }
        })
        .select()
        .single();

      if (importError) {
        throw new Error(`Database insert failed: ${importError.message}`);
      }

      toast.success('File uploaded and queued for processing');

      // Auto-process small files
      if (file.size < 1024 * 1024) { // < 1MB
        try {
          await processFile(file, importData.id);
        } catch (processError) {
          console.error('Auto-processing failed:', processError);
          toast.warning('File uploaded but auto-processing failed. Use manual processing.');
        }
      }

      // Refresh imports list
      loadImports();

    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [loadImports]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: uploading
  });

  // Helper functions
  const getStatusColor = (status: string, aiStatus?: string) => {
    if (aiStatus === 'ai_processing') return 'bg-purple-500';
    if (aiStatus === 'ai_completed') return 'bg-emerald-500';
    if (aiStatus === 'ai_failed') return 'bg-orange-500';
    
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string, aiStatus?: string) => {
    if (aiStatus === 'ai_processing') return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (aiStatus === 'ai_completed') return <CheckCircle className="h-4 w-4" />;
    if (aiStatus === 'ai_failed') return <AlertCircle className="h-4 w-4" />;
    
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateProgress = (imp: BulkImport) => {
    if (imp.totalRecords === 0) return 0;
    return Math.round((imp.processedRecords / imp.totalRecords) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="space-y-2">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive
                    ? 'Drop the file here...'
                    : 'Drag & drop a CSV file here, or click to select'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: CSV and XLSX files up to 10MB
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium">Supported formats:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>CSV/XLSX files with headers for contacts (company, name, email, etc.)</li>
              <li>CSV/XLSX files with headers for shipments (company, mode, hs_code, etc.)</li>
              <li>Auto-detection based on column headers</li>
              <li>AI-powered company matching and normalization (post-import)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import History
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadImports}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : imports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No imports found. Upload a file to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {imports.map((imp) => (
                <div
                  key={imp.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(imp.status, imp.aiProcessingStatus)}`}>
                      {getStatusIcon(imp.status, imp.aiProcessingStatus)}
                    </div>
                      <div>
                        <h4 className="font-medium">{imp.filename}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(imp.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={imp.status === 'completed' ? 'default' : 'secondary'}>
                        {imp.status}
                      </Badge>
                      {imp.aiProcessingStatus !== 'pending' && (
                        <Badge 
                          variant={imp.aiProcessingStatus === 'ai_completed' ? 'default' : 
                                 imp.aiProcessingStatus === 'ai_failed' ? 'destructive' : 'secondary'}
                        >
                          AI: {imp.aiProcessingStatus.replace('ai_', '')}
                        </Badge>
                      )}
                      {/* Show different buttons based on import type and status */}
                      {imp.status === 'uploaded' && imp.filePath ? (
                        // Modern imports with stored files - show Process button
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => triggerProcessing(imp.id)}
                          disabled={processing === imp.id}
                        >
                          {processing === imp.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                          ) : null}
                          {processing === imp.id ? 'Processing...' : 'Process'}
                        </Button>
                      ) : imp.status === 'uploaded' && !imp.filePath ? (
                        // Legacy imports without stored files - show Re-upload button
                        <>
                          <Badge variant="destructive" className="text-xs">
                            Legacy Import - File Missing
                          </Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteImport(imp.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Delete & Re-upload
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {imp.status === 'processing' && imp.totalRecords > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{calculateProgress(imp)}%</span>
                      </div>
                      <Progress value={calculateProgress(imp)} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Records</p>
                      <p className="font-medium">{imp.totalRecords}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Processed</p>
                      <p className="font-medium text-green-600">{imp.processedRecords}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Errors</p>
                      <p className="font-medium text-red-600">{imp.errorRecords}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">File Size</p>
                      <p className="font-medium">
                        {(imp.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  {(imp.processingMetadata?.target_table || imp.processingMetadata?.ai_processed_companies) && (
                    <div className="pt-2 border-t flex gap-2 flex-wrap">
                      {imp.processingMetadata?.target_table && (
                        <Badge variant="outline">
                          Target: {imp.processingMetadata.target_table}
                        </Badge>
                      )}
                      {imp.processingMetadata?.ai_processed_companies && (
                        <Badge variant="outline">
                          AI Processed: {imp.processingMetadata.ai_processed_companies} companies
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}