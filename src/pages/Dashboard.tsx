import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Users, 
  Mail, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Plane,
  Ship,
  Calculator,
  FileText
} from "lucide-react";
import { SearchPanel } from "@/components/search/SearchPanel";

const Dashboard = () => {
  const [activeView, setActiveView] = useState<'overview' | 'search' | 'crm' | 'campaigns' | 'widgets'>('overview');

  const stats = [
    {
      title: "Total Searches",
      value: "12,847",
      change: "+12%",
      trend: "up",
      icon: <Search className="w-4 h-4" />
    },
    {
      title: "CRM Contacts",
      value: "3,291",
      change: "+8%",
      trend: "up",
      icon: <Users className="w-4 h-4" />
    },
    {
      title: "Email Campaigns",
      value: "47",
      change: "+23%",
      trend: "up",
      icon: <Mail className="w-4 h-4" />
    },
    {
      title: "Response Rate",
      value: "18.3%",
      change: "-2%",
      trend: "down",
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  const recentActivity = [
    {
      type: "search",
      description: "Searched for Apple Inc shipments",
      time: "2 minutes ago",
      icon: <Search className="w-4 h-4 text-primary" />
    },
    {
      type: "crm",
      description: "Added 12 contacts from Apollo enrichment",
      time: "15 minutes ago",
      icon: <Users className="w-4 h-4 text-accent" />
    },
    {
      type: "email",
      description: "Campaign 'Q1 Outreach' sent to 248 contacts",
      time: "1 hour ago",
      icon: <Mail className="w-4 h-4 text-primary" />
    },
    {
      type: "widget",
      description: "Generated quote for LAX-SHA lane",
      time: "2 hours ago",
      icon: <FileText className="w-4 h-4 text-accent" />
    }
  ];

  const quickActions = [
    {
      title: "New Search",
      description: "Search freight data",
      icon: <Search className="w-5 h-5" />,
      action: () => setActiveView('search')
    },
    {
      title: "Add Contacts",
      description: "Import or enrich CRM",
      icon: <Users className="w-5 h-5" />,
      action: () => setActiveView('crm')
    },
    {
      title: "Create Campaign",
      description: "Start email sequence",
      icon: <Mail className="w-5 h-5" />,
      action: () => setActiveView('campaigns')
    },
    {
      title: "Calculate Tariff",
      description: "Get current rates",
      icon: <Calculator className="w-5 h-5" />,
      action: () => setActiveView('widgets')
    }
  ];

  if (activeView === 'search') {
    return (
      <div className="min-h-screen bg-gradient-primary p-6">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setActiveView('overview')}
              className="border-white/20 text-foreground hover:bg-white/10"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <SearchPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-background/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <ArrowRight className="w-2.5 h-2.5 text-white rotate-45" />
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-foreground">LOGISTIC INTEL</div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Button
                variant={activeView === 'overview' ? 'default' : 'ghost'}
                onClick={() => setActiveView('overview')}
                size="sm"
              >
                Overview
              </Button>
              <Button
                variant={activeView === 'search' ? 'default' : 'ghost'}
                onClick={() => setActiveView('search')}
                size="sm"
              >
                Search
              </Button>
              <Button
                variant={activeView === 'crm' ? 'default' : 'ghost'}
                onClick={() => setActiveView('crm')}
                size="sm"
              >
                CRM
              </Button>
              <Button
                variant={activeView === 'campaigns' ? 'default' : 'ghost'}
                onClick={() => setActiveView('campaigns')}
                size="sm"
              >
                Campaigns
              </Button>
              <Button
                variant={activeView === 'widgets' ? 'default' : 'ghost'}
                onClick={() => setActiveView('widgets')}
                size="sm"
              >
                Widgets
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Welcome back to Logistic Intel
              </h1>
              <p className="text-foreground/80">
                Here's what's happening with your freight intelligence platform
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-card shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {stat.icon}
                        </div>
                        <div className="flex items-center space-x-1">
                          {stat.trend === 'up' ? (
                            <TrendingUp className="w-3 h-3 text-accent" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-destructive" />
                          )}
                          <span className={`text-xs font-medium ${
                            stat.trend === 'up' ? 'text-accent' : 'text-destructive'
                          }`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-card shadow-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
                <CardDescription>Common tasks to get you started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:border-primary/30"
                      onClick={action.action}
                    >
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {action.icon}
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-card-foreground">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
                  <CardDescription>Your latest actions on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="p-2 bg-secondary rounded-lg">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-card-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Popular Trade Lanes</CardTitle>
                  <CardDescription>Most searched routes this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Plane className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-card-foreground">LAX → SHA</span>
                      </div>
                      <Badge variant="secondary">2,847 searches</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Ship className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-card-foreground">LGB → YTN</span>
                      </div>
                      <Badge variant="secondary">1,932 searches</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Plane className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-card-foreground">JFK → LHR</span>
                      </div>
                      <Badge variant="secondary">1,634 searches</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Ship className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-card-foreground">LAX → HKG</span>
                      </div>
                      <Badge variant="secondary">1,401 searches</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'crm' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">CRM Management</h2>
            <Card className="bg-card shadow-card">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">CRM Coming Soon</h3>
                <p className="text-muted-foreground">
                  Contact management and enrichment features will be available in the next update.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'campaigns' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Email Campaigns</h2>
            <Card className="bg-card shadow-card">
              <CardContent className="p-8 text-center">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">Campaigns Coming Soon</h3>
                <p className="text-muted-foreground">
                  Email automation and campaign management features will be available in the next update.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'widgets' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Widgets & Tools</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Tariff Calculator
                  </CardTitle>
                  <CardDescription>Get real-time tariff rates for any HS code and country</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Open Calculator
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Quote Generator
                  </CardTitle>
                  <CardDescription>Create professional freight quotes and proposals</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Create Quote
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Market Benchmark
                  </CardTitle>
                  <CardDescription>Analyze market rates and trends for trade lanes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    View Benchmarks
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;