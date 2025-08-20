'use client';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import QuoteGenerator from "@/components/widgets/QuoteGenerator";
import TariffCalculator from "@/components/widgets/TariffCalculator";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function WidgetsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-slate-950 text-white p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Widgets & Tools</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Quote Generator</h2>
                <QuoteGenerator />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Tariff Calculator</h2>
                <TariffCalculator />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}