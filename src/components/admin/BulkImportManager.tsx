import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
        .from('bulk_imports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImports(data || []);
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
      case 'processing': case 'parsing': case 'deduplicating': case 'enriching': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'processing': case 'parsing': case 'deduplicating': case 'enriching': return <Database className="h-4 w-4 animate-spin" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const calculateProgress = (item: BulkImport) => {
    if (item.total_records === 0) return 0;
    return Math.round((item.processed_records / item.total_records) * 100);
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
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
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