import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
}

export function BulkImportProcessor() {
  const [imports, setImports] = useState<BulkImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
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
    try {
      const { data, error } = await supabase
        .from('bulk_imports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setImports((data || []).filter(imp => imp.created_at !== null) as BulkImport[]);
    } catch (error) {
      console.error('Failed to load imports:', error);
    } finally {
      setLoading(false);
    }
  };

  const processPendingImport = async (importId: string) => {
    setProcessing(importId);
    try {
      const { data, error } = await supabase.functions.invoke('process-bulk-import', {
        body: { importId }
      });

      if (error) throw error;

      toast({
        title: "Processing started",
        description: `Bulk import processing initiated for ${data.total || 'unknown'} companies`,
      });
    } catch (error) {
      console.error('Failed to process import:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to process import",
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  const getStatusIcon = (status: string, aiStatus: string | null) => {
    if (status === 'processing' || aiStatus === 'processing') {
      return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
    } else if (status === 'completed') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === 'error') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <Upload className="h-4 w-4 text-orange-500" />;
    }
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
            <div key={imp.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <div className="flex items-center gap-3">
                {getStatusIcon(imp.status, imp.ai_processing_status)}
                <div>
                  <h4 className="text-sm font-medium text-foreground">{imp.filename}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Status: {imp.status}</span>
                    {imp.ai_processing_status !== 'pending' && imp.ai_processing_status && (
                      <span>• AI: {imp.ai_processing_status}</span>
                    )}
                    {imp.processed_records && imp.processed_records > 0 && (
                      <span>• {imp.processed_records}/{imp.total_records || 0} processed</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {imp.status === 'uploaded' && (imp.ai_processing_status === 'pending' || !imp.ai_processing_status) && (
                  <button
                    onClick={() => processPendingImport(imp.id)}
                    disabled={processing === imp.id}
                    className="px-3 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50"
                  >
                    {processing === imp.id ? (
                      <span className="flex items-center gap-1">
                        <Loader className="h-3 w-3 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Process Now'
                    )}
                  </button>
                )}
                {imp.completed_at && (
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}