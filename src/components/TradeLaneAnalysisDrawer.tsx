import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  TrendingUp,
  Globe2,
  Ship,
  Plane,
  Package,
  Calendar,
  Download,
  Quote
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type TradeLaneAnalysisProps = {
  company: {
    company_name: string;
    total_shipments?: number;
    total_ocean_shipments?: number;
    total_air_shipments?: number;
    total_trade_value_usd?: number;
    top_origin_countries?: string[];
    top_destination_countries?: string[];
    top_commodities?: string[];
    last_shipment_date?: string | null;
  };
  trigger?: React.ReactNode;
};

export function TradeLaneAnalysisDrawer({ company, trigger }: TradeLaneAnalysisProps) {
  const [open, setOpen] = useState(false);

  // Mock trend data - in real implementation, this would come from the API
  const trendData = [
    { month: 'Jan', shipments: 12, value: 45000 },
    { month: 'Feb', shipments: 19, value: 67000 },
    { month: 'Mar', shipments: 8, value: 32000 },
    { month: 'Apr', shipments: 25, value: 89000 },
    { month: 'May', shipments: 22, value: 78000 },
    { month: 'Jun', shipments: 30, value: 112000 },
  ];

  const lanesData = company.top_destination_countries?.slice(0, 5).map((country, index) => ({
    lane: `${company.top_origin_countries?.[0] || 'Unknown'} → ${country}`,
    volume: Math.floor(Math.random() * 50) + 10,
    value: Math.floor(Math.random() * 100000) + 20000,
    growth: Math.floor(Math.random() * 40) - 20,
  })) || [];

  const modesData = [
    { 
      mode: 'Ocean', 
      volume: company.total_ocean_shipments || 0,
      percentage: Math.round(((company.total_ocean_shipments || 0) / (company.total_shipments || 1)) * 100)
    },
    { 
      mode: 'Air', 
      volume: company.total_air_shipments || 0,
      percentage: Math.round(((company.total_air_shipments || 0) / (company.total_shipments || 1)) * 100)
    },
  ];

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analyze Trade Lanes
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl max-h-[80vh] bg-white p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary" />
            Trade Lane Analysis: {company.company_name}
                      </DialogTitle>
          <DialogDescription>
            Comprehensive trade data and shipping patterns analysis
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-blue-500" />
                  <div className="text-sm text-muted-foreground">Total Shipments</div>
                </div>
                <div className="text-2xl font-bold">{company.total_shipments || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div className="text-sm text-muted-foreground">Trade Value</div>
                </div>
                <div className="text-2xl font-bold">{formatValue(company.total_trade_value_usd || 0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-purple-500" />
                  <div className="text-sm text-muted-foreground">Trade Lanes</div>
                </div>
                <div className="text-2xl font-bold">{company.top_destination_countries?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <div className="text-sm text-muted-foreground">Last Activity</div>
                </div>
                <div className="text-sm font-medium">
                  {company.last_shipment_date ? 
                    new Date(company.last_shipment_date).toLocaleDateString() : 
                    'N/A'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                12-Month Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'value' ? formatValue(Number(value)) : value,
                        name === 'value' ? 'Trade Value' : 'Shipments'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="shipments" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ r: 6, fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Tabs */}
          <Tabs defaultValue="lanes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="lanes">Trade Lanes</TabsTrigger>
              <TabsTrigger value="modes">Transport Modes</TabsTrigger>
              <TabsTrigger value="commodities">Commodities</TabsTrigger>
              <TabsTrigger value="seasonality">Seasonality</TabsTrigger>
            </TabsList>

            <TabsContent value="lanes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Trade Lanes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lanesData.map((lane, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <div className="font-medium">{lane.lane}</div>
                          <div className="text-sm text-muted-foreground">
                            {lane.volume} shipments • {formatValue(lane.value)}
                          </div>
                        </div>
                        <Badge 
                          variant={lane.growth > 0 ? "default" : "secondary"}
                          className={lane.growth > 0 ? "bg-green-500" : "bg-red-500"}
                        >
                          {lane.growth > 0 ? '+' : ''}{lane.growth}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transport Mode Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modesData.map((mode, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 min-w-[80px]">
                          {mode.mode === 'Ocean' ? (
                            <Ship className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Plane className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="font-medium">{mode.mode}</span>
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              mode.mode === 'Ocean' ? 'bg-blue-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${mode.percentage}%` }}
                          />
                        </div>
                        <div className="text-sm font-medium min-w-[60px]">
                          {mode.volume} ({mode.percentage}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commodities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Commodities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {company.top_commodities?.map((commodity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Package className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">{commodity}</div>
                          <div className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 30) + 5} shipments
                          </div>
                        </div>
                        <Badge variant="outline">
                          {Math.floor(Math.random() * 40) + 10}%
                        </Badge>
                      </div>
                    )) || (
                      <div className="text-center text-muted-foreground py-8">
                        No commodity data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seasonality" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Seasonal Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="shipments" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p className="font-medium">Peak Season: June</p>
                    <p>Average monthly volume: {Math.floor(trendData.reduce((acc, curr) => acc + curr.shipments, 0) / trendData.length)} shipments</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button className="flex-1">
              <Quote className="h-4 w-4 mr-2" />
              Quote this Lane
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}