import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function BulkImportTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const testEdgeFunction = async () => {
    setTesting(true);
    setResults(null);
    
    try {
      console.log('Testing process-bulk-import edge function...');
      
      const { data, error } = await supabase.functions.invoke('process-bulk-import', {
        body: { 
          importId: '929af10a-748d-4258-a41c-e227c619131f' // The stuck import ID
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
    try {
      console.log('Testing database access...');
      
      const { data, error } = await supabase
        .from('bulk_imports')
        .select('id, filename, status, processed_records')
        .eq('id', '929af10a-748d-4258-a41c-e227c619131f')
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Bulk Import Function Tests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testEdgeFunction}
            disabled={testing}
            variant="outline"
          >
            {testing ? '🔄 Testing...' : '🚀 Test Edge Function'}
          </Button>
          
          <Button 
            onClick={testDatabaseQuery}
            variant="outline"
          >
            📊 Test Database Query
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
          <p><strong>Target Import:</strong> Panjiva - US EXPORTS 2025.xlsx</p>
          <p><strong>Status:</strong> uploaded (0 records processed)</p>
          <p><strong>Expected:</strong> Edge function should process and return success</p>
        </div>
      </CardContent>
    </Card>
  );
}