import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlanGate } from "@/components/PlanGate";
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Linkedin, 
  MapPin, 
  Globe,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Activity
} from "lucide-react";

interface Contact {
  id: string;
  full_name: string | null;
  company_name: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  city: string | null;
  country: string | null;
  industry: string | null;
  employee_count_range: string | null;
  revenue_range: string | null;
  headquarters_location: string | null;
  tags?: string[];
  last_activity_human?: string;
}

interface Deal {
  id: string;
  title: string;
  stage: string;
  value_usd: number | null;
  updated_at: string;
}

interface Activity {
  id: string;
  type: string;
  subject: string;
  at: string;
}

interface ContactDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
}

export function ContactDrawer({ open, onOpenChange, contactId }: ContactDrawerProps) {
  // Mock contact data - in real app this would fetch from API
  const contact: Contact = {
    id: contactId,
    full_name: "John Smith",
    company_name: "Global Logistics Corp",
    title: "VP of Operations",
    email: "john.smith@globallogistics.com",
    phone: "+1 555-0123",
    linkedin_url: "https://linkedin.com/in/johnsmith",
    city: "New York",
    country: "United States",
    industry: "Logistics & Transportation",
    employee_count_range: "500-1000",
    revenue_range: "$50M-$100M",
    headquarters_location: "New York, NY",
    tags: ["Air", "Ocean", "Hot Lead"],
    last_activity_human: "2d ago"
  };

  const mockDeals: Deal[] = [
    {
      id: "1",
      title: "Q1 Ocean Freight Contract",
      stage: "Proposal Sent",
      value_usd: 85000,
      updated_at: "2025-01-15T10:30:00Z"
    },
    {
      id: "2", 
      title: "Air Freight Partnership",
      stage: "Qualified",
      value_usd: 43500,
      updated_at: "2025-01-14T15:45:00Z"
    }
  ];

  const mockActivities: Activity[] = [
    {
      id: "1",
      type: "email",
      subject: "Follow-up on proposal",
      at: "2025-01-15T14:30:00Z"
    },
    {
      id: "2",
      type: "call",
      subject: "Discovery call",
      at: "2025-01-12T11:00:00Z"
    }
  ];

  const totalDealsValue = mockDeals.reduce((sum, deal) => sum + (deal.value_usd || 0), 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:w-[540px] border-line">
        <SheetHeader className="pb-4 border-b border-line">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-primary" />
              <span className="text-text-main">{contact.full_name}</span>
            </div>
            {contact.company_name && (
              <Badge variant="outline" className="text-text-muted">
                {contact.company_name}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="enrichment">Enrichment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-text-main">Contact Details</h4>
                
                <PlanGate plan="pro" fallback={
                  <div className="text-sm text-text-muted">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email hidden (upgrade to view)
                  </div>
                }>
                  <div className="text-sm">
                    <Mail className="inline h-4 w-4 mr-2 text-brand-primary" />
                    <span className="text-text-main">{contact.email}</span>
                  </div>
                </PlanGate>

                <PlanGate plan="pro" fallback={
                  <div className="text-sm text-text-muted">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Phone hidden (upgrade to view)
                  </div>
                }>
                  <div className="text-sm">
                    <Phone className="inline h-4 w-4 mr-2 text-brand-primary" />
                    <span className="text-text-main">{contact.phone}</span>
                  </div>
                </PlanGate>

                <PlanGate plan="pro" fallback={
                  <div className="text-sm text-text-muted">
                    <Linkedin className="inline h-4 w-4 mr-2" />
                    LinkedIn hidden (upgrade to view)
                  </div>
                }>
                  <div className="text-sm">
                    <Linkedin className="inline h-4 w-4 mr-2 text-brand-primary" />
                    <span className="text-text-main">LinkedIn Profile</span>
                  </div>
                </PlanGate>

                <div className="text-sm">
                  <MapPin className="inline h-4 w-4 mr-2 text-brand-primary" />
                  <span className="text-text-main">{contact.city}, {contact.country}</span>
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-text-main">Company Details</h4>
                
                <div className="text-sm">
                  <Building className="inline h-4 w-4 mr-2 text-brand-primary" />
                  <span className="text-text-main">{contact.company_name}</span>
                </div>

                <div className="text-sm">
                  <Globe className="inline h-4 w-4 mr-2 text-brand-primary" />
                  <span className="text-text-main">{contact.industry}</span>
                </div>

                <div className="text-sm">
                  <User className="inline h-4 w-4 mr-2 text-brand-primary" />
                  <span className="text-text-main">{contact.employee_count_range} employees</span>
                </div>

                <div className="text-sm">
                  <DollarSign className="inline h-4 w-4 mr-2 text-brand-primary" />
                  <span className="text-text-main">{contact.revenue_range} revenue</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-text-main mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-brand-primary/10 text-brand-primary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-line">
              <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-primaryFg">
                New Deal
              </Button>
              <Button variant="outline" className="w-full border-line hover:bg-surface-subtle">
                Add to Campaign
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="deals" className="space-y-4">
            {/* Summary Strip */}
            <div className="bg-surface-subtle rounded-xl2 p-4 border border-line">
              <div className="text-sm text-text-muted">
                Total deals: {mockDeals.length} • Total value: ${totalDealsValue.toLocaleString()}
              </div>
            </div>

            {/* Deals List */}
            {mockDeals.length > 0 ? (
              <div className="space-y-3">
                {mockDeals.map((deal) => (
                  <div key={deal.id} className="border border-line rounded-xl2 p-3 bg-surface-card">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-text-main">{deal.title}</div>
                        <div className="text-sm text-text-muted mt-1">
                          Updated {new Date(deal.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-brand-accent/10 text-brand-accent">
                          {deal.stage}
                        </Badge>
                        {deal.value_usd && (
                          <div className="text-sm font-medium text-text-main mt-1">
                            ${deal.value_usd.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-text-muted mx-auto mb-3" />
                <div className="text-text-muted mb-4">No deals yet</div>
                <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-primaryFg">
                  Create Deal
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            {mockActivities.length > 0 ? (
              <div className="space-y-3">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border border-line rounded-xl2 bg-surface-card">
                    <div className="mt-1">
                      {activity.type === 'email' ? (
                        <Mail className="h-4 w-4 text-brand-primary" />
                      ) : (
                        <Phone className="h-4 w-4 text-brand-accent" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-main">{activity.subject}</div>
                      <div className="text-sm text-text-muted">
                        {new Date(activity.at).toLocaleDateString()} at{' '}
                        {new Date(activity.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-text-muted mx-auto mb-3" />
                <div className="text-text-muted mb-4">No recent activity</div>
                <Button variant="outline" className="border-line hover:bg-surface-subtle">
                  Send Quick Intro
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="enrichment" className="space-y-4">
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-text-muted mx-auto mb-3" />
              <div className="text-text-muted mb-2">Enrichment log</div>
              <div className="text-sm text-text-muted">
                Contact enriched from Apollo on {new Date().toLocaleDateString()}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}