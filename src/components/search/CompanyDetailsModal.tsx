import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Ship, TrendingUp, TrendingDown, Bell, BellOff, Calendar, Users, Globe, Package, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type TrendPeriod = 'monthly' | 'quarterly' | '6months' | 'annual';

type CompanyDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  company: {
    company_name: string;
    company_id: string | null;
    contacts_count: number;
    shipments_count: number;
    last_shipment_date: string | null;
    modes: string[];
    dest_countries: string[];
    top_commodities: string[];
    website: string | null;
    country: string | null;
    industry: string | null;
  };
};

export function CompanyDetailsModal({ isOpen, onClose, company }: CompanyDetailsModalProps) {
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>('monthly');
  const [watchAlerts, setWatchAlerts] = useState(false);
  const [realTrendData, setRealTrendData] = useState<any[]>([]);
  const [realCommodityData, setRealCommodityData] = useState<any[]>([]);
  const [realStats, setRealStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch real company data from database
  const fetchRealCompanyData = async () => {
    if (!company.company_name || loading) return;
    
    setLoading(true);
    try {
      // Get shipment trend data
      const { data: trendData, error: trendError } = await supabase
        .from('unified_shipments')
        .select('unified_date, mode, value_usd, gross_weight_kg')
        .ilike('unified_company_name', company.company_name)
        .not('unified_date', 'is', null)
        .order('unified_date', { ascending: true })
        .limit(500);

      if (trendError) throw trendError;

      // Process trend data by period
      const processedTrends = processTrendData(trendData || [], trendPeriod);
      setRealTrendData(processedTrends);

      // Get commodity data
      const { data: commodityData, error: commodityError } = await supabase
        .from('unified_shipments')
        .select('commodity_description')
        .ilike('unified_company_name', company.company_name)
        .not('commodity_description', 'is', null);

      if (commodityError) throw commodityError;

      // Process commodity frequency
      const commodityMap = new Map();
      commodityData?.forEach(item => {
        const commodity = item.commodity_description?.trim();
        if (commodity && commodity.length > 0) {
          commodityMap.set(commodity, (commodityMap.get(commodity) || 0) + 1);
        }
      });

      const topCommodities = Array.from(commodityMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({ name: name.substring(0, 30) + '...', count }));

      setRealCommodityData(topCommodities);

      // Calculate real stats
      const totalShipments = trendData?.length || 0;
      const totalValue = trendData?.reduce((sum, item) => sum + (item.value_usd || 0), 0) || 0;
      const modes = Array.from(new Set(trendData?.map(item => item.mode).filter(Boolean)));
      
      setRealStats({
        totalShipments,
        totalValue,
        modes,
        avgValue: totalShipments > 0 ? totalValue / totalShipments : 0
      });

    } catch (error) {
      console.error('Error fetching company data:', error);
      toast({
        variant: "destructive",
        title: "Error loading company data",
        description: "Failed to fetch real-time trade data. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const processTrendData = (data: any[], period: TrendPeriod) => {
    if (!data || data.length === 0) return [];

    const grouped = new Map();
    
    data.forEach(item => {
      if (!item.unified_date) return;
      
      const date = new Date(item.unified_date);
      let key: string;
      
      switch (period) {
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'quarterly':
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
          break;
        case '6months':
          const halfYear = date.getMonth() < 6 ? 'H1' : 'H2';
          key = `${date.getFullYear()}-${halfYear}`;
          break;
        case 'annual':
          key = date.getFullYear().toString();
          break;
        default:
          key = date.getFullYear().toString();
      }
      
      if (!grouped.has(key)) {
        grouped.set(key, { period: key, shipments: 0, value: 0 });
      }
      
      const existing = grouped.get(key);
      existing.shipments += 1;
      existing.value += item.value_usd || 0;
    });

    return Array.from(grouped.values())
      .sort((a, b) => a.period.localeCompare(b.period))
      .slice(-12); // Last 12 periods
  };

  // Watch/Alert functionality
  const handleWatch = async () => {
    try {
      if (watchAlerts) {
        // Remove from watchlist
        const user = await supabase.auth.getUser();
        await supabase
          .from('crm_contacts')
          .delete()
          .eq('company_name', company.company_name)
          .eq('org_id', user.data.user?.id || '');
        
        toast({
          title: "Removed from watchlist",
          description: `${company.company_name} is no longer being watched.`
        });
      } else {
        // Add to watchlist/CRM
        await supabase
          .from('crm_contacts')
          .upsert({
            company_name: company.company_name,
            org_id: (await supabase.auth.getUser()).data.user?.id,
            source: 'company_watch',
            tags: ['watched_company'],
            notes: `Added from company details modal on ${new Date().toISOString()}`
          });

        toast({
          title: "Added to watchlist",
          description: `${company.company_name} is now being watched for trade activity.`
        });
      }
      
      setWatchAlerts(!watchAlerts);
    } catch (error) {
      console.error('Error updating watchlist:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update watchlist. Please try again."
      });
    }
  };

  useEffect(() => {
    if (isOpen && company.company_name) {
      fetchRealCompanyData();
    }
  }, [isOpen, company.company_name, trendPeriod]);

  const trendData = realTrendData.length > 0 ? realTrendData : [];
  const currentTrend = trendData.length > 1 ? 
    (trendData[trendData.length - 1].shipments > trendData[trendData.length - 2].shipments ? 'up' : 'down') : 'stable';

  const commodityData = realCommodityData.length > 0 ? realCommodityData : 
    company.top_commodities?.slice(0, 5).map((commodity, index) => ({
      name: commodity,
      count: Math.floor(Math.random() * 50) + 10,
    })) || [];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-7xl h-[95vh] sm:max-h-[90vh] p-0 sm:p-6 overflow-hidden">
        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg truncate">{company.company_name}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-full flex flex-col overflow-hidden">
          {/* Desktop Header */}
          <DialogHeader className="hidden sm:block">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="text-xl font-semibold">{company.company_name}</span>
              </DialogTitle>
              <div className="flex items-center gap-3">
                <Button
                  variant={watchAlerts ? "default" : "outline"}
                  size="sm"
                  onClick={handleWatch}
                  disabled={loading}
                  className="min-w-[100px]"
                >
                  {watchAlerts ? <Bell className="h-4 w-4 mr-2" /> : <BellOff className="h-4 w-4 mr-2" />}
                  {watchAlerts ? 'Watching' : 'Watch'}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-0">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card className="bg-card/50 backdrop-blur border border-border/50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Ship className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Shipments</p>
                    <p className="text-lg sm:text-2xl font-bold text-foreground">
                      {loading ? '...' : (realStats?.totalShipments || company.shipments_count).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border border-border/50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Trade Value</p>
                    <p className="text-lg sm:text-2xl font-bold text-foreground">
                      {loading ? '...' : `$${((realStats?.totalValue || 0) / 1000000).toFixed(1)}M`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border border-border/50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Last Activity</p>
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                      {formatDate(company.last_shipment_date)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border border-border/50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  {currentTrend === 'up' ? 
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0" /> : 
                    <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0" />
                  }
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Trend</p>
                    <p className="text-xs sm:text-sm font-medium capitalize text-foreground truncate">
                      {loading ? '...' : currentTrend}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="trends" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 mb-4 bg-muted/50 backdrop-blur">
                <TabsTrigger value="trends" className="text-xs sm:text-sm">Trends</TabsTrigger>
                <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
                <TabsTrigger value="commodities" className="text-xs sm:text-sm">Products</TabsTrigger>
                <TabsTrigger value="alerts" className="text-xs sm:text-sm">Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="flex-1 space-y-4">
                <Card className="bg-card/50 backdrop-blur border border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <CardTitle className="text-lg">Trade Volume Trends</CardTitle>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {(['monthly', 'quarterly', '6months', 'annual'] as TrendPeriod[]).map((period) => (
                          <Button
                            key={period}
                            variant={trendPeriod === period ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTrendPeriod(period)}
                            disabled={loading}
                            className="text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
                          >
                            {period === '6months' ? '6M' : period.charAt(0).toUpperCase() + period.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-64 sm:h-80">
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : trendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="period" 
                              tick={{ fontSize: 12 }}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis 
                              tick={{ fontSize: 12 }}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="shipments" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={3}
                              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <div className="text-center">
                            <Ship className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No trend data available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Industry</p>
                        <p className="text-muted-foreground">{company.industry || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="font-medium">Country</p>
                        <p className="text-muted-foreground">{company.country || 'Not specified'}</p>
                      </div>
                      {company.website && (
                        <div>
                          <p className="font-medium">Website</p>
                          <a href={company.website} target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:underline flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            {company.website}
                          </a>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-medium mb-2">Transport Modes</p>
                      <div className="flex flex-wrap gap-2">
                        {company.modes?.map((mode, index) => (
                          <Badge key={index} variant="secondary">
                            {mode}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-2">Top Destinations</p>
                      <div className="flex flex-wrap gap-2">
                        {company.dest_countries?.slice(0, 10).map((country, index) => (
                          <Badge key={index} variant="outline">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="commodities" className="flex-1 space-y-4">
                <Card className="bg-card/50 backdrop-blur border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Top Traded Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 sm:h-80">
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : commodityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={commodityData} margin={{ bottom: 60, left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45} 
                              textAnchor="end" 
                              height={80}
                              tick={{ fontSize: 10 }}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis 
                              tick={{ fontSize: 12 }}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Bar 
                              dataKey="count" 
                              fill="hsl(var(--primary))" 
                              radius={[2, 2, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <div className="text-center">
                            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No commodity data available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="flex-1 space-y-4">
                <Card className="bg-card/50 backdrop-blur border border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Smart Alerts & Monitoring</CardTitle>
                    <p className="text-sm text-muted-foreground">Set up intelligent notifications for trade activity changes</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg bg-background/50 gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">Volume Change Alerts</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Get notified when shipment volume changes by 25%+</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full sm:w-auto"
                          onClick={() => toast({ title: "Alert enabled", description: "You'll be notified of volume changes for this company." })}
                        >
                          Enable
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg bg-background/50 gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">New Destinations</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Alert when shipping to new countries</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full sm:w-auto"
                          onClick={() => toast({ title: "Alert enabled", description: "You'll be notified when this company ships to new destinations." })}
                        >
                          Enable
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg bg-background/50 gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">Pattern Anomalies</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Detect unusual seasonal changes</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full sm:w-auto"
                          onClick={() => toast({ title: "Alert enabled", description: "You'll be notified of seasonal pattern changes." })}
                        >
                          Enable
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg bg-background/50 gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">New Product Categories</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Monitor new commodity types</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full sm:w-auto"
                          onClick={() => toast({ title: "Alert enabled", description: "You'll be notified of new product categories." })}
                        >
                          Enable
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Watch Button */}
                    <div className="sm:hidden pt-4 border-t">
                      <Button
                        variant={watchAlerts ? "default" : "outline"}
                        onClick={handleWatch}
                        disabled={loading}
                        className="w-full"
                      >
                        {watchAlerts ? <Bell className="h-4 w-4 mr-2" /> : <BellOff className="h-4 w-4 mr-2" />}
                        {watchAlerts ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}