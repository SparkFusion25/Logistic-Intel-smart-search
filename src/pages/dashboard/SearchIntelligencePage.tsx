import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SearchIntelligence } from "@/components/dashboard/SearchIntelligence";

const SearchIntelligencePage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <SearchIntelligence />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SearchIntelligencePage;