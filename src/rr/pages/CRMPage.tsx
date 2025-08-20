import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import CRMPanel from "@/components/crm/CRMPanel";

export default function CRMPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-slate-950 text-white p-6">
          <h1 className="text-2xl font-bold mb-6">CRM</h1>
          <CRMPanel />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}