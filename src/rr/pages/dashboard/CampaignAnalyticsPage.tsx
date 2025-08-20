import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Send, Mail, MousePointer, MessageSquare, AlertTriangle } from "lucide-react";

const CampaignAnalyticsPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-semibold text-card-foreground">Campaign Analytics</h1>
                <p className="text-muted-foreground">Sends, opens, clicks, replies and bounces by campaign and step.</p>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <MetricCard
                  title="Sends"
                  value="2,847"
                  change={{ value: "+15%", type: "increase" }}
                  icon={<Send className="w-6 h-6 text-primary" />}
                />
                <MetricCard
                  title="Open Rate"
                  value="42.3%"
                  change={{ value: "+3.2%", type: "increase" }}
                  icon={<Mail className="w-6 h-6 text-success" />}
                />
                <MetricCard
                  title="Click Rate"
                  value="12.8%"
                  change={{ value: "+1.8%", type: "increase" }}
                  icon={<MousePointer className="w-6 h-6 text-warning" />}
                />
                <MetricCard
                  title="Reply Rate"
                  value="8.7%"
                  change={{ value: "+2.1%", type: "increase" }}
                  icon={<MessageSquare className="w-6 h-6 text-neutral-600" />}
                />
                <MetricCard
                  title="Bounce Rate"
                  value="3.2%"
                  change={{ value: "-0.8%", type: "decrease" }}
                  icon={<AlertTriangle className="w-6 h-6 text-danger" />}
                />
              </div>

              {/* Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-card-foreground">Performance by Step</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">Bar Chart - Campaign Step Performance</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-card-foreground">Performance over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">Line Chart - Performance Trends</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign Performance Table */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-card-foreground">Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-6 gap-4 p-3 font-medium text-muted-foreground text-sm border-b border-border">
                      <div>Campaign</div>
                      <div>Sends</div>
                      <div>Opens</div>
                      <div>Clicks</div>
                      <div>Replies</div>
                      <div>Status</div>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-4 p-3 text-sm">
                      <div className="font-medium text-card-foreground">Electronics Q1</div>
                      <div>1,247</div>
                      <div>523 (42%)</div>
                      <div>89 (17%)</div>
                      <div>34 (38%)</div>
                      <div><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span></div>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-4 p-3 text-sm">
                      <div className="font-medium text-card-foreground">Automotive Parts</div>
                      <div>892</div>
                      <div>378 (42%)</div>
                      <div>67 (18%)</div>
                      <div>23 (34%)</div>
                      <div><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Paused</span></div>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-4 p-3 text-sm">
                      <div className="font-medium text-card-foreground">Textile Importers</div>
                      <div>708</div>
                      <div>312 (44%)</div>
                      <div>45 (14%)</div>
                      <div>18 (40%)</div>
                      <div><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Completed</span></div>
                    </div>
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

export default CampaignAnalyticsPage;