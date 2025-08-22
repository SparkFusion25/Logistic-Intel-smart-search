import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface BulkImport {
  id: string;
  filename: string;
  status: string;
  ai_processing_status: string | null;
  processed_records: number | null;
  total_records: number | null;
}

export function BulkImportTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [latestImport, setLatestImport] = useState<BulkImport | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLatestImport();
  }, []);

  const loadLatestImport = async () => {
    try {
      const { data, error } = await supabase
        .from('bulk_imports')
        .select('id, filename, status, ai_processing_status, processed_records, total_records')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setLatestImport(data);
    } catch (error) {
      console.error('Failed to load latest import:', error);
      toast({
        title: "Failed to Load Import",
        description: "Could not find any bulk imports to test with",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testEdgeFunction = async () => {
    if (!latestImport) {
      toast({
        title: "No Import Available",
        description: "Please upload a file first to test the edge function",
        variant: "destructive"
      });
      return;
    }

    setTesting(true);
    setResults(null);
    
    try {
      console.log('Testing process-bulk-import edge function with import:', latestImport.id);
      
      const { data, error } = await supabase.functions.invoke('process-bulk-import', {
        body: { 
          importId: latestImport.id
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        throw error;
      }

      setResults({
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Edge Function Test Passed ✅",
        description: `Processed ${data.recordsProcessed || 0} records successfully`
      });

    } catch (error) {
      console.error('Edge function test failed:', error);
      
      setResults({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Edge Function Test Failed ❌",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const testDatabaseQuery = async () => {
    if (!latestImport) {
      toast({
        title: "No Import Available",
        description: "Please upload a file first to test database queries",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Testing database access for import:', latestImport.id);
      
      const { data, error } = await supabase
        .from('bulk_imports')
        .select('id, filename, status, processed_records')
        .eq('id', latestImport.id)
        .single();

      console.log('Database query result:', { data, error });

      if (error) throw error;

      toast({
        title: "Database Test Passed ✅", 
        description: `Found import: ${data.filename} (Status: ${data.status})`
      });

    } catch (error) {
      console.error('Database test failed:', error);
      toast({
        title: "Database Test Failed ❌",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🧪 Bulk Import Function Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading latest import...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Bulk Import Function Tests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestImport ? (
          <div className="p-3 bg-muted rounded-lg mb-4">
            <div className="text-sm">
              <div><strong>Testing with:</strong> {latestImport.filename}</div>
              <div><strong>Status:</strong> {latestImport.status}</div>
              <div><strong>AI Status:</strong> {latestImport.ai_processing_status || 'pending'}</div>
              <div><strong>Progress:</strong> {latestImport.processed_records || 0}/{latestImport.total_records || 0} records</div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <div className="text-sm text-yellow-800">
              No imports found. Please upload a file to test with.
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={testEdgeFunction}
            disabled={testing || !latestImport}
            variant="outline"
          >
            {testing ? '🔄 Testing...' : '🚀 Test Edge Function'}
          </Button>
          
          <Button 
            onClick={testDatabaseQuery}
            disabled={!latestImport}
            variant="outline"
          >
            📊 Test Database Query
          </Button>

          <Button 
            onClick={loadLatestImport}
            variant="outline"
            size="sm"
          >
            🔄 Refresh
          </Button>
        </div>

        {results && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">
              Test Results {results.success ? '✅' : '❌'}
            </h4>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p><strong>How it works:</strong> This test uses the most recent bulk import in your system</p>
          <p><strong>Expected:</strong> Edge function should process the import and return success</p>
          <p><strong>Note:</strong> Click refresh if you've just uploaded a new file</p>
        </div>
      </CardContent>
    </Card>
  );
}