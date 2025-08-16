import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import MarketBenchmark from "@/components/benchmark/MarketBenchmark"

export default function BenchmarkPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-canvas">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-3">Market Benchmark</h1>
                <p className="text-lg text-muted-foreground">Analyze import trade patterns and market trends</p>
              </div>
              
              <MarketBenchmark />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}