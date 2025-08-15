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
      icon: <Search className="w-6 h-6 text-sky-600" />
    },
    {
      title: "Recent Quotes Sent", 
      value: "92",
      change: { value: "+8%", type: "increase" as const },
      icon: <Users className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Avg Benchmark Cost",
      value: "$1,200", 
      change: { value: "-3%", type: "decrease" as const },
      icon: <Mail className="w-6 h-6 text-amber-600" />
    },
    {
      title: "Email Open Rate",
      value: "48.7%",
      change: { value: "+15%", type: "increase" as const },
      icon: <TrendingUp className="w-6 h-6 text-sky-600" />
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                  <p className="text-gray-600 mt-2">Welcome back. Here's what's happening in your freight intelligence.</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </button>
                  <Link to="/dashboard/search" className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    New Search
                  </Link>
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
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Search Trends</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <p className="text-gray-500 font-medium">Line Chart - Search Volume Over Time</p>
                    </div>
                  </div>

                  {/* Top HS Codes */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Top HS Codes</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <p className="text-gray-500 font-medium">Bar Chart - Most Searched HS Codes</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Mode Breakdown */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Mode Breakdown</h3>
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <p className="text-gray-500 font-medium">Donut Chart</p>
                    </div>
                  </div>

                  {/* Recent Searches */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Searches</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg border border-sky-100">
                        <span className="text-sm font-medium text-gray-900">Electronics • China → USA</span>
                        <span className="text-xs text-sky-600 font-medium">2 min ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg border border-sky-100">
                        <span className="text-sm font-medium text-gray-900">Textiles • Vietnam → EU</span>
                        <span className="text-xs text-sky-600 font-medium">5 min ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg border border-sky-100">
                        <span className="text-sm font-medium text-gray-900">Auto Parts • Germany → USA</span>
                        <span className="text-xs text-sky-600 font-medium">12 min ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Access */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Access</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/dashboard/search" className="group h-24 p-4 bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 rounded-lg hover:from-sky-100 hover:to-sky-200 transition-all duration-200 flex flex-col items-center justify-center gap-2">
                    <Search className="w-6 h-6 text-sky-600" />
                    <span className="text-sm font-medium text-sky-700">Search Intelligence</span>
                  </Link>
                  <Link to="/dashboard/crm" className="group h-24 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 flex flex-col items-center justify-center gap-2">
                    <Users className="w-6 h-6 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">CRM Dashboard</span>
                  </Link>
                  <Link to="/dashboard/widgets/quote" className="group h-24 p-4 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg hover:from-amber-100 hover:to-amber-200 transition-all duration-200 flex flex-col items-center justify-center gap-2">
                    <Mail className="w-6 h-6 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">Quote Generator</span>
                  </Link>
                  <Link to="/dashboard/widgets/benchmark" className="group h-24 p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 flex flex-col items-center justify-center gap-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Market Benchmark</span>
                  </Link>
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