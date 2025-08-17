import { Card } from "@/components/ui/card";
import { Mail, Building, User, MapPin } from "lucide-react";
import { PlanGate } from "@/components/PlanGate";

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

interface ContactCardProps {
  contact: Contact;
  onOpen: () => void;
}

export function ContactCard({ contact, onOpen }: ContactCardProps) {
  return (
    <Card
      onClick={onOpen}
      className="cursor-pointer rounded-xl2 border border-line bg-surface-card shadow-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 h-40"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-text-main truncate">
            {contact.full_name || "Unnamed Contact"}
          </div>
          <div className="text-sm text-text-muted truncate">
            {contact.company_name || "—"}
          </div>
        </div>
        {contact.score && (
          <div className="ml-2 px-2 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-medium">
            {contact.score}
          </div>
        )}
      </div>

      {/* Title/Role */}
      <div className="mb-3 text-sm text-text-muted truncate">
        {contact.title || "—"}
      </div>

      {/* Last Activity */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
        <Mail className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">
          {contact.last_activity_human ? `Last activity ${contact.last_activity_human}` : "No recent activity"}
        </span>
      </div>

      {/* Tags Row */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {contact.tags?.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {contact.tags && contact.tags.length > 2 && (
            <span className="px-2 py-0.5 rounded-full bg-text-muted/10 text-text-muted text-xs">
              +{contact.tags.length - 2}
            </span>
          )}
        </div>
        
        <PlanGate plan="pro">
          <button className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium">
            View
          </button>
        </PlanGate>
      </div>
    </Card>
  );
}