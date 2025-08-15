import { useState } from "react"
import { TrendingUp, Globe, Ship, Plane, Calendar, Download, RefreshCw, BarChart3, MapPin, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function BenchmarkPage() {
  const [filters, setFilters] = useState({
    origin_country: "",
    dest_country: "US", 
    mode: "all",
    date_from: "2024-01",
    date_to: "2025-07"
  })
  const [hasSearched, setHasSearched] = useState(false)
  const { toast } = useToast()

  const countries = ["China", "Germany", "Japan", "South Korea", "United Kingdom"]

  const handleSearch = () => {
    if (!filters.origin_country) {
      toast({
        title: "Origin Required",
        description: "Please select an origin country",
        variant: "destructive"
      })
      return
    }
    setHasSearched(true)
    toast({
      title: "Benchmark Analysis",
      description: "Loading trade data from U.S. Census..."
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Benchmark</h1>
          <p className="mt-2 text-gray-600">Live trade data from U.S. Census International Trade API</p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <Button variant="outline" onClick={() => setHasSearched(false)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          {hasSearched && (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="text-sm font-medium text-gray-700 mb-2 block">Transport Mode</label>
              <Select value={filters.mode} onValueChange={(value) => setFilters(prev => ({ ...prev, mode: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="ocean">Ocean</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSearch} className="mt-6">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analyze Trade Lane
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Import Value</p>
                  <p className="text-3xl font-bold text-gray-900">$45.8B</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                    <span className="text-sm font-medium text-emerald-600">+12.5%</span>
                    <span className="text-sm text-gray-500 ml-1">YoY</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}