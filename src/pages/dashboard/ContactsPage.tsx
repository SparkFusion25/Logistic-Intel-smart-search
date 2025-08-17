import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopBar } from "@/components/ui/TopBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContactCard } from "@/components/CRM/ContactCard";
import { ContactDrawer } from "@/components/CRM/ContactDrawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  last_activity_human?: string;
  tags?: string[];
  score?: number;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match our interface
      const transformedContacts: Contact[] = (data || []).map(contact => ({
        id: contact.id,
        full_name: contact.full_name || contact.contact_name,
        company_name: contact.company_name,
        title: contact.title,
        email: contact.email,
        phone: contact.phone,
        linkedin_url: contact.linkedin_url,
        city: contact.city,
        country: contact.country,
        last_activity_human: "2d ago", // Mock data
        tags: Array.isArray(contact.tags) ? contact.tags.filter((tag): tag is string => typeof tag === 'string') : [],
        score: Math.floor(Math.random() * 100) + 1 // Mock score
      }));

      setContacts(transformedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchQuery || 
      contact.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Add filter logic here if needed
    return matchesSearch;
  });

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-surface-subtle">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <TopBar />
            <main className="flex-1 p-6 md:p-8">
              <div className="max-w-7xl mx-auto">
                <div className="animate-pulse space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-40 bg-gray-200 rounded-xl2"></div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-surface-subtle">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopBar />
          <main className="flex-1 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-text-main">
                  Contacts
                </h1>
                <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-primaryFg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-line bg-surface-card"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px] border-line bg-surface-card">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contacts</SelectItem>
                    <SelectItem value="hot">Hot Leads</SelectItem>
                    <SelectItem value="warm">Warm Leads</SelectItem>
                    <SelectItem value="cold">Cold Leads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stats Row */}
              <div className="text-sm text-text-muted">
                Showing {filteredContacts.length} of {contacts.length} contacts
              </div>

              {/* Contacts Grid */}
              {filteredContacts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredContacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onOpen={() => setSelectedContact(contact.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-text-muted mb-4">
                    {searchQuery ? "No contacts match your search" : "No contacts found"}
                  </div>
                  <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-primaryFg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Contact
                  </Button>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Contact Drawer */}
      <ContactDrawer
        open={!!selectedContact}
        onOpenChange={(open) => !open && setSelectedContact(null)}
        contactId={selectedContact || ""}
      />
    </SidebarProvider>
  );
}