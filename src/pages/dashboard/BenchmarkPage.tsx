import { useState, useEffect } from "react"
import { TrendingUp, Globe, Ship, Plane, Calendar, Download, RefreshCw, BarChart3, MapPin, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"

export default function BenchmarkPage() {
  const [filters, setFilters] = useState({
    origin_country: "",
    origin_city: "",
    dest_country: "US", 
    mode: "Ocean",
    date_from: "2024-01",
    date_to: "2025-07"
  })
  const [loading, setLoading] = useState(false)
  const [benchmarkData, setBenchmarkData] = useState<any>(null)
  const { toast } = useToast()

  const countries = ["China", "Germany", "Japan", "South Korea", "United Kingdom"]
  const modes = [
    { value: "Ocean", label: "Ocean" },
    { value: "Air", label: "Air" },
    { value: "Domestic", label: "Domestic" }
  ]

  const handleSearch = async () => {
    if (!filters.origin_country) {
      toast({
        title: "Origin Required",
        description: "Please select an origin country",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('market_benchmarks')
        .select('*')
        .eq('origin_country', filters.origin_country)
        .eq('transport_mode', filters.mode)
        .ilike('origin_city', filters.origin_city ? `%${filters.origin_city}%` : '%')
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setBenchmarkData(data)
        toast({
          title: "Analysis Complete",
          description: "Market benchmark data loaded successfully"
        })
      } else {
        setBenchmarkData(null)
        toast({
          title: "No Data Found",
          description: "No benchmark data available for this trade lane",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error('Error fetching benchmark data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch benchmark data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      origin_country: "",
      origin_city: "",
      dest_country: "US",
      mode: "Ocean",
      date_from: "2024-01",
      date_to: "2025-07"
    })
    setBenchmarkData(null)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Market Benchmark</h1>
                  <p className="mt-2 text-gray-600">Live trade data from U.S. Census International Trade API</p>
                </div>
                <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                  <Button variant="outline" onClick={resetFilters}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  {benchmarkData && (
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  )}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Trade Lane Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Origin Country</label>
                      <Select value={filters.origin_country} onValueChange={(value) => setFilters(prev => ({ ...prev, origin_country: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select origin" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Origin City (Optional)</label>
                      <Input 
                        value={filters.origin_city}
                        onChange={(e) => setFilters(prev => ({ ...prev, origin_city: e.target.value }))}
                        placeholder="e.g., Hamburg, Frankfurt"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Transport Mode</label>
                      <Select value={filters.mode} onValueChange={(value) => setFilters(prev => ({ ...prev, mode: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {modes.map(mode => (
                            <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleSearch} disabled={loading} className="mt-6">
                      {loading ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : (
                        <BarChart3 className="w-4 h-4 mr-2" />
                      )}
                      Analyze Trade Lane
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {loading && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <LoadingSpinner size="lg" text="Loading benchmark analysis..." />
                  </CardContent>
                </Card>
              )}

              {benchmarkData && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Import Value</p>
                          <p className="text-3xl font-bold text-gray-900">${benchmarkData.total_import_value}B</p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                            <span className="text-sm font-medium text-emerald-600">+{benchmarkData.yoy_change}%</span>
                            <span className="text-sm text-gray-500 ml-1">YoY</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Avg. {benchmarkData.transport_mode} Cost</p>
                          <p className="text-3xl font-bold text-blue-600">
                            ${benchmarkData.transport_mode === 'Air' ? benchmarkData.avg_air_cost :
                              benchmarkData.transport_mode === 'Ocean' ? benchmarkData.avg_ocean_cost :
                              benchmarkData.avg_domestic_cost}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-500">per unit</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                          {benchmarkData.transport_mode === 'Air' ? <Plane className="w-6 h-6 text-white" /> : 
                           benchmarkData.transport_mode === 'Ocean' ? <Ship className="w-6 h-6 text-white" /> :
                           <Package className="w-6 h-6 text-white" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">FSC Rate</p>
                          <p className="text-3xl font-bold text-amber-600">{benchmarkData.fsc_rate}%</p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-500">current rate</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Trade Lane</p>
                          <p className="text-lg font-bold text-gray-900">
                            {benchmarkData.origin_country}
                            {benchmarkData.origin_city && `, ${benchmarkData.origin_city}`}
                          </p>
                          <p className="text-lg font-bold text-gray-900">→ {benchmarkData.destination_country}</p>
                          <div className="flex items-center mt-2">
                            <Badge variant="secondary">{benchmarkData.transport_mode}</Badge>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}