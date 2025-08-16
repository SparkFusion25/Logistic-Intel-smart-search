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
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-primary/80 p-6 sm:p-8">
                  {/* Background patterns */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
                  <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 -translate-y-48 blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48 blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-6 sm:mb-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">
                              {greeting}, {getDisplayName()}! 👋
                            </h1>
                            <p className="text-white/80 mt-1">Ready to discover new trade opportunities?</p>
                          </div>
                        </div>
                        <p className="text-white/70 text-sm sm:text-base max-w-2xl">
                          Your trade intelligence dashboard is ready. Here's what's happening with your searches and contacts.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-center px-4 py-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Data
                        </Button>
                        <Link to="/dashboard/search">
                          <Button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-white text-primary hover:bg-white/90">
                            <Plus className="w-4 h-4 mr-2" />
                            New Search
                          </Button>
                        </Link>
                      </div>
                    </div>
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

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Searches */}
                <div className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <div className="p-4 sm:p-6 border-b border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <h2 className="text-lg sm:text-xl font-bold text-foreground">Recent Searches</h2>
                     <div className="flex items-center space-x-2">
                       <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
                         <RefreshCw className="w-4 h-4" />
                       </button>
                       <Link to="/dashboard/search" className="text-primary hover:text-primary/80 font-semibold text-sm">
                         View All
                       </Link>
                     </div>
                   </div>
                 </div>
                 <div className="p-4 sm:p-6">
                   <div className="space-y-3">
                     {recentSearches.map((search) => (
                       <div key={search.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer group">
                         <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                           <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/40 transition-colors">
                             <Search className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                           </div>
                           <div className="min-w-0 flex-1">
                             <p className="font-medium text-foreground text-sm sm:text-base truncate">{search.query}</p>
                             <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-0">
                               <span className="flex items-center">
                                 <Globe className="w-3 h-3 mr-1 flex-shrink-0" />
                                 <span className="truncate">{search.location}</span>
                               </span>
                               <span className="hidden sm:inline">{search.results.toLocaleString()} results</span>
                             </div>
                           </div>
                         </div>
                         <div className="text-left sm:text-right flex sm:flex-col justify-between sm:justify-center space-x-2 sm:space-x-0">
                           <span className="text-xs text-muted-foreground">{search.time}</span>
                           <p className="text-xs sm:text-sm text-emerald-600 font-medium">Completed</p>
                           <span className="sm:hidden text-xs text-muted-foreground">{search.results.toLocaleString()} results</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-xl shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <div className="p-4 sm:p-6 border-b border-border">
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">Quick Actions</h2>
                    <p className="text-sm text-muted-foreground mt-1">Common workflow shortcuts</p>
                  </div>
                 <div className="p-4 sm:p-6">
                   <div className="space-y-2 sm:space-y-3">
                     <Link 
                       to="/dashboard/search" 
                       className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 group"
                     >
                       <div className="flex items-center space-x-3">
                         <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                           <Search className="w-4 h-4 text-primary" />
                         </div>
                         <span className="font-medium text-foreground text-sm sm:text-base">New Search</span>
                       </div>
                       <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                     </Link>
                     
                     <Link 
                       to="/dashboard/crm" 
                       className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 group"
                     >
                       <div className="flex items-center space-x-3">
                         <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                           <Users className="w-4 h-4 text-primary" />
                         </div>
                         <span className="font-medium text-foreground text-sm sm:text-base">Add Contact</span>
                       </div>
                       <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                     </Link>
                     
                     <Link 
                       to="/dashboard/analytics" 
                       className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 group"
                     >
                       <div className="flex items-center space-x-3">
                         <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                           <BarChart3 className="w-4 h-4 text-primary" />
                         </div>
                         <span className="font-medium text-foreground text-sm sm:text-base">View Analytics</span>
                       </div>
                       <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                     </Link>
                     
                     <Link 
                       to="/dashboard/settings" 
                       className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 group"
                     >
                       <div className="flex items-center space-x-3">
                         <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                           <Zap className="w-4 h-4 text-primary" />
                         </div>
                         <span className="font-medium text-foreground text-sm sm:text-base">Settings</span>
                       </div>
                       <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                     </Link>
                   </div>
                 </div>
               </div>
              </div>

              {/* Top Companies */}
              <div className="bg-card rounded-xl shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="p-4 sm:p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">Top Discovered Companies</h2>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm" className="p-2">
                        <Filter className="w-4 h-4" />
                      </Button>
                      <Link to="/dashboard/search" className="text-primary hover:text-primary/80 font-semibold text-sm">
                        View All Results
                      </Link>
                    </div>
                 </div>
               </div>
               <div className="p-4 sm:p-6">
                 <div className="space-y-3 sm:space-y-4">
                   {topCompanies.map((company, index) => (
                     <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer group space-y-3 sm:space-y-0">
                       <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                         <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-colors flex-shrink-0">
                           <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                         </div>
                         <div className="min-w-0 flex-1">
                           <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                             {company.name}
                           </h3>
                           <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-0">
                             <span className="flex items-center">
                               <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                               <span className="truncate">{company.location}</span>
                             </span>
                             <span className="hidden sm:inline">{company.industry}</span>
                           </div>
                           <div className="sm:hidden text-xs text-muted-foreground mt-1">
                             {company.industry}
                           </div>
                         </div>
                       </div>
                       <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-6 w-full sm:w-auto">
                         <div className="text-left sm:text-right">
                           <p className="font-bold text-foreground text-sm sm:text-base">{company.volume}</p>
                           <p className="text-xs text-muted-foreground">Trade Volume</p>
                         </div>
                         <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                           company.status === 'Hot Lead' ? 'bg-destructive/10 text-destructive' :
                           company.status === 'Prospect' ? 'bg-warning/10 text-warning' :
                           'bg-success/10 text-success'
                         }`}>
                           {company.status}
                         </span>
                         <div className="hidden sm:flex items-center space-x-2">
                           <button className="p-2 text-muted-foreground hover:text-warning hover:bg-warning/10 rounded-lg transition-colors">
                             <Star className="w-4 h-4" />
                           </button>
                           <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                             <Eye className="w-4 h-4" />
                           </button>
                           <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                             <ExternalLink className="w-4 h-4" />
                           </button>
                         </div>
                         <div className="flex sm:hidden items-center space-x-1">
                           <button className="p-1.5 text-muted-foreground hover:text-warning hover:bg-warning/10 rounded-lg transition-colors">
                             <Star className="w-3.5 h-3.5" />
                           </button>
                           <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                             <Eye className="w-3.5 h-3.5" />
                           </button>
                           <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                             <ExternalLink className="w-3.5 h-3.5" />
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