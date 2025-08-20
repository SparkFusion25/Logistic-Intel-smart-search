import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Database, AlertTriangle, CheckCircle, Sparkles, Brain, RotateCcw, TestTube } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/types/db';
import { useDropzone } from 'react-dropzone';

interface BulkImport {
  id: string;
  filename: string;
  file_type: string;
  status: string;
  total_records: number;
  processed_records: number;
  duplicate_records: number;
  error_records: number;
  created_at: string;
  updated_at: string;
  processing_metadata?: {
    batch_size?: number;
    total_batches?: number;
    current_batch?: number;
    progress_percentage?: number;
    ai_analysis?: {
      data_quality_score: number;
      estimated_processing_time: string;
      suggested_cleaning: string[];
      processing_recommendations: string[];
    };
  };
}

export const BulkImportManager = () => {
  const { toast } = useToast();
  const [imports, setImports] = useState<BulkImport[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImports();
    // Set up realtime subscription for import status updates
    const channel = supabase
      .channel('bulk-imports-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bulk_imports'
        },
        () => {
          loadImports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadImports = async () => {
    try {
      const { data, error } = await supabase
        .from('import_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      type ImportRow = Tables<'import_jobs'>;
      
      type UiBulkImport = {
        id: string;
        status: ImportRow['status'];
        total_records: number;
        ok_rows: number;
        error_rows: number;
        processing_metadata: ImportRow['processing_metadata'];
        created_at: string | null;
        finished_at: string | null;
      };
      
      const toUi = (r: ImportRow): UiBulkImport => ({
        id: r.id,
        status: r.status,
        total_records: (r.total_rows ?? 0),
        ok_rows: (r.ok_rows ?? 0),
        error_rows: (r.error_rows ?? 0),
        processing_metadata: r.processing_metadata,
        created_at: r.created_at,
        finished_at: r.finished_at,
      });
      
      setImports((data ?? []).map(toUi));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load imports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/xml', 'application/xml'];
    const maxFileSize = 50 * 1024 * 1024; // 50MB limit
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload CSV, XLSX, or XML files only",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxFileSize) {
      toast({
        title: "File Too Large",
        description: `File size must be under 50MB. Your file is ${Math.round(file.size / 1024 / 1024)}MB.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Get user ID for folder structure
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('bulk-imports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create import record
      const { data: importData, error: importError } = await supabase
        .from('bulk_imports')
        .insert({
          org_id: user.id,
          filename: file.name,
          file_type: fileExt?.toLowerCase() || 'unknown',
          file_path: uploadData.path,
          file_size: file.size,
          status: 'uploaded'
        })
        .select()
        .single();

      if (importError) throw importError;

      // Trigger processing
      const { error: processError } = await supabase.functions.invoke('bulk-import-processor', {
        body: {
          import_id: importData.id,
          file_path: uploadData.path,
          file_type: fileExt?.toLowerCase()
        }
      });

      if (processError) throw processError;

      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded and is being processed`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/xml': ['.xml'],
      'application/xml': ['.xml']
    },
    multiple: false,
    disabled: uploading
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'processing': case 'parsing': case 'deduplicating': case 'enriching': case 'processing_batches': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'processing': case 'parsing': case 'deduplicating': case 'enriching': case 'processing_batches': return <Database className="h-4 w-4 animate-spin" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const calculateProgress = (item: BulkImport) => {
    if (item.total_records === 0) return 0;
    return Math.round((item.processed_records / item.total_records) * 100);
  };

  const testImportInsert = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('test-import-insert');

      if (error) throw error;

      toast({
        title: "Import Test Results",
        description: `${data.summary.successful}/${data.summary.totalTests} tests passed. Check console for details.`,
        variant: data.summary.failed > 0 ? "destructive" : "default",
      });

      console.log('Import test results:', data.summary);
    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Failed to run import tests",
        variant: "destructive",
      });
    }
  };

  const resetStuckImport = async (importId: string) => {
    try {
      const { error } = await supabase.functions.invoke('reset-stuck-import', {
        body: { import_id: importId }
      });

      if (error) throw error;

      toast({
        title: "Import Reset",
        description: "The stuck import has been reset and can be reprocessed",
      });

      // Reload imports to show updated status
      loadImports();
    } catch (error) {
      console.error('Reset error:', error);
      toast({
        title: "Reset Failed",
        description: error instanceof Error ? error.message : "Failed to reset import",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading imports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Trade Data Import</CardTitle>
          <CardDescription>
            Upload CSV, XLSX, or XML files containing trade shipment data from BTS, US Census, or IATA sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testImportInsert}
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              Test Import Schema
            </Button>
          </div>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {uploading ? (
              <div>
                <p className="text-lg font-medium">Uploading...</p>
                <p className="text-sm text-muted-foreground">Please wait while your file is being uploaded</p>
              </div>
            ) : isDragActive ? (
              <div>
                <p className="text-lg font-medium">Drop your file here</p>
                <p className="text-sm text-muted-foreground">Release to upload</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium">Drag & drop your trade data file here</p>
                <p className="text-sm text-muted-foreground">
                  Supports CSV, XLSX, and XML files up to 100MB
                </p>
                <Button variant="outline" className="mt-4">
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
          <CardDescription>
            Track the progress of your bulk data imports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {imports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No imports yet. Upload your first trade data file above.
            </div>
          ) : (
            <div className="space-y-4">
               {imports.map((item) => (
                 <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="font-medium">{item.filename}</span>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        {item.processing_metadata?.ai_analysis && (
                          <Badge variant="outline" className="ml-2">
                            <Brain className="h-3 w-3 mr-1" />
                            AI Analyzed
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {(item.status === 'deduplicating' || item.status === 'processing' || item.status === 'parsing') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resetStuckImport(item.id)}
                            className="h-7 px-2"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Reset
                          </Button>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                   {/* AI Analysis Results */}
                   {item.processing_metadata?.ai_analysis && (
                     <div className="mb-3 p-3 bg-muted/30 rounded-lg border">
                       <h4 className="font-medium text-sm mb-2 flex items-center">
                         <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                         AI Analysis Results
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                         <div>
                           <span className="font-medium">Data Quality Score:</span>
                           <div className="flex items-center mt-1">
                             <Progress 
                               value={item.processing_metadata.ai_analysis.data_quality_score * 10} 
                               className="w-16 h-2 mr-2" 
                             />
                             <span className="text-xs">{item.processing_metadata.ai_analysis.data_quality_score}/10</span>
                           </div>
                         </div>
                         <div>
                           <span className="font-medium">Est. Processing Time:</span>
                           <p className="text-muted-foreground text-xs">
                             {item.processing_metadata.ai_analysis.estimated_processing_time}
                           </p>
                         </div>
                       </div>
                       {item.processing_metadata.ai_analysis.suggested_cleaning?.length > 0 && (
                         <div className="mt-2">
                           <span className="font-medium text-xs">AI Suggestions:</span>
                           <div className="text-xs text-muted-foreground mt-1 space-y-1">
                             {item.processing_metadata.ai_analysis.suggested_cleaning.slice(0, 2).map((suggestion, idx) => (
                               <div key={idx} className="flex items-start">
                                 <span className="text-blue-500 mr-1 mt-0.5">•</span>
                                 <span>{suggestion}</span>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}
                     </div>
                    )}

                    {/* Batch Processing Status */}
                    {item.processing_metadata?.current_batch && item.processing_metadata?.total_batches && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-sm mb-2 text-blue-700">
                          Batch Processing Status
                        </h4>
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="font-medium">Current Batch:</span> {item.processing_metadata.current_batch} / {item.processing_metadata.total_batches}
                          </div>
                          <div>
                            <span className="font-medium">Batch Size:</span> {item.processing_metadata.batch_size} records per batch
                          </div>
                          {item.processing_metadata.progress_percentage && (
                            <div>
                              <span className="font-medium">Progress:</span> {item.processing_metadata.progress_percentage}%
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {item.total_records > 0 && (
                      <div className="space-y-2">
                        <Progress value={calculateProgress(item)} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            {item.processed_records} / {item.total_records} records processed
                          </span>
                          <span>
                            {item.duplicate_records} duplicates, {item.error_records} errors
                          </span>
                        </div>
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
};