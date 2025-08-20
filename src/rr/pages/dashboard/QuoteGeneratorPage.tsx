import { useState, useRef } from "react"
import { FileText, Download, Calculator, Plus, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { supabase } from "@/integrations/supabase/client"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function QuoteGeneratorPage() {
  const [quote, setQuote] = useState({
    quote_number: `QT-${Date.now().toString().slice(-6)}`,
    customer_company: "",
    customer_email: "",
    mode: "ocean",
    origin: "",
    destination: "",
    charges: [
      { name: "Ocean Freight", buy: 0, sell: 0, margin: 0 },
      { name: "Terminal Handling", buy: 0, sell: 0, margin: 0 }
    ]
  })
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: ""
  })
  const [emailLoading, setEmailLoading] = useState(false)
  const { toast } = useToast()

  const updateCharge = (index, field, value) => {
    const newCharges = [...quote.charges]
    newCharges[index] = { ...newCharges[index], [field]: parseFloat(value) || 0 }
    newCharges[index].margin = newCharges[index].sell - newCharges[index].buy
    setQuote(prev => ({ ...prev, charges: newCharges }))
  }

  const addCharge = () => {
    setQuote(prev => ({
      ...prev,
      charges: [...prev.charges, { name: "", buy: 0, sell: 0, margin: 0 }]
    }))
  }

  const totalSell = quote.charges.reduce((sum, charge) => sum + (charge.sell || 0), 0)
  const totalMargin = quote.charges.reduce((sum, charge) => sum + (charge.margin || 0), 0)

  const printRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    if (!printRef.current) return

    try {
      setEmailLoading(true)
      
      // Generate PDF
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        unit: 'pt',
        format: 'a4'
      })
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      
      // Save quote to database first
      const { data: quoteData, error: quoteError } = await supabase.functions.invoke('quote-handler', {
        body: {
          org_id: 'default-org',
          payload: {
            quote,
            totals: { sell: totalSell, margin: totalMargin },
            generated_at: new Date().toISOString()
          },
          created_by: 'user'
        }
      })

      if (quoteError) throw quoteError

      // Download PDF
      pdf.save(`quote-${quote.quote_number}.pdf`)
      
      toast({
        title: "PDF Generated",
        description: `Quote ${quote.quote_number} has been downloaded successfully`
      })
    } catch (error) {
      console.error('PDF generation error:', error)
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive"
      })
    } finally {
      setEmailLoading(false)
    }
  }

  const handleEmailQuote = async () => {
    if (!emailData.to || !emailData.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in email address and subject",
        variant: "destructive"
      })
      return
    }

    setEmailLoading(true)
    try {
      const { error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          quote: quote,
          totalSell: totalSell,
          totalMargin: totalMargin
        }
      })

      if (error) throw error

      toast({
        title: "Quote Sent",
        description: `Quote ${quote.quote_number} has been emailed successfully`
      })
      setEmailDialogOpen(false)
      setEmailData({ to: "", subject: "", message: "" })
    } catch (error: any) {
      console.error('Error sending quote email:', error)
      toast({
        title: "Email Failed",
        description: "Failed to send quote email. Please try again.",
        variant: "destructive"
      })
    } finally {
      setEmailLoading(false)
    }
  }

  const openEmailDialog = () => {
    setEmailData({
      to: quote.customer_email || "",
      subject: `Quote ${quote.quote_number} - ${quote.origin} to ${quote.destination}`,
      message: `Dear ${quote.customer_company || "Customer"},\n\nPlease find attached your freight quote for shipment from ${quote.origin || "Origin"} to ${quote.destination || "Destination"}.\n\nQuote Total: $${totalSell.toFixed(2)}\n\nPlease let us know if you have any questions.\n\nBest regards,\nLogisticIntel Team`
    })
    setEmailDialogOpen(true)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-canvas">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl font-bold text-foreground mb-3">Quote Generator</h1>
                  <p className="text-lg text-muted-foreground">Create professional, branded freight quotes</p>
                </div>
                <div className="mt-6 lg:mt-0 flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={openEmailDialog}
                    className="px-6 py-3 h-auto text-base border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transform hover:scale-105 transition-all duration-200"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email Quote
                  </Button>
                  <Button 
                    onClick={handleDownloadPDF}
                    className="px-6 py-3 h-auto text-base bg-gradient-to-r from-primary to-primary-variant hover:from-primary-variant hover:to-primary transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <Card className="group relative bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-md hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-variant/5 rounded-t-lg relative">
                      <CardTitle className="flex items-center text-xl">
                        <FileText className="w-6 h-6 mr-3 text-primary" />
                        Quote Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6 relative">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-semibold text-foreground mb-3 block">Quote Number</label>
                          <Input
                            value={quote.quote_number}
                            onChange={(e) => setQuote(prev => ({ ...prev, quote_number: e.target.value }))}
                            className="h-12 text-base"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-foreground mb-3 block">Customer Company</label>
                          <Input
                            value={quote.customer_company}
                            onChange={(e) => setQuote(prev => ({ ...prev, customer_company: e.target.value }))}
                            className="h-12 text-base"
                            placeholder="Customer Company Name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-foreground mb-3 block">Customer Email</label>
                        <Input
                          type="email"
                          placeholder="customer@company.com"
                          value={quote.customer_email}
                          onChange={(e) => setQuote(prev => ({ ...prev, customer_email: e.target.value }))}
                          className="h-12 text-base"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="text-sm font-semibold text-foreground mb-3 block">Mode</label>
                          <Select value={quote.mode} onValueChange={(value) => setQuote(prev => ({ ...prev, mode: value }))}>
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ocean">Ocean</SelectItem>
                              <SelectItem value="air">Air</SelectItem>
                              <SelectItem value="truck">Truck</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-foreground mb-3 block">Origin</label>
                          <Input
                            placeholder="Port/City"
                            value={quote.origin}
                            onChange={(e) => setQuote(prev => ({ ...prev, origin: e.target.value }))}
                            className="h-12 text-base"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-foreground mb-3 block">Destination</label>
                          <Input
                            placeholder="Port/City"
                            value={quote.destination}
                            onChange={(e) => setQuote(prev => ({ ...prev, destination: e.target.value }))}
                            className="h-12 text-base"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass shadow-elegant border-0 transform hover:scale-[1.02] transition-transform duration-300">
                    <CardHeader className="bg-gradient-to-r from-secondary/5 to-secondary-variant/5 rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-xl">
                        <div className="flex items-center">
                          <Calculator className="w-6 h-6 mr-3 text-secondary" />
                          Charge Lines
                        </div>
                        <Button 
                          onClick={addCharge} 
                          className="bg-gradient-to-r from-accent to-accent-variant hover:from-accent-variant hover:to-accent transform hover:scale-105 transition-all duration-200"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Charge
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                      <div className="grid grid-cols-4 gap-4 pb-3 border-b border-border/50">
                        <span className="text-sm font-semibold text-muted-foreground">Description</span>
                        <span className="text-sm font-semibold text-muted-foreground">Buy Price</span>
                        <span className="text-sm font-semibold text-muted-foreground">Sell Price</span>
                        <span className="text-sm font-semibold text-muted-foreground">Margin</span>
                      </div>
                      {quote.charges.map((charge, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 items-center p-4 bg-canvas rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                          <Input
                            placeholder="Charge description"
                            value={charge.name}
                            onChange={(e) => {
                              const newCharges = [...quote.charges]
                              newCharges[index].name = e.target.value
                              setQuote(prev => ({ ...prev, charges: newCharges }))
                            }}
                            className="h-10"
                          />
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={charge.buy}
                            onChange={(e) => updateCharge(index, 'buy', e.target.value)}
                            className="h-10"
                          />
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={charge.sell}
                            onChange={(e) => updateCharge(index, 'sell', e.target.value)}
                            className="h-10"
                          />
                          <div className={`text-base font-semibold px-3 py-2 rounded-lg text-center ${
                            charge.margin >= 0 ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'
                          }`}>
                            ${charge.margin.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass shadow-elegant border-0 transform hover:scale-[1.02] transition-transform duration-300 sticky top-6">
                  <CardHeader className="bg-gradient-to-r from-success/5 to-success-variant/5 rounded-t-lg">
                    <CardTitle className="text-xl text-center">Quote Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">{quote.quote_number}</p>
                      <p className="text-sm text-muted-foreground mt-1">Quote Reference</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-canvas rounded-xl border border-border/50">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Transport Mode:</span>
                          <span className="font-semibold capitalize text-foreground">{quote.mode}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-canvas rounded-xl border border-border/50">
                        <div className="text-sm text-muted-foreground mb-1">Route:</div>
                        <div className="font-semibold text-foreground text-center">
                          {quote.origin || "Origin"} → {quote.destination || "Destination"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <div className="flex justify-between items-center p-4 bg-canvas rounded-xl border border-border/50">
                        <span className="font-semibold text-foreground">Total Quote:</span>
                        <span className="text-xl font-bold text-success">${totalSell.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-canvas rounded-xl border border-border/50">
                        <span className="font-semibold text-foreground">Profit Margin:</span>
                        <span className={`text-xl font-bold ${totalMargin >= 0 ? 'text-success' : 'text-destructive'}`}>
                          ${totalMargin.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Email Dialog */}
              <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Email Quote</DialogTitle>
                    <DialogDescription>
                      Send quote {quote.quote_number} to your customer
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">To:</label>
                      <Input
                        type="email"
                        placeholder="customer@company.com"
                        value={emailData.to}
                        onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Subject:</label>
                      <Input
                        value={emailData.subject}
                        onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Message:</label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-md min-h-[120px] text-sm"
                        value={emailData.message}
                        onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleEmailQuote} disabled={emailLoading}>
                        {emailLoading ? (
                          <LoadingSpinner size="sm" className="mr-2" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Send Quote
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* PDF Preview Section */}
              <div ref={printRef} className="bg-white rounded-lg border border-border shadow-sm p-8 print:shadow-none print:border-none">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">FREIGHT QUOTE</h2>
                  <p className="text-gray-600">Professional Logistics Services</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quote Details</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Quote #:</strong> {quote.quote_number}</p>
                      <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                      <p><strong>Mode:</strong> {quote.mode.charAt(0).toUpperCase() + quote.mode.slice(1)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Company:</strong> {quote.customer_company || 'N/A'}</p>
                      <p><strong>Email:</strong> {quote.customer_email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Route Information</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-center text-lg">
                      <strong>{quote.origin || 'Origin'}</strong> → <strong>{quote.destination || 'Destination'}</strong>
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Charges Breakdown</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Amount (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.charges.map((charge, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-2">{charge.name || `Charge ${index + 1}`}</td>
                          <td className="py-2 text-right">${charge.sell.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300">
                        <th className="text-left py-3 text-lg">Total Quote Amount</th>
                        <th className="text-right py-3 text-lg">${totalSell.toFixed(2)} USD</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-8 text-xs text-gray-500">
                  <p>This quote is valid for 30 days from the date of issue.</p>
                  <p>All rates are subject to fuel surcharge adjustments and may vary based on final shipment details.</p>
                  <p>Generated by LogisticIntel Platform - {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}