import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type TrendDirection = 'up' | 'down' | 'stable';

type TrendCardProps = {
  title: string;
  value: string | number;
  trend: TrendDirection;
  percentage?: number;
  compact?: boolean;
};

export function TrendCard({ title, value, trend, percentage, compact = false }: TrendCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
        {getTrendIcon()}
        <div>
          <p className="text-xs font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
        {percentage && (
          <span className={`text-xs font-medium ${getTrendColor()}`}>
            {percentage > 0 ? '+' : ''}{percentage}%
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-sm font-semibold">{value}</p>
          </div>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            {percentage && (
              <span className={`text-xs font-medium ${getTrendColor()}`}>
                {percentage > 0 ? '+' : ''}{percentage}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}