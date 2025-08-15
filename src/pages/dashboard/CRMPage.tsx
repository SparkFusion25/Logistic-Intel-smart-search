import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { CRMDashboard } from "@/components/dashboard/CRMDashboard";

const CRMPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <CRMDashboard />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CRMPage;