import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Download, Save, Ship, Plane, Package, Calendar, MapPin } from 'lucide-react';
import { usd } from '@/lib/format';

type SearchCompanyView = {
  company_name: string;
  company_id: string | null;
  shipments_count: number;
  last_shipment_date: string | null;
  total_trade_value_usd?: number;
  top_destination_countries?: string[];
  modes?: string[];
};

type TradeLaneAnalysisProps = {
  company: SearchCompanyView;
  trigger?: React.ReactNode;
};

// Mock data for demonstration
const mockTrendData = [
  { month: 'Jan', shipments: 45, value: 2400000 },
  { month: 'Feb', shipments: 52, value: 2800000 },
  { month: 'Mar', shipments: 48, value: 2600000 },
  { month: 'Apr', shipments: 61, value: 3100000 },
  { month: 'May', shipments: 55, value: 2900000 },
  { month: 'Jun', shipments: 67, value: 3400000 },
  { month: 'Jul', shipments: 59, value: 3200000 },
  { month: 'Aug', shipments: 72, value: 3800000 },
  { month: 'Sep', shipments: 68, value: 3600000 },
  { month: 'Oct', shipments: 74, value: 3900000 },
  { month: 'Nov', shipments: 71, value: 3700000 },
  { month: 'Dec', shipments: 78, value: 4100000 }
];

const mockTradeLanes = [
  { lane: 'Shanghai → Los Angeles', shipments: 245, value: 12400000, change: 15.2 },
  { lane: 'Shenzhen → Long Beach', shipments: 189, value: 9800000, change: -8.1 },
  { lane: 'Ningbo → New York', shipments: 156, value: 7600000, change: 22.4 },
  { lane: 'Qingdao → Seattle', shipments: 134, value: 6200000, change: 5.7 },
  { lane: 'Tianjin → Oakland', shipments: 98, value: 4100000, change: -3.2 }
];

const mockTransportModes = [
  { mode: 'Ocean', count: 756, value: 32500000, percentage: 78 },
  { mode: 'Air', count: 213, value: 8900000, percentage: 22 }
];

const mockCommodities = [
  { category: 'Electronics', hs2: '85', products: ['Mobile phones', 'Computer parts'], shipments: 298, value: 15600000 },
  { category: 'Textiles', hs2: '62', products: ['Cotton clothing', 'Synthetic garments'], shipments: 245, value: 8900000 },
  { category: 'Machinery', hs2: '84', products: ['Industrial equipment', 'Motors'], shipments: 156, value: 12300000 },
  { category: 'Plastics', hs2: '39', products: ['Plastic products', 'Polymer materials'], shipments: 87, value: 4200000 }
];

const mockSeasonality = [
  { month: 'Jan', value: 85 },
  { month: 'Feb', value: 75 },
  { month: 'Mar', value: 92 },
  { month: 'Apr', value: 78 },
  { month: 'May', value: 95 },
  { month: 'Jun', value: 88 },
  { month: 'Jul', value: 82 },
  { month: 'Aug', value: 98 },
  { month: 'Sep', value: 90 },
  { month: 'Oct', value: 94 },
  { month: 'Nov', value: 87 },
  { month: 'Dec', value: 76 }
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function TradeLaneAnalysisDrawerEnhanced({ company, trigger }: TradeLaneAnalysisProps) {
  const [activeTab, setActiveTab] = useState('trend');
  const [savedViews, setSavedViews] = useState<string[]>([]);

  const handleSaveView = () => {
    const viewName = `${company.company_name} - ${activeTab} - ${new Date().toLocaleDateString()}`;
    setSavedViews([...savedViews, viewName]);
  };

  const handleExport = (format: 'csv' | 'png' | 'pdf') => {
    // Mock export functionality
    console.log(`Exporting ${activeTab} data as ${format} for ${company.company_name}`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analyze Trade
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-4xl">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl font-bold">{company.company_name}</SheetTitle>
          <SheetDescription>
            Trade lane analysis and shipment insights
          </SheetDescription>
          
          {/* Export and Save Actions */}
          <div className="flex items-center gap-2 pt-4">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('png')}>
                <Download className="h-4 w-4 mr-1" />
                PNG
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleSaveView}>
              <Save className="h-4 w-4 mr-1" />
              Save View
            </Button>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="trend">12-Month Trend</TabsTrigger>
            <TabsTrigger value="lanes">Trade Lanes</TabsTrigger>
            <TabsTrigger value="modes">Transport Modes</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
            <TabsTrigger value="seasonality">Seasonality</TabsTrigger>
          </TabsList>

          <TabsContent value="trend" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  12-Month Shipment & Value Trend
                </CardTitle>
                <CardDescription>
                  Monthly shipment volume and trade value over the past year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'shipments' ? value : usd(Number(value)),
                          name === 'shipments' ? 'Shipments' : 'Trade Value'
                        ]}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="shipments" stroke="hsl(var(--chart-1))" strokeWidth="3" />
                      <Line yAxisId="right" type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" strokeWidth="3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lanes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Top Trade Lanes
                </CardTitle>
                <CardDescription>
                  Most active shipping routes ranked by volume and value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTradeLanes.map((lane, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium">{lane.lane}</div>
                        <div className="text-sm text-muted-foreground">
                          {lane.shipments} shipments • {usd(lane.value)}
                        </div>
                      </div>
                      <Badge 
                        variant={lane.change > 0 ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {lane.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(lane.change)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="h-5 w-5" />
                    Transport Mode Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockTransportModes}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ mode, percentage }) => `${mode} ${percentage}%`}
                        >
                          {mockTransportModes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, 'Shipments']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mode Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransportModes.map((mode, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {mode.mode === 'Ocean' ? <Ship className="h-4 w-4" /> : <Plane className="h-4 w-4" />}
                            <span className="font-medium">{mode.mode}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{mode.percentage}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">{mode.count}</span> shipments
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            {usd(mode.value)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="commodities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Commodity Categories (HS2/HS4)
                </CardTitle>
                <CardDescription>
                  Top product categories by shipment volume and trade value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockCommodities.map((commodity, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{commodity.category}</h4>
                          <p className="text-sm text-muted-foreground">HS {commodity.hs2}</p>
                        </div>
                        <Badge variant="outline">{commodity.shipments} shipments</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Trade Value</p>
                          <p className="font-semibold text-green-600">{usd(commodity.value)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Top Products</p>
                          <div className="flex flex-wrap gap-1">
                            {commodity.products.map((product, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seasonality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Seasonal Shipping Patterns
                </CardTitle>
                <CardDescription>
                  Monthly shipment patterns showing seasonal trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockSeasonality}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">Q1</div>
                    <div className="text-sm text-muted-foreground">Peak Season</div>
                    <div className="text-xs">Jan-Mar: +15% above avg</div>
                  </div>
                  <div className="text-center p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">Q2-Q3</div>
                    <div className="text-sm text-muted-foreground">Steady Period</div>
                    <div className="text-xs">Apr-Sep: Normal activity</div>
                  </div>
                  <div className="text-center p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">Q4</div>
                    <div className="text-sm text-muted-foreground">Holiday Build-up</div>
                    <div className="text-xs">Oct-Dec: +22% above avg</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}