import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertTriangle, Bell, Zap, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VolumeAlert {
  id: string;
  company_name: string;
  alert_type: 'new_shipper' | 'volume_increase' | 'volume_decrease' | 'new_route';
  period: string;
  current_volume: number;
  previous_volume: number;
  change_percentage: number;
  confidence: number;
  insights: string;
  first_detected: string;
}

export function VolumeAlerts() {
  const [alerts, setAlerts] = useState<VolumeAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('1month');
  const [alertType, setAlertType] = useState('all');
  const { toast } = useToast();

  const generateAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('volume-alerts', {
        body: { 
          period,
          alert_type: alertType === 'all' ? undefined : alertType
        }
      });

      if (error) throw error;
      setAlerts(data.alerts || []);
      toast({
        title: "Volume Analysis Complete",
        description: `Found ${data.alerts?.length || 0} alerts for ${period}`
      });
    } catch (error) {
      console.error('Volume alerts error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to generate volume alerts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateAlerts();
  }, [period, alertType]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'new_shipper': return <Zap className="w-4 h-4" />;
      case 'volume_increase': return <TrendingUp className="w-4 h-4" />;
      case 'volume_decrease': return <TrendingDown className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'new_shipper': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'volume_increase': return 'bg-green-100 text-green-800 border-green-200';
      case 'volume_decrease': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatChange = (change: number) => {
    const isPositive = change > 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        {Math.abs(change).toFixed(1)}%
      </div>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Smart Volume Alerts
          </div>
          <Button 
            onClick={generateAlerts}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? 'Analyzing...' : 'Refresh'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Time Period</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3month">Last 3 Months</SelectItem>
                <SelectItem value="6month">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Alert Type</label>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="new_shipper">New Shippers</SelectItem>
                <SelectItem value="volume_increase">Volume Increases</SelectItem>
                <SelectItem value="volume_decrease">Volume Decreases</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.length === 0 && !loading && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No volume alerts found for the selected period and filters.
              </AlertDescription>
            </Alert>
          )}

          {alerts.map((alert) => (
            <Card key={alert.id} className="bg-muted/30 hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getAlertColor(alert.alert_type)}>
                        {getAlertIcon(alert.alert_type)}
                        <span className="ml-1 capitalize">
                          {alert.alert_type.replace('_', ' ')}
                        </span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.confidence}% confidence
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-1">{alert.company_name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{alert.insights}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Volume: ${alert.current_volume.toLocaleString()}</span>
                      <span>Period: {alert.period}</span>
                      <span>First detected: {new Date(alert.first_detected).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {formatChange(alert.change_percentage)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}