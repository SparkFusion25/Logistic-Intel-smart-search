import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Plus, Download, Search, Users, Mail, TrendingUp, Building2, 
  MapPin, Globe, Calendar, ArrowRight, Star, Eye, ExternalLink,
  MoreHorizontal, RefreshCw, Filter, BarChart3, Zap, User
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopBar } from "@/components/ui/TopBar";
import { StatCard } from "@/components/shared";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Extract first name from user metadata or email
  const getDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "there";
  };

  const overviewMetrics = [
    {
      title: "Total Companies",
      value: "2,847",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: Building2,
      color: "from-blue-500 to-indigo-600",
      trend: "up" as const
    },
    {
      title: "Active Searches", 
      value: "892",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: Search,
      color: "from-cyan-500 to-blue-600",
      trend: "up" as const
    },
    {
      title: "CRM Contacts",
      value: "1,247", 
      change: "+15.7%",
      changeType: "increase" as const,
      icon: Users,
      color: "from-indigo-500 to-purple-600",
      trend: "up" as const
    },
    {
      title: "Success Rate",
      value: "89.3%",
      change: "+3.1%",
      changeType: "increase" as const,
      icon: TrendingUp,
      color: "from-blue-600 to-cyan-600",
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Enhanced Header with Gradient */}
              <div className="mb-8">
                <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 shadow-2xl">
                  {/* Enhanced background patterns */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-indigo-500/5 to-purple-600/10"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full -translate-x-48 -translate-y-48 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full translate-x-48 translate-y-48 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/5 rounded-full -translate-x-32 -translate-y-32 blur-2xl"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-6 sm:mb-0">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                              {greeting}, {getDisplayName()}! 👋
                            </h1>
                            <p className="text-blue-100 text-lg">Ready to discover new trade opportunities?</p>
                          </div>
                        </div>
                        <p className="text-blue-200 text-base sm:text-lg max-w-2xl leading-relaxed">
                          Your trade intelligence dashboard is ready. Here's what's happening with your searches and contacts.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-center px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Export Data
                        </Button>
                        <Link to="/dashboard/search">
                          <Button className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:scale-105 transition-all duration-200">
                            <Plus className="w-5 h-5 mr-2" />
                            New Search
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Key Metrics - Mobile Optimized */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {/* Enhanced Recent Searches - Mobile Optimized */}
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                  <div className="p-4 sm:p-6 border-b border-blue-100/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recent Searches</h2>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <button className="p-2 text-slate-500 hover:text-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <Link to="/dashboard/search" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                          View All
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      {recentSearches.map((search) => (
                        <div key={search.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-200 cursor-pointer group">
                          <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium sm:font-semibold text-slate-900 text-sm sm:text-base truncate">{search.query}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-slate-500 space-y-1 sm:space-y-0">
                                <span className="flex items-center">
                                  <Globe className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{search.location}</span>
                                </span>
                                <span className="hidden sm:inline">{search.results.toLocaleString()} results</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-left sm:text-right flex sm:flex-col justify-between sm:justify-center space-x-2 sm:space-x-0">
                            <span className="text-xs text-slate-500">{search.time}</span>
                            <p className="text-xs sm:text-sm text-emerald-600 font-medium sm:font-semibold">Completed</p>
                            <span className="sm:hidden text-xs text-slate-500">{search.results.toLocaleString()} results</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Quick Actions - Mobile Optimized */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                  <div className="p-4 sm:p-6 border-b border-blue-100/50">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">Quick Actions</h2>
                    <p className="text-sm text-slate-600 mt-1">Common workflow shortcuts</p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { to: "/dashboard/search", icon: Search, title: "New Search" },
                        { to: "/dashboard/crm", icon: Users, title: "Add Contact" },
                        { to: "/dashboard/analytics", icon: BarChart3, title: "View Analytics" },
                        { to: "/dashboard/settings", icon: Zap, title: "Settings" }
                      ].map((action, index) => (
                        <Link 
                          key={index}
                          to={action.to} 
                          className="flex items-center justify-between p-3 rounded-lg sm:rounded-xl border border-blue-100/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-200 group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <action.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <span className="font-medium text-slate-900 text-sm sm:text-base">{action.title}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Top Companies */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                <div className="p-6 border-b border-blue-100/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <h2 className="text-xl font-bold text-slate-900">Top Discovered Companies</h2>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm" className="p-2 border-blue-200 hover:bg-blue-50">
                        <Filter className="w-4 h-4" />
                      </Button>
                      <Link to="/dashboard/search" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                        View All Results
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {topCompanies.map((company, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-blue-100/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center space-x-4 min-w-0 flex-1 mb-3 sm:mb-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                              {company.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-slate-500">
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {company.location}
                              </span>
                              <span>{company.industry}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto">
                          <div className="text-left sm:text-right">
                            <p className="font-bold text-slate-900">{company.volume}</p>
                            <p className="text-xs text-slate-500">Trade Volume</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            company.status === 'Hot Lead' ? 'bg-red-100 text-red-700' :
                            company.status === 'Prospect' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {company.status}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors">
                              <Star className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
