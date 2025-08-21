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
import { saveImportMapping, loadImportMapping } from '@/repositories/import.repo';
import { insertCrmContacts, insertUnifiedShipments } from '@/repositories/search.repo';

// Types
type BulkImport = {
  id: string;
  filename: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
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
};

export function BulkImportManager() {
  const [imports, setImports] = useState<BulkImport[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load imports on mount
  useEffect(() => {
    loadImports();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('import_jobs_changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'import_jobs' }, 
          () => {
            loadImports();
          }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadImports = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('import_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedImports = (data || []).map((item): BulkImport => ({
        id: item.id,
        filename: (item.processing_metadata as any)?.original_filename || item.object_path?.split('/').pop() || 'Unknown',
        status: (item.status === 'success' ? 'completed' : item.status) as 'uploaded' | 'processing' | 'completed' | 'failed',
        totalRecords: item.total_rows || 0,
        processedRecords: item.ok_rows || 0,
        errorRecords: item.error_rows || 0,
        duplicateRecords: 0,
        createdAt: item.created_at || '',
        completedAt: item.finished_at,
        processingMetadata: (item.processing_metadata as any) || {},
        errorDetails: {},
        fileSize: (item.processing_metadata as any)?.file_size || 0,
        fileType: (item.processing_metadata as any)?.file_type || 'unknown'
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
      const text = await file.text();
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      if (lines.length === 0) return [];
      
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });
      return rows;
    } else {
      throw new Error('Only CSV files are supported in this version');
    }
  };

  // Process uploaded file
  const processFile = async (file: File, importId: string) => {
    try {
      // Update status to processing
      await supabase
        .from('import_jobs')
        .update({ status: 'running' })
        .eq('id', importId);

      // Parse file
      const rows = await parseFile(file);
      if (rows.length === 0) {
        throw new Error('No data found in file');
      }

      // Determine target table based on headers
      const headers = Object.keys(rows[0]);
      const isContactsFile = headers.some(h => 
        ['email', 'contact', 'name', 'person'].some(keyword => 
          h.toLowerCase().includes(keyword)
        )
      );

      const targetTable = isContactsFile ? 'crm_contacts' : 'unified_shipments';

      // Build column mapping
      const mapping = buildMapping(headers, targetTable);
      
      // Save mapping as preset
      await saveImportMapping({
        org_id: null,
        table_name: targetTable,
        source_label: file.name.split('.')[0],
        mapping
      });

      // Apply mapping to rows
      const mappedRows = rows.map(row => applyMappingToRow(row, mapping));

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
        .from('import_jobs')
        .update({
          status: 'success',
          total_rows: rows.length,
          ok_rows: result.data.length,
          error_rows: rows.length - result.data.length,
          finished_at: new Date().toISOString(),
          processing_metadata: {
            target_table: targetTable,
            mapping,
            original_filename: file.name,
            file_size: file.size,
            file_type: file.name.split('.').pop()
          }
        })
        .eq('id', importId);

      toast.success(`Successfully imported ${result.data.length} records to ${targetTable}`);

    } catch (error) {
      console.error('Processing failed:', error);
      
      // Update status to error
      await supabase
        .from('import_jobs')
        .update({
          status: 'error',
          finished_at: new Date().toISOString(),
          processing_metadata: {
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
    if (!file.name.endsWith('.csv')) {
      toast.error('Only CSV files are supported');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    
    try {
      // Upload file to Supabase storage
      const fileName = `${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('bulk-imports')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Create import job record
      const { data: importData, error: importError } = await supabase
        .from('import_jobs')
        .insert({
          source_bucket: 'bulk-imports',
          object_path: uploadData.path,
          status: 'queued',
          processing_metadata: {
            original_filename: file.name,
            file_size: file.size,
            file_type: file.name.split('.').pop()
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
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false,
    disabled: uploading
  });

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
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
                  Supports: CSV files up to 10MB
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium">Supported formats:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>CSV files with headers for contacts (company, name, email, etc.)</li>
              <li>CSV files with headers for shipments (company, mode, hs_code, etc.)</li>
              <li>Auto-detection based on column headers</li>
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
                      <div className={`p-2 rounded-full ${getStatusColor(imp.status)}`}>
                        {getStatusIcon(imp.status)}
                      </div>
                      <div>
                        <h4 className="font-medium">{imp.filename}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(imp.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={imp.status === 'completed' ? 'default' : 'secondary'}>
                      {imp.status}
                    </Badge>
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

                  {imp.processingMetadata?.target_table && (
                    <div className="pt-2 border-t">
                      <Badge variant="outline">
                        Target: {imp.processingMetadata.target_table}
                      </Badge>
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