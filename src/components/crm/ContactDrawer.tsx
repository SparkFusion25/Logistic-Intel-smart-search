import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  X, 
  Building2, 
  Users, 
  Mail, 
  Linkedin, 
  Calendar, 
  Rocket, 
  StickyNote,
  ExternalLink,
  Filter,
  Ship,
  Plane,
  TrendingUp,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: string;
  full_name: string | null;
  email: string | null;
  title: string | null;
  phone: string | null;
  linkedin_url: string | null;
  enrichment_source: string | null;
}

interface ShipmentData {
  mode: string | null;
  unified_date: string | null;
  value_usd: number | null;
  destination_country: string | null;
}

export default function ContactDrawer({ 
  open, 
  onClose, 
  company, 
  shipments 
}: { 
  open: boolean; 
  onClose: () => void; 
  company: string; 
  shipments: any[] 
}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [shipmentData, setShipmentData] = useState<ShipmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'all' | 'air' | 'ocean'>('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (open && company) {
      loadCompanyData();
    }
  }, [open, company]);

  const loadCompanyData = async () => {
    setLoading(true);
    try {
      // Load contacts for this company
      const { data: contactData, error: contactError } = await supabase
        .from('crm_contacts')
        .select('id, full_name, email, title, phone, linkedin_url, enrichment_source')
        .ilike('company_name', `%${company}%`);

      if (contactError) throw contactError;
      setContacts(contactData || []);

      // Load shipment data for this company
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('unified_shipments')
        .select('mode, unified_date, value_usd, destination_country')
        .ilike('unified_company_name', `%${company}%`)
        .order('unified_date', { ascending: false })
        .limit(100);

      if (shipmentError) throw shipmentError;
      // Filter out null values and ensure proper types
      const cleanShipments = (shipmentData || []).filter((s): s is ShipmentData => 
        s.mode !== null && s.unified_date !== null
      );
      setShipmentData(cleanShipments);
    } catch (error) {
      console.error('Failed to load company data:', error);
      toast({
        title: "Failed to load company data",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailContact = (email: string) => {
    navigate(`/dashboard/email?to=${encodeURIComponent(email)}&company=${encodeURIComponent(company)}`);
    onClose();
  };

  const handleLinkedInConnect = (linkedinUrl: string | null, contactName: string | null) => {
    if (linkedinUrl) {
      window.open(linkedinUrl, '_blank');
    } else {
      // Generate LinkedIn search
      const searchQuery = contactName ? `${contactName} ${company}` : company;
      window.open(`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  const handleScheduleMeeting = (contactName: string | null) => {
    const subject = `Meeting with ${contactName || 'Contact'} from ${company}`;
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(subject)}`;
    window.open(calendarUrl, '_blank');
  };

  const handleAddToCampaign = () => {
    navigate(`/dashboard/campaigns?company=${encodeURIComponent(company)}`);
    onClose();
  };

  const filteredShipments = shipmentData.filter(shipment => 
    selectedMode === 'all' || shipment.mode === selectedMode
  );

  const airShipments = shipmentData.filter(s => s.mode === 'air').length;
  const oceanShipments = shipmentData.filter(s => s.mode === 'ocean').length;
  const totalValue = shipmentData.reduce((sum, s) => sum + (s.value_usd || 0), 0);

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      <aside className={`absolute right-0 top-0 h-full w-full sm:w-[600px] bg-card border-l border-border shadow-xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{company}</h2>
              <p className="text-sm text-muted-foreground">Company Overview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{contacts.length}</div>
                  <div className="text-xs text-muted-foreground">Contacts</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <Ship className="h-6 w-6 mx-auto mb-2 text-teal-600" />
                  <div className="text-2xl font-bold text-foreground">{shipmentData.length}</div>
                  <div className="text-xs text-muted-foreground">Shipments</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Trade Value</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleAddToCampaign}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary text-sm"
                  >
                    <Rocket className="h-4 w-4" />
                    Add to Campaign
                  </button>
                  <button
                    onClick={() => handleScheduleMeeting(null)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors text-orange-700 text-sm"
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule Meeting
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 text-sm">
                    <StickyNote className="h-4 w-4" />
                    Add Notes
                  </button>
                </div>
              </div>

              {/* Contacts List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-foreground">Contacts ({contacts.length})</h3>
                  <button className="text-xs text-primary hover:text-primary/80">
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {contacts.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      No contacts found for this company
                    </div>
                  ) : (
                    contacts.map((contact) => (
                      <div key={contact.id} className="p-3 rounded-lg border border-border bg-muted/30">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm">
                              {contact.full_name || 'Unnamed Contact'}
                            </h4>
                            {contact.title && (
                              <p className="text-xs text-muted-foreground">{contact.title}</p>
                            )}
                            {contact.email && (
                              <p className="text-xs text-muted-foreground">{contact.email}</p>
                            )}
                            {contact.enrichment_source && (
                              <div className="mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                                  Enriched via {contact.enrichment_source}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            {contact.email && (
                              <button
                                onClick={() => handleEmailContact(contact.email!)}
                                className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                              >
                                <Mail className="h-3 w-3 text-green-600" />
                              </button>
                            )}
                            {contact.phone && (
                              <button className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                                <Phone className="h-3 w-3 text-blue-600" />
                              </button>
                            )}
                            <button
                              onClick={() => handleLinkedInConnect(contact.linkedin_url, contact.full_name)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                              <Linkedin className="h-3 w-3 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleScheduleMeeting(contact.full_name)}
                              className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                            >
                              <Calendar className="h-3 w-3 text-orange-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Trade Data Filters */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-foreground">Trade History</h3>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={selectedMode}
                      onChange={(e) => setSelectedMode(e.target.value as 'all' | 'air' | 'ocean')}
                      className="text-xs border border-border rounded px-2 py-1"
                    >
                      <option value="all">All Modes</option>
                      <option value="air">Air Only</option>
                      <option value="ocean">Ocean Only</option>
                    </select>
                  </div>
                </div>

                {/* Mode Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50">
                    <Plane className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-blue-900">{airShipments}</div>
                      <div className="text-xs text-blue-700">Air Shipments</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-teal-50">
                    <Ship className="h-4 w-4 text-teal-600" />
                    <div>
                      <div className="text-sm font-medium text-teal-900">{oceanShipments}</div>
                      <div className="text-xs text-teal-700">Ocean Shipments</div>
                    </div>
                  </div>
                </div>

                {/* Recent Shipments */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredShipments.slice(0, 20).map((shipment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-2">
                        {shipment.mode === 'air' ? (
                          <Plane className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Ship className="h-4 w-4 text-teal-600" />
                        )}
                        <div>
                          <div className="text-sm text-foreground">
                            {shipment.destination_country || 'Unknown Destination'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {shipment.unified_date ? new Date(shipment.unified_date).toLocaleDateString() : 'Unknown Date'}
                          </div>
                        </div>
                      </div>
                      {shipment.value_usd && (
                        <div className="text-sm font-medium text-foreground">
                          ${shipment.value_usd.toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredShipments.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      No {selectedMode === 'all' ? '' : selectedMode} shipments found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}