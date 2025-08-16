import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopBar } from "@/components/ui/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Globe, TestTube, FileText } from "lucide-react";

const EmailPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-canvas">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6">
            <div className="space-y-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-foreground mb-3">Email Outreach Hub</h1>
                  <p className="text-lg text-muted-foreground">Connect Gmail or Outlook and launch intelligence‑driven outreach</p>
                </div>

                {/* Email Provider Connection */}
                <Card className="group relative bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-md hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-variant/5 rounded-t-lg relative">
                    <CardTitle className="flex items-center text-xl">
                      <Mail className="w-6 h-6 mr-3 text-primary" />
                      Connect Email Provider
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="default" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md">
                        <Mail className="w-4 h-4 mr-2" />
                        Connect Gmail
                      </Button>
                      <Button variant="default" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md">
                        <Globe className="w-4 h-4 mr-2" />
                        Connect Outlook
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Email Composer */}
                <Card className="group relative bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-md hover:shadow-secondary/10 transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <CardHeader className="bg-gradient-to-r from-secondary/5 to-secondary-variant/5 rounded-t-lg relative">
                    <CardTitle className="flex items-center text-xl">
                      <Send className="w-6 h-6 mr-3 text-secondary" />
                      Email Composer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">From</label>
                        <Select>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select email account" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gmail">Gmail Account</SelectItem>
                            <SelectItem value="outlook">Outlook Account</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">To</label>
                        <Input placeholder="recipient@company.com" className="h-12" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Subject</label>
                      <Input placeholder="Email subject line" className="h-12" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Message</label>
                      <Textarea 
                        placeholder="Write your email message..."
                        className="min-h-[200px] resize-none"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="bg-gradient-to-r from-primary to-primary-variant shadow-md">
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline" className="border-muted-foreground/30 hover:bg-muted">
                        <TestTube className="w-4 h-4 mr-2" />
                        Send Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Email Templates */}
                <Card className="group relative bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-md hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <CardHeader className="bg-gradient-to-r from-accent/5 to-accent-variant/5 rounded-t-lg relative">
                    <CardTitle className="flex items-center text-xl">
                      <FileText className="w-6 h-6 mr-3 text-accent" />
                      Email Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-4">
                      <div className="group/item flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-canvas rounded-xl border border-border/50 hover:shadow-md transition-all duration-200">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-foreground">Logistics Partnership Intro</h4>
                          <p className="text-sm text-muted-foreground">Initial outreach for potential partnerships</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 sm:mt-0 w-full sm:w-auto">Use Template</Button>
                      </div>
                      <div className="group/item flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-canvas rounded-xl border border-border/50 hover:shadow-md transition-all duration-200">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-foreground">Quote Follow‑up</h4>
                          <p className="text-sm text-muted-foreground">Follow up on sent quotes</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 sm:mt-0 w-full sm:w-auto">Use Template</Button>
                      </div>
                      <div className="group/item flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-canvas rounded-xl border border-border/50 hover:shadow-md transition-all duration-200">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-foreground">Market Intelligence Update</h4>
                          <p className="text-sm text-muted-foreground">Share trade intelligence insights</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 sm:mt-0 w-full sm:w-auto">Use Template</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default EmailPage;