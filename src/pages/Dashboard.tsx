import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Users, Search, Mail, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {

  const overviewMetrics = [
    {
      title: "Companies Tracked",
      value: "1,840",
      change: { value: "+12%", type: "increase" as const },
      icon: <Search className="w-6 h-6 text-primary" />
    },
    {
      title: "Recent Quotes Sent", 
      value: "92",
      change: { value: "+8%", type: "increase" as const },
      icon: <Users className="w-6 h-6 text-success" />
    },
    {
      title: "Avg Benchmark Cost",
      value: "$1,200", 
      change: { value: "-3%", type: "decrease" as const },
      icon: <Mail className="w-6 h-6 text-warning" />
    },
    {
      title: "Email Open Rate",
      value: "48.7%",
      change: { value: "+15%", type: "increase" as const },
      icon: <TrendingUp className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-card-foreground">Dashboard Overview</h1>
                  <p className="text-muted-foreground">Welcome back. Here's what's happening in your freight intelligence.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button asChild>
                    <Link to="/dashboard/search">
                      <Plus className="w-4 h-4 mr-2" />
                      New Search
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewMetrics.map((metric, index) => (
                  <MetricCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    change={metric.change}
                    icon={metric.icon}
                  />
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Search Trends Chart */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">Search Trends</h3>
                    <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">Line Chart - Search Volume Over Time</p>
                    </div>
                  </div>

                  {/* Top HS Codes */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">Top HS Codes</h3>
                    <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">Bar Chart - Most Searched HS Codes</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Mode Breakdown */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">Mode Breakdown</h3>
                    <div className="h-48 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">Donut Chart</p>
                    </div>
                  </div>

                  {/* Recent Searches */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Searches</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm text-card-foreground">Electronics • China → USA</span>
                        <span className="text-xs text-muted-foreground">2 min ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm text-card-foreground">Textiles • Vietnam → EU</span>
                        <span className="text-xs text-muted-foreground">5 min ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm text-card-foreground">Auto Parts • Germany → USA</span>
                        <span className="text-xs text-muted-foreground">12 min ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Access */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Access</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                    <Link to="/dashboard/search">
                      <Search className="w-6 h-6" />
                      <span className="text-sm">Search Intelligence</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                    <Link to="/dashboard/crm">
                      <Users className="w-6 h-6" />
                      <span className="text-sm">CRM Dashboard</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                    <Link to="/dashboard/widgets/quote">
                      <Mail className="w-6 h-6" />
                      <span className="text-sm">Quote Generator</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                    <Link to="/dashboard/widgets/benchmark">
                      <TrendingUp className="w-6 h-6" />
                      <span className="text-sm">Market Benchmark</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;