import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, Mail, Phone, Calendar, Plus } from 'lucide-react';

interface CrmContact {
  id: string;
  company_name: string | null;
  full_name: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  created_at: string;
}

export function CRMContactsList() {
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('id, company_name, full_name, title, email, phone, source, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setContacts(data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-surface rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-surface rounded-2xl p-6">
        <div className="text-red-600">Error loading contacts: {error}</div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-6 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts yet</h3>
        <p className="text-gray-600 mb-4">
          Add companies from Search to see contacts here.
        </p>
        <button
          onClick={() => window.location.href = '/dashboard/search'}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-4 py-2 transition
                     hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-sm active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          Go to Search
        </button>
      </div>
    );
  }

  return (
    <div className="card-surface rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">CRM Contacts</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          {contacts.length} contacts
        </div>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {contact.full_name?.charAt(0)?.toUpperCase() || contact.company_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {contact.full_name || 'Unknown Name'}
                    </h3>
                    {contact.title && (
                      <p className="text-sm text-gray-600">{contact.title}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {contact.company_name && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      {contact.company_name}
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {contact.email}
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {contact.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(contact.created_at).toLocaleDateString()}
                  </div>
                </div>

                {contact.source && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {contact.source}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}