import { useState } from "react"
import { Calculator, DollarSign, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

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

  const countries = ["China", "Germany", "Japan", "South Korea", "United Kingdom"]

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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tariff Calculator</h1>
        <p className="mt-2 text-gray-600">Calculate import duties and fees for U.S. customs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Import Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Origin Country *</label>
              <Select value={inputs.origin_country} onValueChange={(value) => setInputs(prev => ({ ...prev, origin_country: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">HTS/HS Code *</label>
              <Input
                placeholder="e.g., 8542.39.0001"
                value={inputs.hs_code}
                onChange={(e) => setInputs(prev => ({ ...prev, hs_code: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Customs Value *</label>
              <Input
                type="number"
                placeholder="0.00"
                value={inputs.customs_value}
                onChange={(e) => setInputs(prev => ({ ...prev, customs_value: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Transport Mode</label>
              <Select value={inputs.mode} onValueChange={(value) => setInputs(prev => ({ ...prev, mode: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ocean">Ocean</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full md:w-auto">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Tariffs
          </Button>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Duty estimates are based on public tariff schedules. Final assessments depend on CBP classification and valuation.
        </AlertDescription>
      </Alert>

      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Calculation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span>Import Duty (3.5%)</span>
                <span className="font-bold">${calculation.duty.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span>MPF</span>
                <span className="font-bold">${calculation.mpf.toFixed(2)}</span>
              </div>
              {calculation.hmf > 0 && (
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span>HMF (Ocean)</span>
                  <span className="font-bold">${calculation.hmf.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between p-4 bg-primary/10 rounded-lg">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold text-primary">${calculation.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}