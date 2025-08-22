import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  FileText, 
  Mail, 
  Linkedin, 
  Calendar,
  MapPin,
  DollarSign,
  Ship,
  Plane,
  Package
} from 'lucide-react';
import { TradeLaneAnalysisDrawerEnhanced } from '../TradeLaneAnalysisDrawerEnhanced';

interface Contact {
  id: string;
  name: string;
  title: string;
  email?: string;
  linkedin_url?: string;
  confidence_score?: number;
}

interface CRMCompany {
  id: string;
  company_name: string;
  country?: string;
  industry?: string;
  website?: string;
  total_shipments?: number;
  trade_value_12m?: number;
  last_shipment_date?: string;
  top_lanes?: Array<{ origin: string; destination: string; count: number }>;
  modes?: Array<{ mode: string; percentage: number }>;
  contacts?: Contact[];
  notes?: string;
  tags?: string[];
  status: 'lead' | 'prospect' | 'customer' | 'lost';
}

interface EnhancedCRMCardProps {
  company: CRMCompany;
  onUpdateNotes: (companyId: string, notes: string) => void;
  onAddToSequence?: (contactId: string) => void;
  onSendEmail?: (contactId: string) => void;
  className?: string;
}

export function EnhancedCRMCard({ 
  company, 
  onUpdateNotes, 
  onAddToSequence, 
  onSendEmail,
  className 
}: EnhancedCRMCardProps) {
  const [showAnalysisDrawer, setShowAnalysisDrawer] = useState(false);
  const [notes, setNotes] = useState(company.notes || '');

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'customer': return 'default';
      case 'prospect': return 'secondary';
      case 'lead': return 'outline';
      case 'lost': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <>
      <Card className={`hover:shadow-lg transition-all duration-200 ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">{company.company_name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {company.country && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {company.country}
                    </span>
                  )}
                  <Badge variant={getStatusBadgeVariant(company.status)} className="text-xs">
                    {company.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnalysisDrawer(true)}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Analyze
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Shipments
                    </span>
                  </div>
                  <span className="font-bold text-lg text-foreground">
                    {company.total_shipments?.toLocaleString() || '—'}
                  </span>
                </div>

                <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Trade Value
                    </span>
                  </div>
                  <span className="font-bold text-lg text-foreground">
                    {formatCurrency(company.trade_value_12m)}
                  </span>
                </div>

                <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Last Activity
                    </span>
                  </div>
                  <span className="font-bold text-sm text-foreground">
                    {formatDate(company.last_shipment_date)}
                  </span>
                </div>

                <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Contacts
                    </span>
                  </div>
                  <span className="font-bold text-lg text-foreground">
                    {company.contacts?.length || 0}
                  </span>
                </div>
              </div>

              {/* Transport Modes */}
              {company.modes && company.modes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Transport Modes</h4>
                  <div className="flex gap-2 flex-wrap">
                    {company.modes.map((mode, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {mode.mode === 'air' ? <Plane className="h-3 w-3" /> : <Ship className="h-3 w-3" />}
                        {mode.percentage}% {mode.mode.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Trade Lanes */}
              {company.top_lanes && company.top_lanes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Top Trade Lanes</h4>
                  <div className="space-y-1">
                    {company.top_lanes.slice(0, 3).map((lane, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded border border-border/20">
                        <span className="text-sm font-medium text-foreground">
                          {lane.origin} → {lane.destination}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {lane.count} shipments
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="mt-4">
              <div className="flex items-center justify-center p-8 border border-border/30 rounded-lg bg-muted/20">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    View detailed trade analysis and trends
                  </p>
                  <Button onClick={() => setShowAnalysisDrawer(true)}>
                    Open Analysis Dashboard
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-3 mt-4">
              {company.contacts && company.contacts.length > 0 ? (
                <div className="space-y-2">
                  {company.contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border border-border/30 rounded-lg bg-muted/10">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.title}</div>
                        {contact.email && (
                          <div className="text-xs text-muted-foreground mt-1">{contact.email}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {onAddToSequence && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onAddToSequence(contact.id)}
                          >
                            Add to Sequence
                          </Button>
                        )}
                        {onSendEmail && contact.email && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => onSendEmail(contact.id)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        {contact.linkedin_url && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 border border-border/30 rounded-lg bg-muted/20">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      No contacts available for this company
                    </p>
                    <Button variant="outline">
                      Enrich with Apollo
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <div className="space-y-3">
                <textarea
                  className="w-full h-32 p-3 border border-border/30 rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  placeholder="Add notes about this company..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={() => onUpdateNotes(company.id, notes)}
                    disabled={notes === company.notes}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Save Notes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Analysis Drawer */}
      {showAnalysisDrawer && (
        <TradeLaneAnalysisDrawerEnhanced
          isOpen={showAnalysisDrawer}
          onClose={() => setShowAnalysisDrawer(false)}
          company={{
            company_name: company.company_name,
            company_id: company.id,
            shipments_count: company.total_shipments || 0,
            last_shipment_date: company.last_shipment_date || null,
            modes: (company.modes || []).map(m => m.mode)
          } as any}
        />
      )}
    </>
  );
}