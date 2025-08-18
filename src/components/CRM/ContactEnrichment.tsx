import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Users, Building, Mail, Phone, Linkedin, Globe, RefreshCw } from 'lucide-react';

interface ContactEnrichmentProps {
  dealId: string;
  companyName?: string;
  contactId?: string;
}

const departments = [
  'Executive Leadership',
  'Sales & Marketing',
  'Operations & Logistics',
  'Finance & Accounting',
  'Human Resources',
  'Information Technology',
  'Legal & Compliance',
  'Customer Service',
  'Procurement & Sourcing',
  'Business Development'
];

export function ContactEnrichment({ dealId, companyName, contactId }: ContactEnrichmentProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    company: companyName || '',
    department: '',
    contactName: ''
  });
  const [enrichedContacts, setEnrichedContacts] = useState<any[]>([]);

  const handleEnrichment = async () => {
    if (!searchParams.company) {
      toast({
        title: "Missing Information",
        description: "Please enter a company name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('contact-enrichment', {
        body: {
          contact_id: contactId,
          company_name: searchParams.company,
          contact_name: searchParams.contactName,
          department: searchParams.department
        }
      });

      if (error) throw error;

      if (data?.success && data?.enriched_data) {
        setEnrichedContacts(data.enriched_data);
        toast({
          title: "Enrichment Complete",
          description: `Found ${data.enriched_data.length} contacts`
        });
      } else {
        toast({
          title: "No Results",
          description: "No additional contact information found",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error enriching contacts:', error);
      toast({
        title: "Enrichment Failed",
        description: "Failed to enrich contact data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addToContacts = async (contact: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('crm-add-contact', {
        body: {
          company_name: contact.company || searchParams.company,
          full_name: contact.name,
          email: contact.email,
          title: contact.title,
          phone: contact.phone,
          linkedin: contact.linkedin_url,
          source: 'enrichment'
        }
      });

      if (error) throw error;

      toast({
        title: "Contact Added",
        description: `${contact.name} has been added to your CRM`
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "Failed to add contact to CRM",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Contact Enrichment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={searchParams.company}
              onChange={(e) => setSearchParams({ ...searchParams, company: e.target.value })}
              placeholder="Enter company name"
            />
          </div>

          <div>
            <Label htmlFor="department">Target Department (Optional)</Label>
            <Select 
              value={searchParams.department} 
              onValueChange={(value) => setSearchParams({ ...searchParams, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contactName">Specific Contact Name (Optional)</Label>
            <Input
              id="contactName"
              value={searchParams.contactName}
              onChange={(e) => setSearchParams({ ...searchParams, contactName: e.target.value })}
              placeholder="Enter contact name if known"
            />
          </div>

          <Button onClick={handleEnrichment} disabled={loading} className="w-full">
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Enriching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Enrich Contacts
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {enrichedContacts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Enriched Contacts ({enrichedContacts.length})</h3>
          {enrichedContacts.map((contact, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.title}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      {contact.linkedin_url && (
                        <div className="flex items-center gap-2">
                          <Linkedin className="w-4 h-4 text-muted-foreground" />
                          <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            LinkedIn
                          </a>
                        </div>
                      )}
                      {contact.company && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span>{contact.company}</span>
                        </div>
                      )}
                      {contact.location && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span>{contact.location}</span>
                        </div>
                      )}
                    </div>

                    {contact.department && (
                      <div>
                        <Badge variant="secondary">{contact.department}</Badge>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={() => addToContacts(contact)}
                    size="sm"
                    className="ml-4"
                  >
                    Add to CRM
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && enrichedContacts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Enriched Data Yet</h3>
            <p className="text-muted-foreground">
              Enter a company name and click "Enrich Contacts" to find additional contact information.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}