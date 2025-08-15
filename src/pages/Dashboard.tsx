import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/ui/Container";
import {
  Search,
  Users,
  Mail,
  BarChart3,
  TrendingUp,
  Calculator,
  ChevronDown,
  Bell,
  Settings,
  LogOut,
  Building,
  Phone,
  MapPin,
  Ship,
  Plane,
  Globe,
  ArrowUpRight,
  Plus,
  Filter,
  Download,
  Menu,
  FileText,
  TrendingDown
} from "lucide-react";

type ActiveView = 'overview' | 'search' | 'crm' | 'campaigns' | 'widgets';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const stats = [
    {
      title: "Total Searches",
      value: "12,847",
      change: "+12%",
      trend: "up" as const,
      icon: <Search className="w-5 h-5" />
    },
    {
      title: "CRM Contacts",
      value: "3,291",
      change: "+8%",
      trend: "up" as const,
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Email Campaigns",
      value: "47",
      change: "+23%",
      trend: "up" as const,
      icon: <Mail className="w-5 h-5" />
    },
    {
      title: "Response Rate",
      value: "18.3%",
      change: "-2%",
      trend: "down" as const,
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  const recentSearches = [
    {
      query: "Electronics importers from China",
      results: 245,
      timestamp: "2 hours ago"
    },
    {
      query: "Textile manufacturers in Vietnam",
      results: 189,
      timestamp: "5 hours ago"
    },
    {
      query: "Auto parts suppliers from Mexico",
      results: 156,
      timestamp: "1 day ago"
    }
  ];

  const topContacts = [
    {
      name: "Sarah Chen",
      company: "Global Electronics Corp",
      title: "Supply Chain Director",
      email: "s.chen@globalelectronics.com",
      phone: "+1 (555) 123-4567",
      status: "verified",
      icon: <Building className="w-5 h-5 text-blue-600" />
    },
    {
      name: "Marcus Rodriguez",
      company: "Pacific Imports Ltd",
      title: "Logistics Manager", 
      email: "m.rodriguez@pacificimports.com",
      location: "Los Angeles, CA",
      status: "active",
      icon: <Ship className="w-5 h-5 text-purple-600" />
    },
    {
      name: "Lisa Wang",
      company: "TechFlow Solutions",
      title: "Procurement Head",
      email: "l.wang@techflow.com",
      phone: "+1 (555) 987-6543",
      status: "high-value",
      icon: <Plane className="w-5 h-5 text-green-600" />
    }
  ];

  if (activeView === ('search' as ActiveView)) {
    return (
      <div className="min-h-screen bg-canvas">
        <Container className="py-8">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => setActiveView('overview' as ActiveView)}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-text-on-dark">Search Trade Data</h1>
            <p className="text-text-on-dark/70 mt-2">Find importers, exporters, and trade opportunities</p>
          </div>

          {/* Search Interface */}
          <Card className="card-enterprise">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="grid lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-text-on-dark/80 mb-2">Search Query</label>
                    <input 
                      type="text" 
                      placeholder="e.g., electronics importers from China"
                      className="w-full px-4 py-3 border border-border-glass rounded-lg bg-canvas text-text-on-dark focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-on-dark/80 mb-2">Mode</label>
                    <select className="w-full px-4 py-3 border border-border-glass rounded-lg bg-canvas text-text-on-dark focus:ring-2 focus:ring-brand focus:border-transparent">
                      <option>All</option>
                      <option>Air</option>
                      <option>Ocean</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full cta-gradient text-white py-3">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-text-on-dark/70">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                  <span>•</span>
                  <span>2,847 results found</span>
                  <span>•</span>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Results */}
          <div className="mt-8 space-y-4">
            {topContacts.map((contact, index) => (
              <Card key={index} className="card-enterprise hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-elevated rounded-lg flex items-center justify-center">
                        {contact.icon}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-text-on-dark">{contact.name}</h3>
                          <p className="text-sm text-text-on-dark/70">{contact.title} at {contact.company}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-text-on-dark/60">
                          <span className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{contact.email}</span>
                          </span>
                          {contact.phone && (
                            <span className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{contact.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        className={
                          contact.status === 'verified' ? 'bg-success/20 text-success border-success/30' :
                          contact.status === 'active' ? 'bg-brand/20 text-brand border-brand/30' :
                          'bg-warning/20 text-warning border-warning/30'
                        }
                      >
                        {contact.status === 'verified' ? 'Verified' :
                         contact.status === 'active' ? 'Active' : 'High Value'}
                      </Badge>
                      <Button size="sm" className="cta-gradient text-white">
                        Add to CRM
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Top Navigation */}
      <nav className="bg-surface border-b border-border-glass sticky top-0 z-40">
        <Container>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="text-xl font-bold text-text-on-dark">LOGISTIC INTEL</div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <ChevronDown className="w-4 h-4 text-text-on-dark/50" />
              </div>
              </div>
            </div>

            {/* Tab Navigation */}
          <div className="flex items-center space-x-8 -mb-px">
            <Button
              variant={activeView === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveView('overview' as ActiveView)}
              className={`border-b-2 rounded-none px-0 py-4 ${
                activeView === 'overview' 
                  ? 'border-brand bg-transparent text-brand hover:bg-transparent' 
                  : 'border-transparent text-text-on-dark/70 hover:text-text-on-dark hover:bg-transparent'
              }`}
            >
              Overview
            </Button>
            <Button
              variant={activeView === ('search' as ActiveView) ? 'default' : 'ghost'}
              onClick={() => setActiveView('search' as ActiveView)}
              className={`border-b-2 rounded-none px-0 py-4 ${
                activeView === ('search' as ActiveView)
                  ? 'border-brand bg-transparent text-brand hover:bg-transparent' 
                  : 'border-transparent text-text-on-dark/70 hover:text-text-on-dark hover:bg-transparent'
              }`}
            >
              Search
            </Button>
            <Button
              variant={activeView === 'crm' ? 'default' : 'ghost'}
              onClick={() => setActiveView('crm' as ActiveView)}
              className={`border-b-2 rounded-none px-0 py-4 ${
                activeView === 'crm'
                  ? 'border-brand bg-transparent text-brand hover:bg-transparent' 
                  : 'border-transparent text-text-on-dark/70 hover:text-text-on-dark hover:bg-transparent'
              }`}
            >
              CRM
            </Button>
            <Button
              variant={activeView === 'campaigns' ? 'default' : 'ghost'}
              onClick={() => setActiveView('campaigns' as ActiveView)}
              className={`border-b-2 rounded-none px-0 py-4 ${
                activeView === 'campaigns'
                  ? 'border-brand bg-transparent text-brand hover:bg-transparent' 
                  : 'border-transparent text-text-on-dark/70 hover:text-text-on-dark hover:bg-transparent'
              }`}
            >
              Campaigns
            </Button>
            <Button
              variant={activeView === 'widgets' ? 'default' : 'ghost'}
              onClick={() => setActiveView('widgets' as ActiveView)}
              className={`border-b-2 rounded-none px-0 py-4 ${
                activeView === 'widgets'
                  ? 'border-brand bg-transparent text-brand hover:bg-transparent' 
                  : 'border-transparent text-text-on-dark/70 hover:text-text-on-dark hover:bg-transparent'
              }`}
            >
              Widgets
            </Button>
            </div>
        </Container>
      </nav>

      {/* Main Content */}
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-on-dark">Dashboard</h1>
          <p className="text-text-on-dark/70 mt-2">Welcome back! Here's what's happening with your freight intelligence.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-enterprise">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-on-dark/70">{stat.title}</p>
                    <p className="text-2xl font-bold text-text-on-dark mt-2">{stat.value}</p>
                    <p className={`text-sm mt-1 ${
                      stat.trend === 'up' ? 'text-success' : 'text-destructive'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-elevated rounded-lg flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Searches */}
          <Card className="lg:col-span-2 card-enterprise">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-text-on-dark">Recent Searches</CardTitle>
                  <CardDescription className="text-text-on-dark/70">Your latest trade data queries</CardDescription>
                </div>
                <Button 
                  onClick={() => setActiveView('search' as ActiveView)}
                  className="cta-gradient text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Search
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-elevated/30 rounded-lg border border-border-glass">
                    <div>
                      <p className="font-medium text-text-on-dark">{search.query}</p>
                      <p className="text-sm text-text-on-dark/70">{search.results} results • {search.timestamp}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Contacts */}
          <Card className="card-enterprise">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-text-on-dark">Top Contacts</CardTitle>
                  <CardDescription className="text-text-on-dark/70">High-value prospects</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveView('crm' as ActiveView)}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContacts.slice(0, 3).map((contact, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-elevated rounded-lg flex items-center justify-center">
                      {contact.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-on-dark truncate">{contact.name}</p>
                      <p className="text-sm text-text-on-dark/70 truncate">{contact.company}</p>
                    </div>
                    <Badge 
                      className={
                        contact.status === 'verified' ? 'bg-success/20 text-success border-success/30' :
                        contact.status === 'active' ? 'bg-brand/20 text-brand border-brand/30' :
                        'bg-warning/20 text-warning border-warning/30'
                      }
                    >
                      {contact.status === 'verified' ? 'Verified' :
                       contact.status === 'active' ? 'Active' : 'High Value'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 card-enterprise">
          <CardHeader>
            <CardTitle className="text-text-on-dark">Quick Actions</CardTitle>
            <CardDescription className="text-text-on-dark/70">Get started with your freight intelligence workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => setActiveView('search' as ActiveView)}
              >
                <Search className="w-6 h-6" />
                <span>New Search</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => setActiveView('crm' as ActiveView)}
              >
                <Users className="w-6 h-6" />
                <span>Add Contacts</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => setActiveView('campaigns' as ActiveView)}
              >
                <Mail className="w-6 h-6" />
                <span>Create Campaign</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => setActiveView('widgets' as ActiveView)}
              >
                <Calculator className="w-6 h-6" />
                <span>Calculate Tariff</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;