import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Users, Ship, Calendar, Globe, TrendingUp, Eye, Plus } from 'lucide-react';
import { TrendCard } from './TrendCard';
import { toast } from 'sonner';
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
  onAddToCRM?: (company: SearchCompanyView) => void;
  onViewDetails?: () => void;
};

export function CompanyCard({ company, onAddToCRM, onViewDetails }: CompanyCardProps) {
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
    <Card className="hover:shadow-md transition-shadow border-2 hover:border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage 
                src={company.website ? `https://logo.clearbit.com/${new URL(company.website).hostname}` : undefined} 
                alt={`${company.company_name} logo`}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                <Building2 className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {company.company_name}
              </h3>
              {company.country && (
                <p className="text-sm text-muted-foreground">{company.country}</p>
              )}
            </div>
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

        <div className="flex items-center gap-2 mb-3">
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCRM?.(company);
            }}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add to CRM
          </Button>
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

        {/* Mini Trend Cards - Mobile Optimized */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground mb-1">Volume</div>
            <div className="text-sm font-bold">{mockTrends.volume}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground mb-1">Growth</div>
            <div className="text-sm font-bold text-green-600">+{Math.abs(mockTrends.growth)}%</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground mb-1">Pattern</div>
            <div className="text-sm font-bold">{mockTrends.frequency}</div>
          </div>
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