import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, Activity, Database, BarChart3 } from 'lucide-react';
import { BulkImportManager } from './BulkImportManager';
import { DataMigrationPanel } from './DataMigrationPanel';

interface BulkImport {
  id: string;
  filename: string;
  status: string;
  processed_records: number;
  total_records: number;
  created_at: string;
}

export default function AdminPageClientEnhanced() {
  const [bulkImports, setBulkImports] = useState<BulkImport[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    setBulkImports([
      {
        id: '1',
        filename: 'companies_batch_1.xlsx',
        status: 'completed',
        processed_records: 1250,
        total_records: 1250,
        created_at: new Date().toISOString()
      },
      {
        id: '2', 
        filename: 'shipments_q4.csv',
        status: 'processing',
        processed_records: 850,
        total_records: 2000,
        created_at: new Date().toISOString()
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Mobile-optimized header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Manage platform data and imports</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Badge variant="outline" className="text-xs sm:text-sm">
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Mobile-optimized stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="shadow-card hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Total Users</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">1,234</p>
                </div>
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Database Size</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">24.5 GB</p>
                </div>
                <div className="bg-accent/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <Database className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Active Sessions</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">456</p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">System Status</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">Online</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile-optimized tabs */}
        <Tabs defaultValue="imports" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="imports" className="text-xs sm:text-sm py-2 sm:py-3">
              <span className="hidden sm:inline">Bulk </span>Imports
            </TabsTrigger>
            <TabsTrigger value="migration" className="text-xs sm:text-sm py-2 sm:py-3">
              <span className="hidden sm:inline">Data </span>Migration
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 sm:py-3">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm py-2 sm:py-3">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="imports" className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                    Quick Import
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Upload and process data files instantly
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <BulkImportManager />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                    Import Status
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Monitor recent import activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {bulkImports.map((importItem) => (
                      <div key={importItem.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm sm:text-base truncate">{importItem.filename}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {importItem.processed_records} / {importItem.total_records} processed
                          </div>
                        </div>
                        <Badge 
                          variant={
                            importItem.status === 'completed' ? 'default' :
                            importItem.status === 'processing' ? 'secondary' :
                            importItem.status === 'failed' ? 'destructive' : 'outline'
                          }
                          className="text-xs"
                        >
                          {importItem.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="migration" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                  Data Migration Tools
                </CardTitle>
                <CardDescription className="text-sm">
                  Migrate and transform existing data sets
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <DataMigrationPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Platform Analytics
                </CardTitle>
                <CardDescription className="text-sm">
                  Usage metrics and performance data
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Daily Active Users</h4>
                    <p className="text-2xl sm:text-3xl font-bold text-primary">847</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">+12% from yesterday</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">API Requests</h4>
                    <p className="text-2xl sm:text-3xl font-bold text-primary">24.7K</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">+8% from yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">System Settings</CardTitle>
                <CardDescription className="text-sm">
                  Configure platform settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid gap-4 sm:gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">Maintenance Mode</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">Enable system maintenance mode</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">Backup Schedule</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">Automated backup configuration</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}