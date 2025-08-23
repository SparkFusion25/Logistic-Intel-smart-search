import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Users, Mail, Linkedin, ExternalLink, Building2, User, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: string;
  full_name: string | null;
  company_name: string | null;
  title: string | null;
  email: string | null;
  phone?: string | null;
  linkedin_url?: string | null;
  created_at: string | null;
  enriched?: boolean;
}

export function EnhancedCRMCard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);
        
      if (error) throw error;
      setContacts((data || []).map(contact => ({ 
        ...contact, 
        enriched: false,
        id: contact.id || '',
        created_at: contact.created_at || new Date().toISOString()
      } as Contact)));
    } catch (error) {
      console.error('Failed to load contacts:', error);
      toast({
        title: "Failed to load contacts",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewCompany = (contact: Contact) => {
    navigate(`/dashboard/crm?company=${encodeURIComponent(contact.company_name || '')}`);
  };

  const handleEmailContact = (contact: Contact) => {
    if (contact.email) {
      window.open(`mailto:${contact.email}`, '_blank');
    }
  };

  const handleLinkedInConnect = (contact: Contact) => {
    if (contact.linkedin_url) {
      window.open(contact.linkedin_url, '_blank');
    } else {
      // Generate LinkedIn search URL
      const searchQuery = `${contact.full_name || ''} ${contact.company_name || ''}`.trim();
      window.open(`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  const handleAddContact = () => {
    navigate('/dashboard/crm');
  };

  if (loading) {
    return (
      <div className="xl:col-span-2 card-glass p-6 animate-fade-in-up">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="xl:col-span-2 card-glass p-6 animate-fade-in-up border-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">CRM Contact Directory</h3>
            <p className="text-sm text-muted-foreground">Recently added companies and contacts</p>
          </div>
        </div>
        <button
          onClick={handleAddContact}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary font-medium text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </button>
      </div>

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No contacts yet</h4>
            <p className="text-muted-foreground mb-6">Start building your CRM by adding your first contact</p>
            <button onClick={handleAddContact} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add First Contact
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-4 p-4 rounded-xl card-surface hover:border-primary/20 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {(contact.full_name || contact.company_name || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">
                      {contact.company_name || 'Unknown Company'}
                    </h4>
                    {contact.enriched && (
                      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Enriched" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <User className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{contact.full_name || 'No name'}</span>
                  </div>
                  
                  {contact.title && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{contact.title}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleViewCompany(contact)}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                    title="View Company Details"
                  >
                    <ExternalLink className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                  </button>
                  
                  <button
                    onClick={() => handleEmailContact(contact)}
                    disabled={!contact.email}
                    className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Email Contact"
                  >
                    <Mail className="h-4 w-4 text-green-600 group-hover:text-green-700" />
                  </button>
                  
                  <button
                    onClick={() => handleLinkedInConnect(contact)}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                    title="Connect on LinkedIn"
                  >
                    <Linkedin className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {contacts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard/crm')}
              className="btn-secondary"
            >
              View Full CRM
            </button>
            <div className="text-xs text-muted-foreground">
              {contacts.length} of {contacts.length} contacts shown
            </div>
          </div>
        </div>
      )}
    </div>
  );
}