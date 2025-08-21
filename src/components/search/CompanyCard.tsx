import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Ship, Calendar, Globe, TrendingUp, Eye } from 'lucide-react';
import { TrendCard } from './TrendCard';
type SearchCompanyView = {
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

type CompanyCardProps = {
  company: SearchCompanyView;
  onClick?: () => void;
  onViewDetails?: () => void;
};

export function CompanyCard({ company, onClick, onViewDetails }: CompanyCardProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  // Generate mock trend data for demo
  const mockTrends = {
    volume: Math.floor(Math.random() * 40) + 10,
    growth: Math.floor(Math.random() * 60) - 30,
    frequency: ['Weekly', 'Monthly', 'Seasonal'][Math.floor(Math.random() * 3)]
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-lg leading-tight">
              {company.company_name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {company.website && (
              <Globe className="h-4 w-4 text-muted-foreground" />
            )}
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                Details
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm">
              {company.contacts_count} contact{company.contacts_count !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Ship className="h-4 w-4 text-green-500" />
            <span className="text-sm">
              {company.shipments_count} shipment{company.shipments_count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Mini Trend Cards */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <TrendCard
            title="Volume"
            value={mockTrends.volume}
            trend={mockTrends.growth > 0 ? 'up' : mockTrends.growth < 0 ? 'down' : 'stable'}
            percentage={Math.abs(mockTrends.growth)}
            compact
          />
          <TrendCard
            title="Growth"
            value={`${mockTrends.growth > 0 ? '+' : ''}${mockTrends.growth}%`}
            trend={mockTrends.growth > 10 ? 'up' : mockTrends.growth < -10 ? 'down' : 'stable'}
            compact
          />
          <TrendCard
            title="Pattern"
            value={mockTrends.frequency}
            trend="stable"
            compact
          />
        </div>

        {company.last_shipment_date && (
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Last shipment: {formatDate(company.last_shipment_date)}
            </span>
          </div>
        )}

        <div className="space-y-2">
          {company.modes && company.modes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {company.modes.map((mode, index) => (
                <Badge 
                  key={index} 
                  variant={mode.toLowerCase() === 'ocean' ? 'default' : 'secondary'} 
                  className={`text-xs ${
                    mode.toLowerCase() === 'ocean' 
                      ? 'bg-blue-500 text-white' 
                      : mode.toLowerCase() === 'air'
                      ? 'bg-orange-500 text-white'
                      : ''
                  }`}
                >
                  {mode}
                </Badge>
              ))}
            </div>
          )}
          
          {company.dest_countries && company.dest_countries.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {company.dest_countries.slice(0, 3).map((country, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {country}
                </Badge>
              ))}
              {company.dest_countries.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{company.dest_countries.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {company.industry && (
          <div className="mt-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              {company.industry}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}