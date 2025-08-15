import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Globe, TestTube } from "lucide-react";

const EmailPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-semibold text-card-foreground">Email Outreach Hub</h1>
                <p className="text-muted-foreground">Connect Gmail or Outlook and launch intelligence‑driven outreach.</p>
              </div>

              {/* Email Provider Connection */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-card-foreground">Connect Email Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button variant="default" className="bg-red-600 hover:bg-red-700 text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      Connect Gmail
                    </Button>
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Globe className="w-4 h-4 mr-2" />
                      Connect Outlook
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Email Composer */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-card-foreground">Email Composer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-card-foreground">From</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select email account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gmail">Gmail Account</SelectItem>
                          <SelectItem value="outlook">Outlook Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground">To</label>
                      <Input placeholder="recipient@company.com" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-card-foreground">Subject</label>
                    <Input placeholder="Email subject line" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-card-foreground">Message</label>
                    <Textarea 
                      placeholder="Write your email message..."
                      className="min-h-[200px]"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button>
                      <Send className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline">
                      <TestTube className="w-4 h-4 mr-2" />
                      Send Test
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Email Templates */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-card-foreground">Email Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-card-foreground">Logistics Partnership Intro</h4>
                        <p className="text-sm text-muted-foreground">Initial outreach for potential partnerships</p>
                      </div>
                      <Button variant="outline" size="sm">Use Template</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-card-foreground">Quote Follow‑up</h4>
                        <p className="text-sm text-muted-foreground">Follow up on sent quotes</p>
                      </div>
                      <Button variant="outline" size="sm">Use Template</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-card-foreground">Market Intelligence Update</h4>
                        <p className="text-sm text-muted-foreground">Share trade intelligence insights</p>
                      </div>
                      <Button variant="outline" size="sm">Use Template</Button>
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

export default EmailPage;