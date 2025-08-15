import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Calendar, List } from "lucide-react";

const FollowUpsPage = () => {
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
                  <h1 className="text-2xl font-semibold text-card-foreground">Follow‑Up Automation</h1>
                  <p className="text-muted-foreground">Rules, calendar and execution logs for automated follow‑ups.</p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Button>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="rules" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="rules" className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Follow‑up Rules
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Calendar View
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Execution Log
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="rules">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-card-foreground">Active Follow-up Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-6 gap-4 p-3 font-medium text-muted-foreground text-sm border-b border-border">
                          <div>Template</div>
                          <div>Delay</div>
                          <div>Conditions</div>
                          <div>Next Execution</div>
                          <div>Status</div>
                          <div>Actions</div>
                        </div>
                        
                        <div className="grid grid-cols-6 gap-4 p-3 text-sm items-center">
                          <div className="font-medium text-card-foreground">Quote Follow-up</div>
                          <div>3 days</div>
                          <div>No reply to initial quote</div>
                          <div>Tomorrow 9:00 AM</div>
                          <div><Badge className="bg-green-100 text-green-800">Active</Badge></div>
                          <div>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-6 gap-4 p-3 text-sm items-center">
                          <div className="font-medium text-card-foreground">Market Update</div>
                          <div>7 days</div>
                          <div>Cold prospects</div>
                          <div>In 2 days 10:00 AM</div>
                          <div><Badge className="bg-green-100 text-green-800">Active</Badge></div>
                          <div>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-6 gap-4 p-3 text-sm items-center">
                          <div className="font-medium text-card-foreground">Partnership Intro</div>
                          <div>14 days</div>
                          <div>No engagement</div>
                          <div>Next week</div>
                          <div><Badge className="bg-yellow-100 text-yellow-800">Paused</Badge></div>
                          <div>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="calendar">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-card-foreground">Scheduled Follow-ups</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
                        <p className="text-muted-foreground">Calendar View - Scheduled Follow-up Activities</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="logs">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-card-foreground">Execution Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-5 gap-4 p-3 font-medium text-muted-foreground text-sm border-b border-border">
                          <div>Timestamp</div>
                          <div>Rule</div>
                          <div>Contact</div>
                          <div>Action</div>
                          <div>Status</div>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-4 p-3 text-sm">
                          <div>2024-01-15 09:00</div>
                          <div>Quote Follow-up</div>
                          <div>john@techcorp.com</div>
                          <div>Email sent</div>
                          <div><Badge className="bg-green-100 text-green-800">Success</Badge></div>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-4 p-3 text-sm">
                          <div>2024-01-15 09:05</div>
                          <div>Market Update</div>
                          <div>sarah@electronics.com</div>
                          <div>Email sent</div>
                          <div><Badge className="bg-green-100 text-green-800">Success</Badge></div>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-4 p-3 text-sm">
                          <div>2024-01-15 09:10</div>
                          <div>Partnership Intro</div>
                          <div>mike@logistics.com</div>
                          <div>Email failed</div>
                          <div><Badge className="bg-red-100 text-red-800">Failed</Badge></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default FollowUpsPage;