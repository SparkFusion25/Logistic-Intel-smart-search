import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const WidgetsPage = () => {
  const widgets = [
    {
      title: "Tariff Calculator",
      description: "HS code + country lookups with provider cache",
      icon: <Calculator className="w-8 h-8 text-primary" />,
      href: "/dashboard/widgets/tariff"
    },
    {
      title: "Quote Generator",
      description: "Create branded quotes and export to PDF/HTML",
      icon: <FileText className="w-8 h-8 text-success" />,
      href: "/dashboard/widgets/quote"
    },
    {
      title: "Market Benchmark",
      description: "Estimate lane cost distribution (P25/P50/P75)",
      icon: <Activity className="w-8 h-8 text-warning" />,
      href: "/dashboard/widgets/benchmark"
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
              <div>
                <h1 className="text-2xl font-semibold text-card-foreground">Widgets</h1>
                <p className="text-muted-foreground">Tariffs, quotes and market benchmarks at your fingertips.</p>
              </div>

              {/* Widget Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {widgets.map((widget, index) => (
                  <Card key={index} className="bg-card border-border hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          {widget.icon}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-semibold text-card-foreground">{widget.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{widget.description}</p>
                      <Link to={widget.href}>
                        <Button className="w-full">
                          Open Widget
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Access */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-card-foreground">Quick Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                      <Link to="/dashboard/widgets/tariff">
                        <Calculator className="w-6 h-6" />
                        <span className="text-sm">Tariff Calculator</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                      <Link to="/dashboard/widgets/quote">
                        <FileText className="w-6 h-6" />
                        <span className="text-sm">Quote Generator</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                      <Link to="/dashboard/widgets/benchmark">
                        <Activity className="w-6 h-6" />
                        <span className="text-sm">Benchmark</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default WidgetsPage;