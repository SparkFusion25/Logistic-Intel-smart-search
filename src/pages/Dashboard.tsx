import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Plus, Download, Search, Users, Mail, TrendingUp, Building2, 
  MapPin, Globe, Calendar, ArrowRight, Star, Eye, ExternalLink,
  MoreHorizontal, RefreshCw, Filter, BarChart3, Zap
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { StatCard } from "@/components/shared";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const overviewMetrics = [
    {
      title: "Total Companies",
      value: "2,847",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: Building2,
      color: "from-blue-400 to-blue-500",
      trend: "up" as const
    },
    {
      title: "Active Searches", 
      value: "892",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: Search,
      color: "from-emerald-400 to-emerald-500",
      trend: "up" as const
    },
    {
      title: "CRM Contacts",
      value: "1,247", 
      change: "+15.7%",
      changeType: "increase" as const,
      icon: Users,
      color: "from-purple-400 to-purple-500",
      trend: "up" as const
    },
    {
      title: "Success Rate",
      value: "89.3%",
      change: "+3.1%",
      changeType: "increase" as const,
      icon: TrendingUp,
      color: "from-orange-400 to-orange-500",
      trend: "up" as const
    }
  ];

  const recentSearches = [
    {
      id: 1,
      query: "Electronics Importers",
      results: 1247,
      location: "China → USA",
      industry: "Technology",
      time: "2 hours ago",
      status: "completed"
    },
    {
      id: 2,
      query: "Automotive Parts",
      results: 856,
      location: "Germany → USA",
      industry: "Automotive",
      time: "5 hours ago",
      status: "completed"
    },
    {
      id: 3,
      query: "Textile Manufacturers",
      results: 692,
      location: "Vietnam → EU",
      industry: "Textiles",
      time: "1 day ago",
      status: "completed"
    }
  ];

  const topCompanies = [
    {
      name: "Apple Inc.",
      location: "Cupertino, CA",
      industry: "Technology",
      volume: "$2.4B",
      status: "Hot Lead",
      confidence: 98
    },
    {
      name: "Samsung Electronics",
      location: "Seoul, South Korea", 
      industry: "Electronics",
      volume: "$1.8B",
      status: "Prospect",
      confidence: 95
    },
    {
      name: "Global Logistics Corp",
      location: "Hamburg, Germany",
      industry: "Logistics",
      volume: "$890M", 
      status: "Customer",
      confidence: 92
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="mt-2 text-gray-600">Welcome back. Here's what's happening with your trade intelligence.</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    <button className="flex items-center px-4 py-2 text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </button>
                    <Link to="/dashboard/search" className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                      <Plus className="w-4 h-4 mr-2" />
                      New Search
                    </Link>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {overviewMetrics.map((metric, index) => (
                  <StatCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    change={metric.change}
                    changeType={metric.changeType}
                    icon={metric.icon}
                    color={metric.color}
                    trend={metric.trend}
                  />
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Searches */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Recent Searches</h2>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <Link to="/dashboard/search" className="text-sky-600 hover:text-sky-700 font-semibold text-sm">
                          View All
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentSearches.map((search) => (
                        <div key={search.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                              <Search className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{search.query}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Globe className="w-3 h-3 mr-1" />
                                  {search.location}
                                </span>
                                <span>{search.results.toLocaleString()} results</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500">{search.time}</span>
                            <p className="text-sm text-emerald-600 font-medium">Completed</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                    <p className="text-sm text-gray-600 mt-1">Common workflow shortcuts</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <Link 
                        to="/dashboard/search" 
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-sky-50 hover:border-sky-200 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                            <Search className="w-4 h-4 text-sky-600" />
                          </div>
                          <span className="font-medium text-gray-900">New Search</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                      
                      <Link 
                        to="/dashboard/crm" 
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-900">Add Contact</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                      
                      <Link 
                        to="/dashboard/analytics" 
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">View Analytics</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                      
                      <Link 
                        to="/dashboard/settings" 
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="font-medium text-gray-900">Settings</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Companies */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Top Discovered Companies</h2>
                    <div className="flex items-center space-x-3">
                      <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                      </button>
                      <Link to="/dashboard/search" className="text-sky-600 hover:text-sky-700 font-semibold text-sm">
                        View All Results
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {topCompanies.map((company, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-sky-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                              {company.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {company.location}
                              </span>
                              <span>{company.industry}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{company.volume}</p>
                            <p className="text-xs text-gray-500">Trade Volume</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            company.status === 'Hot Lead' ? 'bg-red-100 text-red-800' :
                            company.status === 'Prospect' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {company.status}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                              <Star className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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