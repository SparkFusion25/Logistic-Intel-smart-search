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
      title: "Total Searches",
      value: "1,247",
      change: { value: "+12%", type: "increase" as const },
      icon: <Search className="w-6 h-6 text-primary" />
    },
    {
      title: "CRM Contacts", 
      value: "89",
      change: { value: "+8%", type: "increase" as const },
      icon: <Users className="w-6 h-6 text-accent" />
    },
    {
      title: "Email Campaigns",
      value: "24", 
      change: { value: "+15%", type: "increase" as const },
      icon: <Mail className="w-6 h-6 text-warning" />
    },
    {
      title: "Response Rate",
      value: "18.5%",
      change: { value: "+3.2%", type: "increase" as const },
      icon: <TrendingUp className="w-6 h-6 text-success" />
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'search':
        return <SearchIntelligence />;
      case 'crm':
        return <CRMDashboard />;
      case 'campaigns':
        return (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Email Campaigns</h3>
            <p className="text-muted-foreground">Create and manage your outreach campaigns.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Analytics</h3>
            <p className="text-muted-foreground">View detailed analytics and insights.</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-card-foreground">Dashboard Overview</h1>
                <p className="text-muted-foreground">Welcome back! Here's what's happening with your trade intelligence.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Search
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

            {/* Quick Summary */}
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Start Exploring Trade Data</h3>
              <p className="text-muted-foreground mb-4">Use the sidebar to navigate to Search Intelligence or CRM to get started.</p>
              <Button onClick={() => setActiveView('search')}>
                Go to Search Intelligence
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;