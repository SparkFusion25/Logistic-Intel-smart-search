import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Mail, LinkedinIcon, Plus, MapPin, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

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

type CRMCardViewProps = {
  contacts: CRMContact[];
  onContactClick: (contact: CRMContact) => void;
  onEmailContact?: (contact: CRMContact) => void;
  onLinkedInContact?: (contact: CRMContact) => void;
  onAddToCampaign?: (contact: CRMContact) => void;
};

export function CRMCardView({ 
  contacts, 
  onContactClick, 
  onEmailContact, 
  onLinkedInContact, 
  onAddToCampaign 
}: CRMCardViewProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const getInitials = (contact: CRMContact) => {
    const name = contact.full_name || contact.contact_name || contact.company_name;
    return name ? name.charAt(0).toUpperCase() : '?';
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <Card key={contact.id} className="hover:shadow-md transition-all duration-200 cursor-pointer group" onClick={() => onContactClick(contact)}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarFallback className={`text-white font-bold ${getStatusColor(contact.status)}`}>
                    {getInitials(contact)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground truncate text-lg">
                    {contact.company_name}
                  </h3>
                  {(contact.full_name || contact.contact_name) && (
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.full_name || contact.contact_name}
                    </p>
                  )}
                </div>
              </div>
              {contact.status && (
                <Badge variant="secondary" className="ml-2 flex-shrink-0">
                  {contact.status}
                </Badge>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {contact.title && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground truncate">{contact.title}</span>
                </div>
              )}
              {(contact.city || contact.country) && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground truncate">
                    {[contact.city, contact.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              {contact.industry && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground truncate">{contact.industry}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Added {formatDate(contact.created_at)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-border">
              {contact.email && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEmailContact?.(contact);
                  }}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              )}
              {contact.linkedin_url && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLinkedInContact?.(contact);
                  }}
                >
                  <LinkedinIcon className="h-3 w-3 mr-1" />
                  LinkedIn
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCampaign?.(contact);
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}