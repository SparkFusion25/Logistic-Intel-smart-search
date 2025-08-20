import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, Mail, Phone, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MiniCRMList() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (error) throw error;
      setContacts(data || []);
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

  const handleAddContact = () => {
    // This would open a contact modal or navigate to CRM
    toast({
      title: "Add Contact",
      description: "Contact form would open here",
    });
  };

  if (loading) {
    return (
      <div className="card-glass p-6 animate-fade-in-up">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass p-6 animate-fade-in-up border-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Recent Contacts</h3>
            <p className="text-sm text-muted-foreground">Your latest connections</p>
          </div>
        </div>
        <button
          onClick={handleAddContact}
          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <Plus className="h-4 w-4 text-primary" />
        </button>
      </div>

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No contacts yet</p>
            <button onClick={handleAddContact} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add First Contact
            </button>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {(contact.full_name || contact.company_name || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {contact.full_name || contact.company_name || 'Unnamed Contact'}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {contact.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-[120px]">{contact.email}</span>
                    </div>
                  )}
                  {contact.title && (
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      <span className="truncate">{contact.title}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                {contact.email && (
                  <button className="p-1.5 rounded hover:bg-primary/10 transition-colors">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
                {contact.phone && (
                  <button className="p-1.5 rounded hover:bg-primary/10 transition-colors">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {contacts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button className="btn-secondary w-full">
            View All Contacts
          </button>
        </div>
      )}
    </div>
  );
}