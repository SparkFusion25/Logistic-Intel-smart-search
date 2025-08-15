import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Mail, Plus, Trash2 } from "lucide-react";

const QuoteGeneratorPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-semibold text-card-foreground">Quote Generator</h1>
                <p className="text-muted-foreground">Create branded quotes and export to PDF/HTML.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quote Form */}
                <Card className="bg-card border-border">
                  <CardHeader className="bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-t-lg">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <FileText className="w-6 h-6" />
                      Quote Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-card-foreground">Company</label>
                        <Input placeholder="Client Company Name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-card-foreground">Contact Person</label>
                        <Input placeholder="John Doe" />
                      </div>
                    </div>
                    
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-card-foreground">Mode</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transport mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="air">Air Freight</SelectItem>
                            <SelectItem value="ocean">Ocean Freight</SelectItem>
                            <SelectItem value="ground">Ground Transport</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-card-foreground">HS Code</label>
                        <Input placeholder="8517.12.0000" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Commodity</label>
                      <Input placeholder="Electronics, Smartphones" />
                    </div>

                    {/* Line Items */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-card-foreground">Line Items</label>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5">
                            <Input placeholder="Service description" className="text-sm" />
                          </div>
                          <div className="col-span-2">
                            <Input placeholder="Qty" className="text-sm" />
                          </div>
                          <div className="col-span-2">
                            <Input placeholder="Rate" className="text-sm" />
                          </div>
                          <div className="col-span-2">
                            <Input placeholder="Amount" className="text-sm" disabled />
                          </div>
                          <div className="col-span-1">
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5">
                            <Input placeholder="Ocean freight" className="text-sm" />
                          </div>
                          <div className="col-span-2">
                            <Input placeholder="1" className="text-sm" />
                          </div>
                          <div className="col-span-2">
                            <Input placeholder="2500" className="text-sm" />
                          </div>
                          <div className="col-span-2">
                            <Input placeholder="$2,500" className="text-sm" disabled />
                          </div>
                          <div className="col-span-1">
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-card-foreground">Notes</label>
                      <Textarea 
                        placeholder="Additional terms and conditions..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quote Preview */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-card-foreground">Quote Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-white border border-gray-300 rounded-lg p-6 min-h-[500px]">
                      {/* Logo Area */}
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-2"></div>
                        <h1 className="text-2xl font-bold text-gray-900">LOGISTIC INTEL</h1>
                        <p className="text-gray-600">Freight Quote</p>
                      </div>
                      
                      {/* Quote Details */}
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                          <p className="text-gray-700">Client Company Name</p>
                          <p className="text-gray-700">John Doe</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Shipment Details:</h3>
                          <p className="text-gray-700">Origin: Shanghai, China</p>
                          <p className="text-gray-700">Destination: Los Angeles, USA</p>
                          <p className="text-gray-700">Mode: Ocean Freight</p>
                        </div>
                      </div>
                      
                      {/* Line Items Table */}
                      <div className="mb-6">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-300">
                              <th className="text-left py-2 text-gray-900">Description</th>
                              <th className="text-right py-2 text-gray-900">Qty</th>
                              <th className="text-right py-2 text-gray-900">Rate</th>
                              <th className="text-right py-2 text-gray-900">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 text-gray-700">Ocean freight</td>
                              <td className="text-right py-2 text-gray-700">1</td>
                              <td className="text-right py-2 text-gray-700">$2,500</td>
                              <td className="text-right py-2 text-gray-700">$2,500</td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr className="border-t-2 border-gray-300">
                              <td colSpan={3} className="text-right py-2 font-semibold text-gray-900">Total:</td>
                              <td className="text-right py-2 font-bold text-gray-900">$2,500</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>Valid for 30 days from quote date.</p>
                        <p>Terms and conditions apply.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Export Actions */}
              <div className="flex gap-3">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button>
                  <Mail className="w-4 h-4 mr-2" />
                  Send via Email
                </Button>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default QuoteGeneratorPage;