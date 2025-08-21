import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Users, Ship, Calendar, Globe, TrendingUp, Eye, Plus, MapPin, Award, Clock } from 'lucide-react';
import { TrendCard } from './TrendCard';
import { TradeLaneAnalysisDrawer } from '@/components/TradeLaneAnalysisDrawer';
import { toast } from 'sonner';
import { useCompanyData } from '@/hooks/useCompanyData';
import { usePlan } from '@/components/Providers';
import { PlanGate } from '@/components/PlanGate';

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
  // Enhanced fields from company_trade_profiles
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

export function CompanyCard({ company, onAddToCRM, onViewDetails }: CompanyCardProps) {
  const plan = usePlan();
  const { company: companyProfile } = useCompanyData(company.company_name);
  
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

  const formatValue = (value: number | undefined) => {
    if (!value || value === 0) return 'N/A';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  const getFitScore = () => {
    const recencyScore = company.last_shipment_date ? 
      Math.max(0, 100 - Math.floor((new Date().getTime() - new Date(company.last_shipment_date).getTime()) / (1000 * 60 * 60 * 24))) : 0;
    const volumeScore = Math.min(100, (company.shipments_count || 0) * 5);
    return Math.floor((recencyScore + volumeScore) / 2);
  };

  const getPriorityTag = () => {
    const score = getFitScore();
    if (score >= 70) return { label: 'Hot', color: 'bg-red-500 text-white' };
    if (score >= 40) return { label: 'Warm', color: 'bg-orange-500 text-white' };
    return { label: 'Cold', color: 'bg-blue-500 text-white' };
  };

  const fitScore = getFitScore();
  const priorityTag = getPriorityTag();

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-card via-card to-card/95">
      <CardContent className="p-5">
        {/* Header Section with Company Info and Fit Score */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-md">
              <AvatarImage 
                src={company.website ? `https://logo.clearbit.com/${new URL(company.website).hostname}` : undefined} 
                alt={`${company.company_name} logo`}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm">
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg leading-tight text-foreground">
                  {company.company_name}
                </h3>
                {company.website && (
                  <Globe className="h-4 w-4 text-primary/70" />
                )}
              </div>
              {company.country && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {company.country}
                </div>
              )}
              {company.industry && (
                <Badge variant="outline" className="text-xs mt-1 bg-muted/50">
                  {company.industry}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Fit Score and Priority */}
          <div className="text-right space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={`${priorityTag.color} text-xs font-medium px-2 py-1`}>
                {priorityTag.label}
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
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCRM?.(company);
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
          >
            <Plus className="h-3 w-3" />
            Add to CRM
          </Button>
          {onViewDetails && (
            <TradeLaneAnalysisDrawer 
              company={company}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 border-primary/30 hover:bg-primary/5"
                >
                  <Eye className="h-3 w-3" />
                  Analyze
                </Button>
              }
            />
          )}
        </div>

        {/* Logistics Snapshot */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Ship className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">
                {company.total_ocean_shipments || company.shipments_count} Ocean
              </span>
            </div>
            {company.total_air_shipments && (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">
                  {company.total_air_shipments} Air
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Trade Value:</span>
              <div className="font-bold text-green-600">
                {formatValue(company.total_trade_value_usd)}
              </div>
            </div>
            {company.avg_shipment_value_usd && (
              <div className="text-sm">
                <span className="text-muted-foreground">Avg/Shipment:</span>
                <div className="font-medium">
                  {formatValue(company.avg_shipment_value_usd)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trade Lanes */}
        {company.top_destination_countries && company.top_destination_countries.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Top Trade Lanes</div>
            <div className="flex flex-wrap gap-1">
              {company.top_destination_countries.slice(0, 3).map((country, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  → {country}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Transport Modes & Commodities */}
        <div className="space-y-3">
          {company.modes && company.modes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {company.modes.map((mode, index) => (
                <Badge 
                  key={index} 
                  variant={mode.toLowerCase() === 'ocean' ? 'default' : 'secondary'} 
                  className={`text-xs ${
                    mode.toLowerCase() === 'ocean' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                      : mode.toLowerCase() === 'air'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                      : 'bg-muted'
                  }`}
                >
                  {mode}
                </Badge>
              ))}
            </div>
          )}
          
          {company.top_commodities && company.top_commodities.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Top Commodities</div>
              <div className="flex flex-wrap gap-1">
                {company.top_commodities.slice(0, 2).map((commodity, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {commodity.length > 20 ? commodity.substring(0, 20) + '...' : commodity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Section with Plan Gating */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <PlanGate
            plan={plan as any}
            allow={["pro","enterprise"]}
            fallback={
              <div className="rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-primary">
                  <Award className="h-4 w-4" />
                  🔒 Premium Contact Data
                </div>
                <div className="text-muted-foreground mt-1">
                  Upgrade to Pro to access {company.contacts_count} contacts with emails & LinkedIn profiles.
                </div>
                <Button size="sm" variant="outline" className="mt-2 border-primary/30 text-primary hover:bg-primary/5">
                  Upgrade Now
                </Button>
              </div>
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {company.contacts_count} contacts available
                </span>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs">
                ✅ Premium Access
              </Badge>
            </div>
          </PlanGate>
        </div>
      </CardContent>
    </Card>
  );
}