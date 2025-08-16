import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, Calendar, Globe } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface BenchmarkData {
  source: string
  parameters: any
  series: Array<{ month: string; value: number }>
  totals: { value: number }
  statistics: {
    count: number
    min: number
    max: number
    median: number
    p25: number
    p75: number
  }
  metadata: any
}

export default function MarketBenchmark() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<BenchmarkData | null>(null)
  const [form, setForm] = useState({ 
    origin_country: 'CN', 
    hs: '', 
    mode: 'all' 
  })
  const { toast } = useToast()

  async function runBenchmark() {
    if (!form.origin_country) {
      toast({
        title: "Missing Information",
        description: "Please enter an origin country code",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const { data: result, error } = await supabase.functions.invoke('market-benchmark', {
        body: {
          origin_country: form.origin_country,
          hs: form.hs,
          mode: form.mode
        }
      })

      if (error) throw error

      setData(result)
      toast({
        title: "Benchmark Complete",
        description: `Found ${result.series.length} data points from ${result.source}`
      })
    } catch (error) {
      console.error('Benchmark error:', error)
      toast({
        title: "Benchmark Failed",
        description: "Unable to fetch benchmark data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="group relative bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-md hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center text-xl">
            <Globe className="w-6 h-6 mr-3 text-primary" />
            Market Benchmark Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Origin Country *</label>
              <Input
                placeholder="e.g., CN, DE, JP"
                value={form.origin_country}
                onChange={e => setForm({...form, origin_country: e.target.value.toUpperCase()})}
                className="h-12 text-base"
              />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">HS Code (Optional)</label>
              <Input
                placeholder="e.g., 8542.39"
                value={form.hs}
                onChange={e => setForm({...form, hs: e.target.value})}
                className="h-12 text-base"
              />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Transport Mode</label>
              <Select value={form.mode} onValueChange={value => setForm({...form, mode: value})}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="ocean">Ocean</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={runBenchmark} 
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary-variant hover:from-primary-variant hover:to-primary"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                {loading ? 'Loading...' : 'Get Benchmark'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {!data && !loading && (
        <Card className="bg-gradient-to-br from-muted/50 to-muted/20 border-border/50">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Run a benchmark query to see market data</p>
              <p className="text-sm mt-2">Enter origin country and optional filters above</p>
            </div>
          </CardContent>
        </Card>
      )}

      {data && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold text-success">
                  ${(data.totals.value / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-muted-foreground">Total Trade Value</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{data.statistics.count}</div>
                <div className="text-sm text-muted-foreground">Data Points</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold text-foreground">
                  ${(data.statistics.median / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-muted-foreground">Median Monthly</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
              <CardContent className="p-6 text-center">
                <Globe className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold text-foreground">
                  ${(data.statistics.max / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-muted-foreground">Peak Monthly</div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card className="group relative bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-md hover:shadow-success/10 transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center justify-between">
                <span>Monthly Trade Value Trend</span>
                <div className="text-sm text-muted-foreground">
                  {data.parameters.origin_country} → US | {data.parameters.hs || 'All Products'}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.series}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Trade Value']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="bg-gradient-to-br from-muted/50 to-muted/20 border-border/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Data Source:</span>
                  <div className="text-muted-foreground capitalize">{data.source}</div>
                </div>
                <div>
                  <span className="font-semibold">Date Range:</span>
                  <div className="text-muted-foreground">{data.parameters.date_range}</div>
                </div>
                <div>
                  <span className="font-semibold">Processing:</span>
                  <div className="text-muted-foreground">
                    {data.metadata.processed_records} of {data.metadata.total_records} records
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}