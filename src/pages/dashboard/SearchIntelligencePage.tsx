import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopBar } from "@/components/ui/TopBar";
import { SearchIntelligence } from "@/components/dashboard/SearchIntelligence";

const SearchIntelligencePage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6">
            <SearchIntelligence />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SearchIntelligencePage;