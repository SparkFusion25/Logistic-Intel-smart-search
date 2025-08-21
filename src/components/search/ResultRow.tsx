import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Ship, Calendar, MapPin, Package, Loader2 } from 'lucide-react';

interface ResultRowProps {
  row: any;
  query: string;
  onAddToCrm: (row: any) => void;
  onViewCompany: (row: any) => void;
  loading?: boolean;
}

export function ResultRow({ row, query, onAddToCrm, onViewCompany, loading = false }: ResultRowProps) {
  const companyInitial = row.unified_company_name?.charAt(0).toUpperCase() || '?';
  
  return (
    <Card className="bg-card/50 backdrop-blur border border-border/50 hover:border-primary/20 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4 space-y-3">
        {/* Company header */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate text-foreground">
              {row.unified_company_name || 'Unknown Company'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {row.mode && (
                <Badge variant="secondary" className="text-xs">
                  {row.mode.toUpperCase()}
                </Badge>
              )}
              {row.hs_code && (
                <Badge variant="outline" className="text-xs">
                  HS: {row.hs_code}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Shipment details */}
        <div className="space-y-2">
          {/* Route */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">
              {row.origin_country || 'Unknown'} → {row.destination_country || 'Unknown'}
              {row.destination_city && ` (${row.destination_city})`}
            </span>
          </div>

          {/* Date */}
          {row.unified_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                {new Date(row.unified_date).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Description */}
          {row.description && (
            <div className="flex items-start gap-2 text-sm">
              <Package className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground line-clamp-2">
                {row.description}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button 
            onClick={() => onAddToCrm(row)}
            variant="outline"
            size="sm"
            disabled={loading}
            className="flex-1 text-xs sm:text-sm"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
            ) : (
              '+ Add to CRM'
            )}
          </Button>
          <Button 
            onClick={() => onViewCompany(row)}
            variant="secondary"
            size="sm"
            className="flex-1 text-xs sm:text-sm"
          >
            <Ship className="h-3.5 w-3.5 mr-2" />
            View Trade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}