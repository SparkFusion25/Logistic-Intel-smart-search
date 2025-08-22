import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Eye, Plus, X } from 'lucide-react';
import { usd } from '@/lib/format';

type NewShipperData = {
  companyName: string;
  shipments30d: number;
  lastDate: string;
  originPort: string;
  destinationPort: string;
  mode: 'air' | 'ocean';
  tradeValue?: number;
};

interface NewShipperToastProps {
  data: NewShipperData;
  onViewCompany: (companyName: string) => void;
  onAddToCRM: (companyName: string) => void;
  onDismiss: () => void;
}

export function NewShipperToast({ data, onViewCompany, onAddToCRM, onDismiss }: NewShipperToastProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-lg max-w-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm">
              <Building2 className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm leading-tight">{data.companyName}</div>
            <Badge className="bg-green-500 text-white text-xs mt-1">
              New Shipper
            </Badge>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDismiss}
          className="h-6 w-6 p-0 hover:bg-muted"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div>
          <div className="text-muted-foreground text-xs">Shipments (30d)</div>
          <div className="font-semibold">{data.shipments30d}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Last Shipment</div>
          <div className="font-semibold">{data.lastDate}</div>
        </div>
      </div>

      {/* Trade Lane */}
      <div className="mb-3">
        <div className="text-muted-foreground text-xs mb-1">Top Trade Lane</div>
        <div className="font-medium text-primary text-sm">
          {data.originPort} → {data.destinationPort}
        </div>
        <Badge 
          variant={data.mode === 'ocean' ? 'default' : 'secondary'}
          className={`text-xs mt-1 ${
            data.mode === 'ocean' 
              ? 'bg-blue-500 text-white' 
              : 'bg-orange-500 text-white'
          }`}
        >
          {data.mode === 'ocean' ? '🚢 Ocean' : '✈️ Air'}
        </Badge>
      </div>

      {/* Trade Value */}
      {data.tradeValue && (
        <div className="mb-4">
          <div className="text-muted-foreground text-xs">Trade Value (30d)</div>
          <div className="font-semibold text-green-600">{usd(data.tradeValue)}</div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          onClick={() => onViewCompany(data.companyName)}
          className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-xs"
        >
          <Eye className="h-3 w-3 mr-1" />
          View Company
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddToCRM(data.companyName)}
          className="flex-1 border-primary/30 hover:bg-primary/5 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add to CRM
        </Button>
      </div>

      {/* Footer tip */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          💡 Create automation for email/LinkedIn outreach
        </p>
      </div>
    </div>
  );
}

export function showNewShipperToast(data: NewShipperData, callbacks: Omit<NewShipperToastProps, 'data'>) {
  return toast.custom(
    (t) => (
      <NewShipperToast 
        data={data} 
        {...callbacks}
        onDismiss={() => toast.dismiss(t)}
      />
    ),
    {
      duration: 10000, // 10 seconds
      position: 'top-right',
    }
  );
}