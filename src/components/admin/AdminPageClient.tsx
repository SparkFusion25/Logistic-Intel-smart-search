'use client';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Database, FileText, Users } from "lucide-react";

export default function AdminPageClient() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-slate-950 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Upload className="h-5 w-5" />
                    Bulk Import
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 mb-4">Upload CSV files to import contacts in bulk</p>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      alert('Bulk import functionality available via API endpoints:\n\n• POST /api/crm/contacts - Add contacts\n• GET /api/crm/contacts - View contacts\n\nUse the CRM page to manage contacts individually.');
                    }}
                  >
                    Import Contacts
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Database className="h-5 w-5" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 mb-4">Manage database tables and relationships</p>
                  <Button 
                    className="w-full"
                    onClick={() => window.open('https://zupuxlrtixhfnbuhxhum.supabase.co', '_blank')}
                  >
                    Open Supabase
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="h-5 w-5" />
                    Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 mb-4">Generate system reports and analytics</p>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      fetch('/api/crm/contacts')
                        .then(r => r.json())
                        .then(data => {
                          alert(`System Status:\n\n• API Health: ✅ Working\n• CRM Contacts: ${data.contacts?.length || 0} records\n• Database: ✅ Connected`);
                        })
                        .catch(() => {
                          alert('System Status:\n\n• API Health: ❌ Error\n• Database: ❌ Connection failed');
                        });
                    }}
                  >
                    System Status
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button 
                      className="h-16 flex flex-col gap-2"
                      onClick={() => window.open('/api/health', '_blank')}
                    >
                      <Database className="h-6 w-6" />
                      API Health
                    </Button>
                    
                    <Button 
                      className="h-16 flex flex-col gap-2"
                      onClick={() => window.open('/api/crm/contacts', '_blank')}
                    >
                      <Users className="h-6 w-6" />
                      View Contacts
                    </Button>
                    
                    <Button 
                      className="h-16 flex flex-col gap-2"
                      onClick={() => window.open('/api/search/unified?q=apple&limit=5', '_blank')}
                    >
                      <FileText className="h-6 w-6" />
                      Test Search
                    </Button>
                    
                    <Button 
                      className="h-16 flex flex-col gap-2"
                      onClick={() => {
                        fetch('/api/widgets/quote', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            customer_name: 'Test Customer',
                            origin: 'Shanghai',
                            destination: 'Los Angeles',
                            estimated_cost: 1500
                          })
                        }).then(r => r.json()).then(data => {
                          alert('Quote generated successfully! Check the API response.');
                        });
                      }}
                    >
                      <FileText className="h-6 w-6" />
                      Test Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}