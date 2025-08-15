import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Mail, Clock, Play, Pause } from "lucide-react";

const CampaignsPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-card-foreground">Campaign Builder</h1>
                  <p className="text-muted-foreground">Create multi‑step sequences across email and LinkedIn.</p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </div>

              {/* Campaign Configuration */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-card-foreground">Campaign Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Campaign Name</label>
                      <Input placeholder="Electronics Importers Q1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Trade Lane</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trade lane" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="china-usa">China → USA</SelectItem>
                          <SelectItem value="germany-usa">Germany → USA</SelectItem>
                          <SelectItem value="vietnam-usa">Vietnam → USA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Industry</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="automotive">Automotive</SelectItem>
                          <SelectItem value="textiles">Textiles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Sequence */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-card-foreground">Campaign Sequence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                      <Mail className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-medium text-card-foreground">Initial Outreach Email</h4>
                        <p className="text-sm text-muted-foreground">Introduction and value proposition</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm font-medium">2</div>
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <h4 className="font-medium text-card-foreground">Wait 3 Days</h4>
                        <p className="text-sm text-muted-foreground">Delay before next step</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm font-medium">3</div>
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <h4 className="font-medium text-card-foreground">Follow-up Email</h4>
                        <p className="text-sm text-muted-foreground">Market insights and case study</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </CardContent>
              </Card>

              {/* Campaign Actions */}
              <div className="flex gap-3">
                <Button>
                  <Play className="w-4 h-4 mr-2" />
                  Start Campaign
                </Button>
                <Button variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CampaignsPage;