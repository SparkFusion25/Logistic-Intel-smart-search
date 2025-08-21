import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Ship, TrendingUp, TrendingDown, Bell, BellOff, Calendar, Users, Globe, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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

  // Mock trend data - replace with real API calls
  const generateTrendData = (period: TrendPeriod) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    let labels;
    let dataPoints;
    
    switch (period) {
      case 'monthly':
        labels = months.slice(0, 6);
        dataPoints = [45, 52, 38, 67, 89, 72];
        break;
      case 'quarterly':
        labels = quarters;
        dataPoints = [156, 178, 142, 189];
        break;
      case '6months':
        labels = months.slice(0, 6);
        dataPoints = [289, 267, 298, 334, 356, 378];
        break;
      case 'annual':
        labels = ['2022', '2023', '2024'];
        dataPoints = [1245, 1567, 1423];
        break;
    }

    return labels.map((label, index) => ({
      period: label,
      shipments: dataPoints[index],
      value: dataPoints[index] * 1200 + Math.random() * 5000,
    }));
  };

  const trendData = generateTrendData(trendPeriod);
  const currentTrend = trendData.length > 1 ? 
    (trendData[trendData.length - 1].shipments > trendData[trendData.length - 2].shipments ? 'up' : 'down') : 'stable';

  const commodityData = company.top_commodities?.slice(0, 5).map((commodity, index) => ({
    name: commodity,
    count: Math.floor(Math.random() * 50) + 10,
  })) || [];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              {company.company_name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={watchAlerts ? "default" : "outline"}
                size="sm"
                onClick={() => setWatchAlerts(!watchAlerts)}
              >
                {watchAlerts ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                {watchAlerts ? 'Watching' : 'Watch'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Stats */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Shipments</p>
                    <p className="text-2xl font-bold">{company.shipments_count.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Contacts</p>
                    <p className="text-2xl font-bold">{company.contacts_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Shipment</p>
                    <p className="text-sm font-medium">{formatDate(company.last_shipment_date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {currentTrend === 'up' ? 
                    <TrendingUp className="h-4 w-4 text-green-500" /> : 
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  }
                  <div>
                    <p className="text-sm text-muted-foreground">Trend</p>
                    <p className="text-sm font-medium capitalize">{currentTrend}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <Tabs defaultValue="trends" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trends">Volume Trends</TabsTrigger>
                <TabsTrigger value="details">Company Details</TabsTrigger>
                <TabsTrigger value="commodities">Top Commodities</TabsTrigger>
                <TabsTrigger value="alerts">Alerts & Watch</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Shipment Volume Trends</CardTitle>
                      <div className="flex gap-2">
                        {(['monthly', 'quarterly', '6months', 'annual'] as TrendPeriod[]).map((period) => (
                          <Button
                            key={period}
                            variant={trendPeriod === period ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTrendPeriod(period)}
                          >
                            {period === '6months' ? '6 Months' : period.charAt(0).toUpperCase() + period.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="shipments" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
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

              <TabsContent value="commodities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Commodities by Shipment Count</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={commodityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Alert Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Shipment Volume Changes</p>
                          <p className="text-sm text-muted-foreground">Get notified when shipment volume increases or decreases by 25%</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">New Destination Countries</p>
                          <p className="text-sm text-muted-foreground">Alert when company starts shipping to new countries</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Seasonal Pattern Changes</p>
                          <p className="text-sm text-muted-foreground">Detect unusual spikes or drops in seasonal shipping patterns</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">New Commodity Types</p>
                          <p className="text-sm text-muted-foreground">Get notified when company starts shipping new types of goods</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}