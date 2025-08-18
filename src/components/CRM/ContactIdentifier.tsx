import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Mail, Phone, MapPin, Building, Linkedin, ExternalLink, UserPlus, Sparkles } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface IdentifiedContact {
  id: string;
  name: string;
  title: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  department: string;
  seniority_level: string;
  likelihood_score: number;
  reasoning: string;
  profile_summary?: string;
}

interface ContactIdentifierProps {
  companyName: string;
  companyDomain?: string;
  dealId?: string;
}

export function ContactIdentifier({ companyName, companyDomain, dealId }: ContactIdentifierProps) {
  const [contacts, setContacts] = useState<IdentifiedContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [enriching, setEnriching] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<IdentifiedContact | null>(null);
  const [enrichedData, setEnrichedData] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const identifyContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('contact-identifier', {
        body: { 
          company_name: companyName,
          company_domain: companyDomain,
          deal_id: dealId
        }
      });

      if (error) throw error;
      setContacts(data.contacts || []);
      toast({
        title: "Contact Analysis Complete",
        description: `Identified ${data.contacts?.length || 0} potential contacts`
      });
    } catch (error) {
      console.error('Contact identification error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to identify contacts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const enrichContact = async (contact: IdentifiedContact) => {
    setEnriching(contact.id);
    try {
      const { data, error } = await supabase.functions.invoke('contact-enrichment', {
        body: {
          contact_name: contact.name,
          company_name: companyName,
          department: contact.department,
          title: contact.title
        }
      });

      if (error) throw error;
      
      setEnrichedData(data);
      setSelectedContact(contact);
      setDialogOpen(true);
      
      toast({
        title: "Enrichment Complete",
        description: "Full contact details retrieved"
      });
    } catch (error) {
      console.error('Contact enrichment error:', error);
      toast({
        title: "Enrichment Failed",
        description: "Unable to enrich contact details",
        variant: "destructive"
      });
    } finally {
      setEnriching(null);
    }
  };

  const addToCRM = async (contact: IdentifiedContact, enrichedData?: any) => {
    try {
      const contactData = {
        company_name: companyName,
        full_name: contact.name,
        title: contact.title,
        email: enrichedData?.email || contact.email,
        phone: enrichedData?.phone || contact.phone,
        linkedin: enrichedData?.linkedin || contact.linkedin,
        source: 'ai_identification',
        deal_id: dealId
      };

      const { data, error } = await supabase.functions.invoke('crm-add-contact', {
        body: contactData
      });

      if (error) throw error;
      
      toast({
        title: "Contact Added",
        description: `${contact.name} added to CRM successfully`
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Add to CRM error:', error);
      toast({
        title: "Failed to Add Contact",
        description: "Unable to add contact to CRM",
        variant: "destructive"
      });
    }
  };

  const getSeniorityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'c-level': return 'bg-purple-100 text-purple-800';
      case 'director': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              AI Contact Identification
            </div>
            <Button 
              onClick={identifyContacts}
              disabled={loading}
              size="sm"
              className="bg-gradient-to-r from-primary to-primary-variant"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {loading ? 'Identifying...' : 'Find Contacts'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contacts.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Click "Find Contacts" to identify key personnel at {companyName}</p>
            </div>
          )}

          {contacts.map((contact) => (
            <Card key={contact.id} className="bg-muted/30 hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{contact.name}</h4>
                        <Badge className={getSeniorityColor(contact.seniority_level)}>
                          {contact.seniority_level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {contact.likelihood_score}% match
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{contact.title}</p>
                      <p className="text-xs text-muted-foreground mb-2">{contact.reasoning}</p>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {contact.department}
                        </span>
                        {contact.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            Email available
                          </span>
                        )}
                        {contact.linkedin && (
                          <span className="flex items-center gap-1">
                            <Linkedin className="w-3 h-3" />
                            LinkedIn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => enrichContact(contact)}
                      disabled={enriching === contact.id}
                    >
                      {enriching === contact.id ? 'Enriching...' : 'Enrich'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => addToCRM(contact)}
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Add to CRM
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Enrichment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Enriched Contact Profile
            </DialogTitle>
          </DialogHeader>
          
          {selectedContact && enrichedData && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={enrichedData.photo_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedContact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedContact.name}</h3>
                  <p className="text-muted-foreground">{enrichedData.title || selectedContact.title}</p>
                  <p className="text-sm text-muted-foreground">{companyName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrichedData.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{enrichedData.email}</span>
                  </div>
                )}
                
                {enrichedData.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{enrichedData.phone}</span>
                  </div>
                )}
                
                {enrichedData.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{enrichedData.location}</span>
                  </div>
                )}
                
                {enrichedData.linkedin_url && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={enrichedData.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      LinkedIn Profile
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {enrichedData.summary && (
                <div>
                  <h4 className="font-semibold mb-2">Professional Summary</h4>
                  <p className="text-sm text-muted-foreground">{enrichedData.summary}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => addToCRM(selectedContact, enrichedData)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add to CRM with Full Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}