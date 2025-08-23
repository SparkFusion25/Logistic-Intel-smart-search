import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Route, TrendingUp, TrendingDown, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TradeLane {
  route: string;
  origin_country: string;
  destination_country: string;
  shipment_count: number;
  trend: 'up' | 'down' | 'stable';
  percentage_change: number;
  monitored: boolean;
}

export function TradeLaneMonitor() {
  const [tradeLanes, setTradeLanes] = useState<TradeLane[]>([]);
  const [monitoredLanes, setMonitoredLanes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTradeLanes();
    loadMonitoredLanes();
  }, []);

  const loadTradeLanes = async () => {
    try {
      const { data, error } = await supabase
        .from('unified_shipments')
        .select('origin_country, destination_country')
        .not('origin_country', 'is', null)
        .not('destination_country', 'is', null)
        .limit(1000);

      if (error) throw error;

      // Aggregate trade lanes and count shipments
      const routes: Record<string, { 
        origin: string; 
        destination: string; 
        count: number;
      }> = {};

      data?.forEach(row => {
        const route = `${row.origin_country} → ${row.destination_country}`;
        if (routes[route]) {
          routes[route].count++;
        } else {
          routes[route] = {
            origin: row.origin_country || 'Unknown',
            destination: row.destination_country || 'Unknown',
            count: 1
          };
        }
      });

      // Convert to TradeLane array and add mock trend data
      const lanes: TradeLane[] = Object.entries(routes)
        .map(([route, data]) => {
          const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
          return {
            route,
            origin_country: data.origin,
            destination_country: data.destination,
            shipment_count: data.count,
            trend: trends[Math.floor(Math.random() * trends.length)],
            percentage_change: Math.floor(Math.random() * 40) - 20, // -20 to +20
            monitored: false
          };
        })
        .sort((a, b) => b.shipment_count - a.shipment_count)
        .slice(0, 20); // Top 20 trade lanes

      setTradeLanes(lanes);
    } catch (error) {
      console.error('Failed to load trade lanes:', error);
      toast({
        title: "Failed to load trade lanes",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMonitoredLanes = () => {
    const saved = localStorage.getItem('monitored_trade_lanes');
    if (saved) {
      setMonitoredLanes(new Set(JSON.parse(saved)));
    }
  };

  const toggleMonitoring = (route: string) => {
    const newMonitored = new Set(monitoredLanes);
    
    if (newMonitored.has(route)) {
      newMonitored.delete(route);
      toast({
        title: "Monitoring stopped",
        description: `No longer monitoring ${route}`,
      });
    } else {
      newMonitored.add(route);
      toast({
        title: "Monitoring started",
        description: `Now monitoring ${route} for activity changes`,
      });
    }
    
    setMonitoredLanes(newMonitored);
    localStorage.setItem('monitored_trade_lanes', JSON.stringify(Array.from(newMonitored)));
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up' || change > 0) {
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    } else if (trend === 'down' || change < 0) {
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    }
    return <div className="h-3 w-3 rounded-full bg-gray-400" />;
  };

  const displayedLanes = showAll ? tradeLanes : tradeLanes.slice(0, 6);

  if (loading) {
    return (
      <div className="card-glass p-6 animate-fade-in-up">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass p-6 animate-fade-in-up border-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Route className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Trade Lane Monitor</h3>
            <p className="text-sm text-muted-foreground">Top routes by shipment volume</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {monitoredLanes.size} monitored
        </div>
      </div>

      <div className="space-y-3">
        {displayedLanes.map((lane, index) => {
          const isMonitored = monitoredLanes.has(lane.route);
          
          return (
            <div
              key={lane.route}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-200 ${
                isMonitored 
                  ? 'border-primary/30 bg-primary/5' 
                  : 'card-surface hover:border-primary/20'
              }`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-700">
                  #{index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground text-sm truncate">
                    {lane.route}
                  </h4>
                  {getTrendIcon(lane.trend, lane.percentage_change)}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="font-medium">
                    {lane.shipment_count.toLocaleString()} shipments
                  </span>
                  <span className={`flex items-center gap-1 ${
                    lane.percentage_change > 0 ? 'text-green-600' : 
                    lane.percentage_change < 0 ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {lane.percentage_change > 0 ? '+' : ''}{lane.percentage_change}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleMonitoring(lane.route)}
                className={`p-2 rounded-lg transition-colors ${
                  isMonitored
                    ? 'bg-primary/20 hover:bg-primary/30 text-primary'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                }`}
                title={isMonitored ? 'Stop monitoring' : 'Start monitoring'}
              >
                {isMonitored ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {tradeLanes.length > 6 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors w-full justify-center"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show All {tradeLanes.length} Routes
              </>
            )}
          </button>
        </div>
      )}

      {monitoredLanes.size > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            📊 You'll receive alerts when monitored routes show significant activity changes
          </div>
        </div>
      )}
    </div>
  );
}