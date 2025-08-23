import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BenchmarkData {
  route: string;
  median: number;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export default function MarketBenchmark() {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);
  const [loading, setLoading] = useState(false);

  const routes = [
    { value: 'china-usa', label: 'China → USA', origin: 'China', dest: 'United States' },
    { value: 'europe-usa', label: 'Europe → USA', origin: 'Germany', dest: 'United States' },
    { value: 'asia-europe', label: 'Asia → Europe', origin: 'China', dest: 'Germany' },
    { value: 'usa-latam', label: 'USA → Latin America', origin: 'United States', dest: 'Brazil' },
  ];

  const fetchBenchmarkData = async () => {
    setLoading(true);
    try {
      const results: BenchmarkData[] = [];
      
      for (const route of routes) {
        const { data, error } = await supabase
          .from('unified_shipments')
          .select('unified_value')
          .ilike('unified_origin_country', `%${route.origin}%`)
          .ilike('unified_destination_country', `%${route.dest}%`)
          .not('unified_value', 'is', null)
          .limit(500);

        if (error) {
          console.error('Error fetching benchmark data:', error);
          continue;
        }

        const values = (data || [])
          .map(d => Number(d.unified_value))
          .filter(v => v > 0)
          .sort((a, b) => a - b);

        if (values.length > 0) {
          const median = values[Math.floor(values.length / 2)];
          results.push({
            route: route.label,
            median,
            count: values.length,
            trend: Math.random() > 0.5 ? 'up' : 'down' // Mock trend for now
          });
        }
      }
      
      setBenchmarkData(results);
    } catch (error) {
      console.error('Error fetching benchmark data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchmarkData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1 block">Select Route</label>
        <Select value={selectedRoute} onValueChange={setSelectedRoute}>
          <SelectTrigger>
            <SelectValue placeholder="Choose trade route" />
          </SelectTrigger>
          <SelectContent>
            {routes.map(route => (
              <SelectItem key={route.value} value={route.value}>{route.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={fetchBenchmarkData} 
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:opacity-90 h-12"
      >
        {loading ? 'Loading...' : 'Refresh Benchmark Data'}
      </Button>

      {benchmarkData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benchmarkData.map((item, index) => (
            <div key={index} className="card-surface p-4 rounded-lg">
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
              <div className="text-xl font-bold text-gray-900">${item.median.toLocaleString()}</div>
              <div className="text-sm text-gray-600">
                {item.count} shipments analyzed
              </div>
            </div>
          ))}
        </div>
      ) : loading ? (
        <div className="text-center py-8 text-gray-600">Loading benchmark data...</div>
      ) : (
        <div className="text-center py-8 text-gray-600">No benchmark data available</div>
      )}

      <div className="card-glass p-6">
        <h4 className="text-lg font-semibold mb-4">Market Insights</h4>
        <div className="bg-muted/50 p-4 rounded-lg">
          <h5 className="font-medium mb-2">Key Trends</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Ocean freight rates showing seasonal uptick in Q4</li>
            <li>• Air cargo capacity constraints driving premium pricing</li>
            <li>• Port congestion affecting delivery timelines globally</li>
            <li>• Fuel surcharges increasing due to oil price volatility</li>
          </ul>
        </div>
      </div>
    </div>
  );
}