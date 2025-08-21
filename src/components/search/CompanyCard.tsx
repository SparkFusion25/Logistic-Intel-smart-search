import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Ship, Calendar, Globe } from 'lucide-react';
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
};

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
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
          {company.website && (
            <Globe className="h-4 w-4 text-muted-foreground" />
          )}
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
                <Badge key={index} variant="secondary" className="text-xs">
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