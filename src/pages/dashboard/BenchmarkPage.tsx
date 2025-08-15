import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, TrendingUp, BarChart3 } from "lucide-react";

const BenchmarkPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-semibold text-card-foreground">Market Benchmark Estimator</h1>
                <p className="text-muted-foreground">Estimate lane cost distribution (P25/P50/P75).</p>
              </div>

              {/* Benchmark Form */}
              <Card className="bg-card border-border">
                <CardHeader className="bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-t-lg">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Activity className="w-6 h-6" />
                    Benchmark Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Origin</label>
                      <Input placeholder="Shanghai, China" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Destination</label>
                      <Input placeholder="Los Angeles, USA" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Mode</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="air">Air Freight</SelectItem>
                          <SelectItem value="ocean">Ocean Freight</SelectItem>
                          <SelectItem value="ground">Ground Transport</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Unit</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">per kg</SelectItem>
                          <SelectItem value="feu">per FEU</SelectItem>
                          <SelectItem value="teu">per TEU</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground">HS Code (Optional)</label>
                      <Input placeholder="8517.12.0000" />
                    </div>
                  </div>
                  
                  <Button>
                    <Activity className="w-4 h-4 mr-2" />
                    Calculate Benchmark
                  </Button>
                </CardContent>
              </Card>

              {/* Benchmark Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">25th Percentile (P25)</p>
                        <p className="text-3xl font-bold text-primary">$1,850</p>
                        <p className="text-sm text-muted-foreground">per FEU</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">50th Percentile (P50)</p>
                        <p className="text-3xl font-bold text-success">$2,340</p>
                        <p className="text-sm text-muted-foreground">per FEU</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-success" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">75th Percentile (P75)</p>
                        <p className="text-3xl font-bold text-warning">$2,890</p>
                        <p className="text-sm text-muted-foreground">per FEU</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-warning" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Market Analysis */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-card-foreground">Market Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Distribution Chart */}
                    <div>
                      <h4 className="font-medium text-card-foreground mb-4">Cost Distribution</h4>
                      <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                        <p className="text-muted-foreground">Multi-color Chart - Cost Distribution Curve</p>
                      </div>
                    </div>
                    
                    {/* Trend Chart */}
                    <div>
                      <h4 className="font-medium text-card-foreground mb-4">Historical Trends</h4>
                      <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                        <p className="text-muted-foreground">Line Chart - 6 Month Price Trends</p>
                      </div>
                    </div>
                  </div>

                  {/* Sample Information */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Sample Size</p>
                      <p className="text-2xl font-bold text-primary">847</p>
                      <p className="text-xs text-muted-foreground">shipments</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Data Period</p>
                      <p className="text-2xl font-bold text-success">90</p>
                      <p className="text-xs text-muted-foreground">days</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Confidence</p>
                      <p className="text-2xl font-bold text-warning">94%</p>
                      <p className="text-xs text-muted-foreground">accuracy</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Last Updated</p>
                      <p className="text-sm font-medium text-neutral-600">2 hours ago</p>
                      <p className="text-xs text-muted-foreground">real-time data</p>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-card-foreground mb-2">Market Insights</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Prices have increased 8% compared to last quarter</li>
                      <li>• Peak season rates expected in Q2 2024</li>
                      <li>• Ocean freight capacity remains tight on this lane</li>
                      <li>• Consider air freight for time-sensitive shipments</li>
                    </ul>
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

export default BenchmarkPage;