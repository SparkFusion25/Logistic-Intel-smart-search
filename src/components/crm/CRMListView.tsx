import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, LinkedinIcon, Plus, Building2 } from 'lucide-react';

type CRMContact = {
  id: string;
  company_name: string;
  full_name?: string;
  contact_name?: string;
  title?: string;
  email?: string;
  phone?: string;
  industry?: string;
  country?: string;
  city?: string;
  linkedin_url?: string;
  status?: string;
  created_at: string;
  tags?: any[];
  notes?: string;
};

type CRMListViewProps = {
  contacts: CRMContact[];
  onContactClick: (contact: CRMContact) => void;
  onEmailContact?: (contact: CRMContact) => void;
  onLinkedInContact?: (contact: CRMContact) => void;
  onAddToCampaign?: (contact: CRMContact) => void;
};

export function CRMListView({ 
  contacts, 
  onContactClick, 
  onEmailContact, 
  onLinkedInContact, 
  onAddToCampaign 
}: CRMListViewProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'lead': return 'bg-blue-500';
      case 'qualified': return 'bg-green-500';
      case 'opportunity': return 'bg-orange-500';
      case 'customer': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="card-glass p-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No contacts yet</h3>
        <p className="text-muted-foreground">Add contacts from Search to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border shadow-card bg-card">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">Company</th>
            <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">Name</th>
            <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">Title</th>
            <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">Email</th>
            <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">Status</th>
            <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, i) => (
            <tr 
              key={contact.id} 
              className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onContactClick(contact)}
            >
              <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">
                {contact.company_name || '—'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-foreground">
                {contact.full_name || contact.contact_name || '—'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {contact.title || '—'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-foreground">
                {contact.email || '—'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {contact.status && (
                  <Badge variant="secondary" className={`text-white ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </Badge>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex gap-1">
                  {contact.email && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEmailContact?.(contact);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Mail className="h-3 w-3" />
                    </Button>
                  )}
                  {contact.linkedin_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLinkedInContact?.(contact);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <LinkedinIcon className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCampaign?.(contact);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}