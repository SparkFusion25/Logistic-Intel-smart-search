import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Upload, CheckCircle, AlertCircle, Loader2, Clock, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface BulkImport {
  id: string;
  filename: string;
  status: string;
  ai_processing_status: string | null;
  total_records: number | null;
  processed_records: number | null;
  created_at: string | null;
  completed_at: string | null;
  processing_metadata: any;
  error_details: any;
  started_at: string | null;
  failed_at: string | null;
  total_rows: number | null;
}

export function BulkImportProcessor() {
  const [imports, setImports] = useState<BulkImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set<string>());
  const { toast } = useToast();

  useEffect(() => {
    loadImports();
    
    // Set up real-time subscription for import updates
    const subscription = supabase
      .channel('bulk_imports')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bulk_imports'
      }, (payload) => {
        console.log('Import update received:', payload);
        loadImports();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadImports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bulk_imports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      // Show all imports, don't filter by created_at
      setImports(data || []);
    } catch (error) {
      console.error('Error loading imports:', error);
      toast({
        title: "Error",
        description: "Failed to load import history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processPendingImport = async (importId: string) => {
    if (processingIds.has(importId)) return;
    
    setProcessingIds(prev => new Set(prev.add(importId)));
    
    try {
      // Use the correct parameter name 'import_job_id'
      const { data, error } = await supabase.functions.invoke('process-bulk-import', {
        body: { import_job_id: importId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Import processing started. ${data?.processed || 0} records will be processed.`,
      });
      
      // Reload imports to get updated status
      loadImports();
    } catch (error) {
      console.error('Error processing import:', error);
      toast({
        title: "Error",
        description: `Failed to process import: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(importId);
        return next;
      });
    }
  };

  const getStatusIcon = (status: string, aiStatus?: string | null) => {
    if (status === 'processing' || aiStatus === 'ai_processing') {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (status === 'completed') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (status === 'failed' || aiStatus === 'failed') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getStatusText = (imp: BulkImport) => {
    if (imp.status === 'processing') return 'Processing...';
    if (imp.status === 'completed') return `Completed (${imp.processed_records || 0} records)`;
    if (imp.status === 'failed') return 'Failed';
    return 'Uploaded';
  };

  const getProgress = (imp: BulkImport) => {
    if (imp.status === 'completed') return 100;
    if (imp.status === 'processing') return 50;
    if (imp.status === 'failed') return 0;
    return 0;
  };

  if (loading) {
    return (
      <div className="card-glass p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-8 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Bulk Import Status</h3>
      
      <div className="space-y-3">
        {imports.length === 0 ? (
          <p className="text-muted-foreground text-sm">No recent imports found</p>
        ) : (
          imports.map((imp) => (
            <div key={imp.id} className="flex items-center justify-between p-3 rounded-lg card-surface">
              <div className="flex items-center space-x-2">
                {getStatusIcon(imp.status, imp.ai_processing_status)}
                <div className="flex-1">
                  <p className="font-medium">{imp.filename}</p>
                  <p className="text-sm text-muted-foreground">
                    {getStatusText(imp)}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${getProgress(imp)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {imp.created_at ? formatDate(imp.created_at) : 'No date'}
                  </p>
                  {imp.status === 'failed' && imp.error_details && (
                    <p className="text-xs text-red-600 mt-1">
                      Error: {typeof imp.error_details === 'object' && imp.error_details.error ? imp.error_details.error : 'Processing failed'}
                    </p>
                  )}
                </div>
              </div>
              {imp.status === 'uploaded' && (
                <Button
                  size="sm"
                  onClick={() => processPendingImport(imp.id)}
                  disabled={processingIds.has(imp.id)}
                >
                  {processingIds.has(imp.id) ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Process Now'
                  )}
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}