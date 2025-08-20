import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MarketBenchmark() {
  const [selectedRoute, setSelectedRoute] = React.useState('');
  
  const benchmarkData = [
    { route: 'China - USA', average: '$2,450', trend: 'up', change: '+12%' },
    { route: 'Europe - USA', average: '$1,890', trend: 'down', change: '-5%' },
    { route: 'Asia - Europe', average: '$3,200', trend: 'up', change: '+8%' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Market Benchmark
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Select Route</label>
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger>
                <SelectValue placeholder="Choose trade route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="china-usa">China → USA</SelectItem>
                <SelectItem value="europe-usa">Europe → USA</SelectItem>
                <SelectItem value="asia-europe">Asia → Europe</SelectItem>
                <SelectItem value="usa-latam">USA → Latin America</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-primary text-primary-foreground hover:opacity-90">
            Generate Benchmark Report
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {benchmarkData.map((item, index) => (
          <Card key={index} className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{item.route}</h3>
                {item.trend === 'up' ? (
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold">{item.average}</span>
                </div>
                <p className={`text-sm ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change} vs last month
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Key Trends</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Ocean freight rates showing seasonal uptick in Q4</li>
                <li>• Air cargo capacity constraints driving premium pricing</li>
                <li>• Port congestion affecting delivery timelines globally</li>
                <li>• Fuel surcharges increasing due to oil price volatility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}