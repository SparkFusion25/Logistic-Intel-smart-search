import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, UserPlus, Mail, Phone, Linkedin, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DepartmentEnrichmentProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  dealId?: string;
}

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  linkedin?: string;
  company: string;
  department: string;
  photoUrl?: string;
  location?: string;
}

const DEPARTMENTS = [
  'Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'IT', 'Legal',
  'Procurement', 'Supply Chain', 'Customer Service', 'Business Development',
  'Product Management', 'Engineering', 'Quality Assurance', 'Logistics'
];

export function DepartmentEnrichment({ isOpen, onClose, companyName, dealId }: DepartmentEnrichmentProps) {
  const { toast } = useToast();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(['Sales', 'Procurement']);
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [enriched, setEnriched] = useState(false);

  const toggleDepartment = (department: string) => {
    setSelectedDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const enrichContacts = async () => {
    if (selectedDepartments.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one department",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('apollo-enrichment', {
        body: {
          companyName,
          departments: selectedDepartments,
          contactName: searchTerm
        }
      });

      if (error) throw error;

      if (data?.success) {
        setContacts(data.contacts || []);
        setEnriched(true);
        toast({
          title: "Success",
          description: `Found ${data.contacts?.length || 0} contacts across ${selectedDepartments.length} departments`,
        });
      } else {
        throw new Error(data?.error || 'Failed to enrich contacts');
      }
    } catch (error) {
      console.error('Error enriching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to enrich contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToContacts = async (contact: Contact) => {
    try {
      const { data, error } = await supabase.functions.invoke('crm-add-contact', {
        body: {
          company_name: contact.company,
          full_name: contact.name,
          title: contact.title,
          email: contact.email,
          phone: contact.phone,
          linkedin_url: contact.linkedin,
          source: 'apollo_enrichment',
          enrichment_source: 'apollo',
          tags: [contact.department]
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${contact.name} added to CRM contacts`,
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "Failed to add contact to CRM",
        variant: "destructive",
      });
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Department Contact Enrichment - {companyName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!enriched ? (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Select Departments to Search</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose which departments to search for contacts using Apollo.io
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {DEPARTMENTS.map((department) => (
                      <div key={department} className="flex items-center space-x-2">
                        <Checkbox
                          id={department}
                          checked={selectedDepartments.includes(department)}
                          onCheckedChange={() => toggleDepartment(department)}
                        />
                        <Label
                          htmlFor={department}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {department}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search">Additional Search Terms (Optional)</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Specific contact name or additional keywords"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={enrichContacts} disabled={loading || selectedDepartments.length === 0}>
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? 'Searching...' : 'Find Contacts'}
                  </Button>
                  <Badge variant="secondary">
                    {selectedDepartments.length} departments selected
                  </Badge>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Found {contacts.length} Contacts</h3>
                  <p className="text-sm text-muted-foreground">
                    Contacts discovered across {selectedDepartments.length} departments
                  </p>
                </div>
                <Button variant="outline" onClick={() => setEnriched(false)}>
                  New Search
                </Button>
              </div>

              {contacts.length > 10 && (
                <div className="space-y-2">
                  <Label htmlFor="filter">Filter Results</Label>
                  <Input
                    id="filter"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter by name, title, or department"
                  />
                </div>
              )}

              <div className="grid gap-4 max-h-[500px] overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <Card key={contact.id} className="hover:bg-accent/50 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {contact.photoUrl && (
                            <img
                              src={contact.photoUrl}
                              alt={contact.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{contact.name}</h4>
                              <Badge variant="outline">{contact.department}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{contact.title}</p>
                            <p className="text-sm font-medium">{contact.company}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {contact.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{contact.email}</span>
                                </div>
                              )}
                              {contact.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{contact.phone}</span>
                                </div>
                              )}
                              {contact.linkedin && (
                                <div className="flex items-center gap-1">
                                  <Linkedin className="h-3 w-3" />
                                  <span>LinkedIn</span>
                                </div>
                              )}
                              {contact.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{contact.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => addToContacts(contact)}
                          className="shrink-0"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add to CRM
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}