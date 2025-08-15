import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChart3, TrendingUp, Search, Users } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-semibold text-card-foreground">Analytics Dashboard</h1>
                <p className="text-muted-foreground">View detailed analytics and insights across all activities.</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Searches"
                  value="2,847"
                  change={{ value: "+15%", type: "increase" }}
                  icon={<Search className="w-6 h-6 text-primary" />}
                />
                <MetricCard
                  title="Active Users"
                  value="156"
                  change={{ value: "+8%", type: "increase" }}
                  icon={<Users className="w-6 h-6 text-success" />}
                />
                <MetricCard
                  title="Search Conversion"
                  value="23.4%"
                  change={{ value: "+3.2%", type: "increase" }}
                  icon={<TrendingUp className="w-6 h-6 text-warning" />}
                />
                <MetricCard
                  title="Avg Session Time"
                  value="8m 32s"
                  change={{ value: "+12%", type: "increase" }}
                  icon={<BarChart3 className="w-6 h-6 text-neutral-600" />}
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-card-foreground">Search Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">Line Chart - Search Volume Over Time</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-card-foreground">Top HS Codes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">Bar Chart - Most Searched HS Codes</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-card-foreground">Mode Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">Donut Chart - Transport Mode Distribution</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-card-foreground">Geographic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">Map - Search Activity by Region</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AnalyticsPage;