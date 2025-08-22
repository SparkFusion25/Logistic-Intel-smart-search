import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Package, MapPin, Truck, DollarSign, Weight } from 'lucide-react';
import type { UnifiedRow } from '@/types/search';

interface ShipmentCardEnhancedProps {
  shipment: UnifiedRow;
  onViewCompany: (shipment: UnifiedRow) => void;
  className?: string;
}

export function ShipmentCardEnhanced({ shipment, onViewCompany, className }: ShipmentCardEnhancedProps) {
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const formatWeight = (weight: number | null | undefined) => {
    if (!weight) return '—';
    return `${weight.toLocaleString()} kg`;
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border border-border/50 hover:border-primary/30 ${className}`}>
      <CardContent className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-md flex-shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-semibold text-foreground truncate text-lg">
                {shipment.unified_company_name || 'Unknown Company'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Shipment #{shipment.id?.toString().slice(-6) || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className="font-medium">
              {shipment.mode?.toUpperCase() || 'UNKNOWN'}
            </Badge>
          </div>
        </div>

        {/* Shipment Details Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</span>
            </div>
            <span className="font-semibold text-sm text-foreground">
              {formatDate(shipment.unified_date)}
            </span>
          </div>

          <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Route</span>
            </div>
            <span className="font-semibold text-sm text-foreground truncate">
              {shipment.origin_country && shipment.destination_country
                ? `${shipment.origin_country} → ${shipment.destination_country}`
                : '—'}
            </span>
          </div>

          <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Value</span>
            </div>
            <span className="font-semibold text-sm text-foreground">
              {formatCurrency(shipment.value_usd)}
            </span>
          </div>

          <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Weight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weight</span>
            </div>
            <span className="font-semibold text-sm text-foreground">
              {formatWeight((shipment as any).weight_kg)}
            </span>
          </div>
        </div>

        {/* HS Code & Product Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HS Code:</span>
            <Badge variant="secondary" className="font-mono text-xs">
              {shipment.hs_code || '—'}
            </Badge>
          </div>
          
          {shipment.description && (
            <div className="bg-muted/40 p-3 rounded-lg border border-border/30">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Product Description</span>
              <p className="text-sm text-foreground line-clamp-2">
                {shipment.description}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-3 border-t border-border/30">
          <Button
            onClick={() => onViewCompany(shipment)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            View Company Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}