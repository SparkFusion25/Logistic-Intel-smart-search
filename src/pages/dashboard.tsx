'use client';
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Users, Mail, TrendingUp, FileText, Calculator } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalSearches: 0,
    totalQuotes: 0
  });

  useEffect(() => {
    // Load dashboard stats
    fetch('/api/crm/contacts')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStats(prev => ({ ...prev, totalContacts: data.contacts?.length || 0 }));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-slate-950 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Contacts</CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalContacts}</div>
                  <p className="text-xs text-slate-400">CRM contacts in system</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Search Queries</CardTitle>
                  <Search className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalSearches}</div>
                  <p className="text-xs text-slate-400">API calls today</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Quotes Generated</CardTitle>
                  <FileText className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalQuotes}</div>
                  <p className="text-xs text-slate-400">PDFs exported</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                className="h-20 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-500"
                onClick={() => window.open('/api/search/unified?q=apple&limit=10', '_blank')}
              >
                <Search className="h-6 w-6" />
                <span>Test Search</span>
              </Button>

              <Button 
                className="h-20 flex flex-col items-center gap-2 bg-green-600 hover:bg-green-500"
                onClick={() => window.open('/api/crm/contacts', '_blank')}
              >
                <Users className="h-6 w-6" />
                <span>View CRM</span>
              </Button>

              <Button 
                className="h-20 flex flex-col items-center gap-2 bg-purple-600 hover:bg-purple-500"
                onClick={() => {
                  fetch('/api/widgets/quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      customer_name: 'Test Customer',
                      origin: 'Shanghai, China',
                      destination: 'Los Angeles, USA',
                      mode: 'ocean',
                      estimated_cost: 1500
                    })
                  }).then(r => r.json()).then(data => {
                    if (data.success) {
                      window.open(data.pdf_url, '_blank');
                    }
                  });
                }}
              >
                <FileText className="h-6 w-6" />
                <span>Generate Quote</span>
              </Button>

              <Button 
                className="h-20 flex flex-col items-center gap-2 bg-orange-600 hover:bg-orange-500"
                onClick={() => {
                  fetch('/api/widgets/tariff/calc', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      hs_code: '850440',
                      origin_country: 'China',
                      destination_country: 'United States',
                      customs_value: 10000
                    })
                  }).then(r => r.json()).then(data => {
                    alert(`Tariff Rate: ${data.duty_rate}% | Estimated Duty: $${data.est_duty}`);
                  });
                }}
              >
                <Calculator className="h-6 w-6" />
                <span>Calculate Tariff</span>
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}