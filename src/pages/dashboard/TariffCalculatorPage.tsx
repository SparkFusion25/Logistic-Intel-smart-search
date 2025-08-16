import { useState } from "react"
import { Calculator, DollarSign, AlertCircle, Info, Ship, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"

export default function TariffCalculatorPage() {
  const [inputs, setInputs] = useState({
    origin_country: "",
    hs_code: "",
    customs_value: "",
    currency: "USD",
    mode: "ocean"
  })
  const [calculation, setCalculation] = useState(null)
  const { toast } = useToast()

  const handleCalculate = () => {
    if (!inputs.origin_country || !inputs.hs_code || !inputs.customs_value) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const duty = parseFloat(inputs.customs_value) * 0.035
    const mpf = Math.max(31.67, Math.min(614.35, parseFloat(inputs.customs_value) * 0.003464))
    const hmf = inputs.mode === "ocean" ? parseFloat(inputs.customs_value) * 0.00125 : 0
    const total = duty + mpf + hmf

    setCalculation({ duty, mpf, hmf, total })
    toast({
      title: "Calculation Complete",
      description: "Tariff estimate generated"
    })
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-canvas">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-3">Tariff Calculator</h1>
                <p className="text-lg text-muted-foreground">Calculate import duties and fees for U.S. customs</p>
              </div>

              <Card className="glass shadow-elegant border-0 transform hover:scale-[1.02] transition-transform duration-300">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-variant/5 rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <Calculator className="w-6 h-6 mr-3 text-primary" />
                    Import Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-3 block">Origin Country *</label>
                      <Input
                        placeholder="e.g., China, Germany, Brazil"
                        value={inputs.origin_country}
                        onChange={(e) => setInputs(prev => ({ ...prev, origin_country: e.target.value }))}
                        className="h-12 text-base"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground mb-3 block">HTS/HS Code *</label>
                      <Input
                        placeholder="e.g., 8542.39.0001"
                        value={inputs.hs_code}
                        onChange={(e) => setInputs(prev => ({ ...prev, hs_code: e.target.value }))}
                        className="h-12 text-base"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground mb-3 block">Customs Value (USD) *</label>
                      <Input
                        type="number"
                        placeholder="10,000"
                        value={inputs.customs_value}
                        onChange={(e) => setInputs(prev => ({ ...prev, customs_value: e.target.value }))}
                        className="h-12 text-base"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground mb-3 block">Transport Mode</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setInputs(prev => ({ ...prev, mode: "ocean" }))}
                          className={`h-12 rounded-md border-2 flex items-center justify-center space-x-2 transition-all duration-200 ${
                            inputs.mode === "ocean" 
                              ? "border-primary bg-primary/10 text-primary" 
                              : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Ship className="w-4 h-4" />
                          <span>Ocean</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputs(prev => ({ ...prev, mode: "air" }))}
                          className={`h-12 rounded-md border-2 flex items-center justify-center space-x-2 transition-all duration-200 ${
                            inputs.mode === "air" 
                              ? "border-primary bg-primary/10 text-primary" 
                              : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Plane className="w-4 h-4" />
                          <span>Air</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button 
                      onClick={handleCalculate} 
                      className="px-8 py-4 text-lg h-auto bg-gradient-to-r from-primary to-primary-variant hover:from-primary-variant hover:to-primary transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      <Calculator className="w-5 h-5 mr-3" />
                      Calculate Tariffs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-accent/20 bg-accent/5">
                <AlertCircle className="h-5 w-5 text-accent" />
                <AlertDescription className="text-base ml-2">
                  Duty estimates are based on public tariff schedules. Final assessments depend on CBP classification and valuation.
                </AlertDescription>
              </Alert>

              {calculation && (
                <Card className="glass shadow-elegant border-0 transform hover:scale-[1.02] transition-transform duration-300">
                  <CardHeader className="bg-gradient-to-r from-success/5 to-success-variant/5 rounded-t-lg">
                    <CardTitle className="flex items-center text-xl">
                      <DollarSign className="w-6 h-6 mr-3 text-success" />
                      Calculation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-5 bg-canvas rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div>
                            <span className="font-semibold text-foreground">Import Duty (3.5%)</span>
                            <div className="text-sm text-muted-foreground">Based on customs value</div>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-foreground">${calculation.duty.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-5 bg-canvas rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-accent"></div>
                          <div>
                            <span className="font-semibold text-foreground">MPF (Merchandise Processing Fee)</span>
                            <div className="text-sm text-muted-foreground">0.3464% of value (min/max applied)</div>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-foreground">${calculation.mpf.toFixed(2)}</span>
                      </div>
                      
                      {calculation.hmf > 0 && (
                        <div className="flex justify-between items-center p-5 bg-canvas rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-secondary"></div>
                            <div>
                              <span className="font-semibold text-foreground">HMF (Harbor Maintenance Fee)</span>
                              <div className="text-sm text-muted-foreground">0.125% for ocean shipments only</div>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-foreground">${calculation.hmf.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-success/10 to-success-variant/10 rounded-xl border-2 border-success/20 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-success"></div>
                          <span className="text-xl font-bold text-foreground">Total Estimated Cost</span>
                        </div>
                        <span className="text-2xl font-bold text-success">${calculation.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-accent mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-foreground mb-1">Important Notes:</p>
                          <ul className="space-y-1 text-sm">
                            <li>• These are estimates based on standard rates</li>
                            <li>• Actual duties may vary based on CBP classification</li>
                            <li>• Additional fees may apply for specific commodities</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}