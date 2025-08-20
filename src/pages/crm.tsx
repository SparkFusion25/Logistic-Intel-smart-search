'use client';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import CRMPanel from "@/components/crm/CRMPanel";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CRMPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-slate-950 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">CRM</h1>
            <CRMPanel />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}