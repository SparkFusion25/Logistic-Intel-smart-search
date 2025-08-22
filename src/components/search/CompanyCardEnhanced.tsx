import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Building2, Users, Ship, Calendar, Globe, TrendingUp, Eye, Plus, 
  MapPin, Award, Clock, ChevronDown, ChevronUp, Filter, BarChart3,
  Plane, Anchor, Package, DollarSign
} from 'lucide-react';
import { TradeLaneAnalysisDrawer } from '@/components/TradeLaneAnalysisDrawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { usd } from '@/lib/format';

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
  total_ocean_shipments?: number;
  total_air_shipments?: number;
  total_trade_value_usd?: number;
  avg_shipment_value_usd?: number;
  top_origin_countries?: string[];
  top_destination_countries?: string[];
};

type CompanyCardProps = {
  company: SearchCompanyView;
  onAddToCRM?: (company: SearchCompanyView) => void;
  onViewDetails?: () => void;
};

type MockShipment = {
  date: string;
  hsCode: string;
  product: string;
  mode: 'Air' | 'Ocean';
  originPort: string;
  destPort: string;
  carrier: string;
  value: number;
  weight: number;
};

export function CompanyCardEnhanced({ company, onAddToCRM, onViewDetails }: CompanyCardProps) {
  const [showShipments, setShowShipments] = useState(false);
  const [shipmentsFilter, setShipmentsFilter] = useState('Last 30d');
  const isMobile = useIsMobile();
  
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const getFitScore = () => {
    const recencyScore = company.last_shipment_date ? 
      Math.max(0, 100 - Math.floor((new Date().getTime() - new Date(company.last_shipment_date).getTime()) / (1000 * 60 * 60 * 24))) : 0;
    const volumeScore = Math.min(100, (company.shipments_count || 0) * 5);
    return Math.floor((recencyScore + volumeScore) / 2);
  };

  const getHeatBadge = () => {
    const score = getFitScore();
    if (score >= 70) return { label: 'Hot', color: 'bg-red-500 text-white' };
    if (score >= 40) return { label: 'Warm', color: 'bg-orange-500 text-white' };
    return { label: 'Cold', color: 'bg-blue-500 text-white' };
  };

  const getTopModes = () => {
    const ocean = company.total_ocean_shipments || 0;
    const air = company.total_air_shipments || 0;
    const total = ocean + air;
    
    if (total === 0) return null;
    
    const oceanPct = Math.round((ocean / total) * 100);
    const airPct = Math.round((air / total) * 100);
    
    return { ocean: oceanPct, air: airPct };
  };

  // Mock shipment data for demonstration
  const mockShipments: MockShipment[] = [
    {
      date: '2024-01-15',
      hsCode: '8517.12',
      product: 'Mobile phones',
      mode: 'Air',
      originPort: 'Shenzhen',
      destPort: 'Los Angeles',
      carrier: 'FedEx',
      value: 125000,
      weight: 850
    },
    {
      date: '2024-01-10', 
      hsCode: '8471.30',
      product: 'Computer parts',
      mode: 'Ocean',
      originPort: 'Shanghai',
      destPort: 'Long Beach',
      carrier: 'COSCO',
      value: 89000,
      weight: 2400
    },
    {
      date: '2024-01-05',
      hsCode: '6204.62',
      product: 'Cotton trousers',
      mode: 'Ocean',
      originPort: 'Ningbo',
      destPort: 'New York',
      carrier: 'MSC',
      value: 45000,
      weight: 1200
    }
  ];

  const fitScore = getFitScore();
  const heatBadge = getHeatBadge();
  const topModes = getTopModes();

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-card via-card to-card/95">
      <CardContent className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-md flex-shrink-0">
              <AvatarImage 
                src={company.website ? `https://logo.clearbit.com/${new URL(company.website).hostname}` : undefined} 
                alt={`${company.company_name} logo`}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                <Building2 className="h-7 w-7" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-2">
                <h3 className="font-bold text-lg leading-tight text-foreground truncate flex-1">
                  {company.company_name}
                </h3>
                {company.website && (
                  <Globe className="h-4 w-4 text-primary/70 flex-shrink-0 mt-1" />
                )}
              </div>
              
              {company.country && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  {company.country}
                </div>
              )}
              
              {company.industry && (
                <Badge variant="outline" className="text-xs bg-muted/50">
                  {company.industry}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Fit Score and Heat Badge */}
          <div className="text-right space-y-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Badge className={`${heatBadge.color} text-xs font-medium px-2 py-1`}>
                {heatBadge.label}
              </Badge>
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg px-3 py-1 border border-primary/20">
                <div className="text-xs text-muted-foreground">Fit Score</div>
                <div className="text-lg font-bold text-primary">{fitScore}</div>
              </div>
            </div>
            {company.last_shipment_date && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDate(company.last_shipment_date)}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCRM?.(company);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add to CRM
          </Button>
          
          <TradeLaneAnalysisDrawer 
            company={company}
            trigger={
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 border-primary/30 hover:bg-primary/5"
              >
                <BarChart3 className="h-4 w-4" />
                Analyze
              </Button>
            }
          />
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Total Shipments
              </span>
              <button 
                onClick={() => setShowShipments(!showShipments)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {showShipments ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            <span className="font-bold text-lg text-foreground">
              {company.shipments_count || 0}
            </span>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
              Trade Value
            </span>
            <span className="font-bold text-lg text-green-600">
              {usd(company.total_trade_value_usd || 0)}
            </span>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
              Top Modes
            </span>
            {topModes ? (
              <div className="text-sm font-medium">
                {topModes.ocean > 0 && `${topModes.ocean}% Ocean`}
                {topModes.ocean > 0 && topModes.air > 0 && ' / '}
                {topModes.air > 0 && `${topModes.air}% Air`}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            )}
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
              Last Activity
            </span>
            <span className="font-medium text-sm text-foreground">
              {formatDate(company.last_shipment_date)}
            </span>
          </div>
        </div>

        {/* Top Trade Lanes */}
        {company.top_destination_countries && company.top_destination_countries.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Top Trade Lanes</div>
            <div className="flex flex-wrap gap-2">
              {company.top_destination_countries.slice(0, 3).map((country, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                  onClick={() => setShowShipments(true)}
                >
                  → {country}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Past Shipments Disclosure */}
        {showShipments && (
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-base">Past Shipments</h4>
              <div className="flex items-center gap-2">
                <select 
                  value={shipmentsFilter}
                  onChange={(e) => setShipmentsFilter(e.target.value)}
                  className="text-sm border border-border rounded-lg px-2 py-1 bg-background"
                >
                  <option>Last 30d</option>
                  <option>QTD</option>
                  <option>6 mo</option>
                  <option>12 mo</option>
                  <option>Custom</option>
                </select>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {mockShipments.map((shipment, index) => (
                <div key={index} className="bg-muted/20 rounded-lg p-3 border border-border/30">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">{shipment.date}</span>
                      <div className="text-xs text-muted-foreground">{shipment.hsCode}</div>
                    </div>
                    <div>
                      <span className="font-medium truncate block">{shipment.product}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {shipment.mode === 'Air' ? <Plane className="h-3 w-3" /> : <Anchor className="h-3 w-3" />}
                        {shipment.mode}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{usd(shipment.value)}</div>
                      <div className="text-xs text-muted-foreground">{shipment.weight}kg</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {shipment.originPort} → {shipment.destPort} • {shipment.carrier}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <TradeLaneAnalysisDrawer 
                company={company}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                  >
                    View full shipment history →
                  </Button>
                }
              />
            </div>
          </div>
        )}

        {/* Mini Contact Strip (Plan-gated) */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-4">
            <div className="flex items-center gap-2 font-medium text-primary mb-2">
              <Award className="h-4 w-4" />
              🔒 Premium Contact Data
            </div>
            <div className="text-muted-foreground text-sm mb-3">
              Upgrade to Pro to access {company.contacts_count || 2} contacts with emails & LinkedIn profiles.
            </div>
            <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
              Upgrade Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}