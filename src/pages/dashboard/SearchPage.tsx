import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopBar } from "@/components/ui/TopBar";
import { SearchIntelligence } from "@/components/dashboard/SearchIntelligence";

const SearchPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 shadow-lg">
                  <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      Trade Intelligence Search
                    </h1>
                    <p className="text-blue-200 text-sm sm:text-base">
                      Search and discover companies, suppliers, and trade opportunities worldwide.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <SearchIntelligence />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SearchPage;