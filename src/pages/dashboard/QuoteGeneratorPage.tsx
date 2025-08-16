import { useState } from "react"
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

  const handleDownloadPDF = () => {
    toast({
      title: "Generating PDF",
      description: "Your branded quote PDF is being generated..."
    })
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
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Quote Generator</h1>
                  <p className="mt-2 text-gray-600">Create professional, branded freight quotes</p>
                </div>
                <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                  <Button variant="outline" onClick={openEmailDialog}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email Quote
                  </Button>
                  <Button onClick={handleDownloadPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Quote Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Quote Number</label>
                          <Input
                            value={quote.quote_number}
                            onChange={(e) => setQuote(prev => ({ ...prev, quote_number: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Customer Company</label>
                          <Input
                            value={quote.customer_company}
                            onChange={(e) => setQuote(prev => ({ ...prev, customer_company: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Customer Email</label>
                        <Input
                          type="email"
                          placeholder="customer@company.com"
                          value={quote.customer_email}
                          onChange={(e) => setQuote(prev => ({ ...prev, customer_email: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Mode</label>
                          <Select value={quote.mode} onValueChange={(value) => setQuote(prev => ({ ...prev, mode: value }))}>
                            <SelectTrigger>
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
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Origin</label>
                          <Input
                            placeholder="Port/City"
                            value={quote.origin}
                            onChange={(e) => setQuote(prev => ({ ...prev, origin: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Destination</label>
                          <Input
                            placeholder="Port/City"
                            value={quote.destination}
                            onChange={(e) => setQuote(prev => ({ ...prev, destination: e.target.value }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calculator className="w-5 h-5 mr-2" />
                          Charges
                        </div>
                        <Button onClick={addCharge} size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Charge
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {quote.charges.map((charge, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2 items-center p-3 bg-gray-50 rounded-lg">
                          <Input
                            placeholder="Charge name"
                            value={charge.name}
                            onChange={(e) => {
                              const newCharges = [...quote.charges]
                              newCharges[index].name = e.target.value
                              setQuote(prev => ({ ...prev, charges: newCharges }))
                            }}
                          />
                          <Input
                            type="number"
                            placeholder="Buy"
                            value={charge.buy}
                            onChange={(e) => updateCharge(index, 'buy', e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Sell"
                            value={charge.sell}
                            onChange={(e) => updateCharge(index, 'sell', e.target.value)}
                          />
                          <div className="text-sm font-medium">
                            ${charge.margin.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Quote Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{quote.quote_number}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Mode:</span>
                        <span className="font-medium capitalize">{quote.mode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <span className="font-medium">{quote.origin || "Origin"} → {quote.destination || "Destination"}</span>
                      </div>
                    </div>
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-bold">${totalSell.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margin:</span>
                        <span className={`font-bold ${totalMargin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
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
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}