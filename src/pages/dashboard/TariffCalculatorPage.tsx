import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Search } from "lucide-react";

const TariffCalculatorPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-semibold text-card-foreground">Tariff Calculator</h1>
                <p className="text-muted-foreground">HS code + country lookups with provider cache.</p>
              </div>

              {/* Calculator Form */}
              <Card className="bg-card border-border">
                <CardHeader className="bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-t-lg">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Calculator className="w-6 h-6" />
                    Calculate Tariff Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-card-foreground">HS Code</label>
                      <div className="relative">
                        <Input 
                          placeholder="8517.12.0000"
                          className="pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Enter 6-10 digit HS code</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Country</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="JP">Japan</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button className="w-full md:w-auto">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Tariff
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-card-foreground">Tariff Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium text-card-foreground">Tariff Rate</h4>
                      <p className="text-2xl font-bold text-primary">12.5%</p>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium text-card-foreground">Product Description</h4>
                      <p className="text-sm text-muted-foreground">Telephone sets, including smartphones</p>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium text-card-foreground">Last Updated</h4>
                      <p className="text-sm text-muted-foreground">January 15, 2024</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-card-foreground">Additional Information</h4>
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">HS Code 8517.12.0000</Badge>
                        <Badge variant="outline">USA Tariff</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Notes:</strong> Standard tariff rate for telecommunications equipment. 
                        Subject to additional duties if originating from certain countries under Section 301.
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">HTS Database</Badge>
                        <span className="text-xs text-muted-foreground">Provider: U.S. Customs & Border Protection</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Lookups */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-card-foreground">Recent Lookups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-card-foreground">8517.12.0000 → USA</p>
                        <p className="text-sm text-muted-foreground">Telecommunications equipment</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">12.5%</p>
                        <p className="text-xs text-muted-foreground">2 min ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-card-foreground">8471.30.0100 → Canada</p>
                        <p className="text-sm text-muted-foreground">Computer equipment</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">0%</p>
                        <p className="text-xs text-muted-foreground">5 min ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-card-foreground">6204.62.2010 → Germany</p>
                        <p className="text-sm text-muted-foreground">Women's trousers</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">8.7%</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
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

export default TariffCalculatorPage;