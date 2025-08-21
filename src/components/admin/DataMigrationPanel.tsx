import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Database, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ArrowRight,
  Users,
  Ship
} from 'lucide-react';

export function DataMigrationPanel() {
  const [migrating, setMigrating] = useState(false);
  const [migrationStats, setMigrationStats] = useState<{
    oceanCount: number;
    airCount: number;
    companyCount: number;
    unifiedCount: number;
  } | null>(null);

  const runDataMigration = async () => {
    setMigrating(true);
    try {
      // Execute the migration function
      const { error } = await supabase.rpc('migrate_legacy_shipments');
      
      if (error) {
        throw new Error(error.message);
      }

      // Get migration statistics
      const [oceanResult, airResult, unifiedResult, companyResult] = await Promise.all([
        supabase.from('ocean_shipments').select('id', { count: 'exact', head: true }),
        supabase.from('airfreight_shipments').select('id', { count: 'exact', head: true }),
        supabase.from('unified_shipments').select('id', { count: 'exact', head: true }),
        supabase.from('companies').select('id', { count: 'exact', head: true })
      ]);

      setMigrationStats({
        oceanCount: oceanResult.count || 0,
        airCount: airResult.count || 0,
        unifiedCount: unifiedResult.count || 0,
        companyCount: companyResult.count || 0
      });

      toast.success('Data migration completed successfully!');
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error(`Migration failed: ${error.message}`);
    } finally {
      setMigrating(false);
    }
  };

  const refreshStats = async () => {
    try {
      const [oceanResult, airResult, unifiedResult, companyResult] = await Promise.all([
        supabase.from('ocean_shipments').select('id', { count: 'exact', head: true }),
        supabase.from('airfreight_shipments').select('id', { count: 'exact', head: true }),
        supabase.from('unified_shipments').select('id', { count: 'exact', head: true }),
        supabase.from('companies').select('id', { count: 'exact', head: true })
      ]);

      setMigrationStats({
        oceanCount: oceanResult.count || 0,
        airCount: airResult.count || 0,
        unifiedCount: unifiedResult.count || 0,
        companyCount: companyResult.count || 0
      });
    } catch (error) {
      console.error('Failed to refresh stats:', error);
      toast.error('Failed to refresh statistics');
    }
  };

  return (
    <div className="space-y-6">
      {/* Migration Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Legacy Data Migration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Migration Process</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4" />
                  <span>Consolidate ocean_shipments and airfreight_shipments into unified_shipments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Extract and normalize company information</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>Update companies table with shipment counts and modes</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={runDataMigration}
                disabled={migrating}
                size="lg"
              >
                {migrating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Migrating Data...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Migration
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={refreshStats}
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Stats
              </Button>
            </div>

            {migrationStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{migrationStats.oceanCount}</div>
                  <div className="text-sm text-blue-600">Ocean Shipments</div>
                </div>
                <div className="text-center p-4 bg-sky-50 rounded-lg">
                  <div className="text-2xl font-bold text-sky-600">{migrationStats.airCount}</div>
                  <div className="text-sm text-sky-600">Air Shipments</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{migrationStats.unifiedCount}</div>
                  <div className="text-sm text-green-600">Unified Shipments</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{migrationStats.companyCount}</div>
                  <div className="text-sm text-purple-600">Companies</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Status */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Database Migration Functions</span>
              </div>
              <Badge variant="default">Complete</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">XLSX File Support</span>
              </div>
              <Badge variant="default">Complete</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">AI Company Processing (Edge Function)</span>
              </div>
              <Badge variant="default">Complete</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Post-Import AI Processing</span>
              </div>
              <Badge variant="default">Complete</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Enhanced Import UI</span>
              </div>
              <Badge variant="default">Complete</Badge>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Run the data migration to consolidate existing shipments</li>
                <li>Test bulk import with CSV and XLSX files</li>
                <li>Verify AI company processing works with real data</li>
                <li>Test search functionality shows rich company data</li>
                <li>Validate Search → CRM → Enrichment flow</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}