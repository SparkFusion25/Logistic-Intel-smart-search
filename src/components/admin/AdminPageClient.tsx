import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive } from 'lucide-react';
import { BulkImportManager } from './BulkImportManager';
import { DataMigrationPanel } from './DataMigrationPanel';

export default function AdminPageClient() {
  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Mobile-optimized stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
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
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
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

      <Card className="shadow-card hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl font-semibold">Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Button className="h-16 sm:h-20 lg:h-24 flex flex-col gap-1 sm:gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base transition-all duration-200 touch-manipulation">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="font-medium">Manage Users</span>
            </Button>
            
            <Button variant="outline" className="h-16 sm:h-20 lg:h-24 flex flex-col gap-1 sm:gap-2 text-sm sm:text-base hover:bg-accent transition-all duration-200 touch-manipulation">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <span className="font-medium">Database Backup</span>
            </Button>
            
            <Button variant="outline" className="h-16 sm:h-20 lg:h-24 flex flex-col gap-1 sm:gap-2 text-sm sm:text-base hover:bg-accent transition-all duration-200 touch-manipulation">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
              <span className="font-medium">System Settings</span>
            </Button>
            
            <Button variant="outline" className="h-16 sm:h-20 lg:h-24 flex flex-col gap-1 sm:gap-2 text-sm sm:text-base hover:bg-accent transition-all duration-200 touch-manipulation">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">View Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <DataMigrationPanel />
      <BulkImportManager />
      </div>
    </div>
  );
}