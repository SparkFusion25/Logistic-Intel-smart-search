import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  location?: string;
  status: "verified" | "active" | "high-value";
  className?: string;
  style?: React.CSSProperties;
}

const statusConfig = {
  verified: { bg: "bg-success/20", text: "text-success", border: "border-success/30", label: "Verified" },
  active: { bg: "bg-brand/20", text: "text-brand", border: "border-brand/30", label: "Active" },
  "high-value": { bg: "bg-warning/20", text: "text-warning", border: "border-warning/30", label: "High Value" },
};

export const ContactCard = ({ 
  name, 
  title, 
  company, 
  email, 
  phone, 
  location, 
  status,
  className,
  style 
}: ContactCardProps) => {
  const statusStyle = statusConfig[status];

  return (
    <Card 
      className={cn(
        "card-enterprise hover:scale-105 transform transition-all duration-300 group",
        className
      )}
      style={style}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand to-accent rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-text-dark group-hover:text-brand transition-colors">
                {name}
              </h4>
              <p className="text-sm text-muted-text">{title}</p>
            </div>
          </div>
          <Badge className={cn(statusStyle.bg, statusStyle.text, statusStyle.border)}>
            {statusStyle.label}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-text-dark">
            <Building className="w-4 h-4 text-muted-text" />
            <span>{company}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-dark">
            <Mail className="w-4 h-4 text-muted-text" />
            <span>{email}</span>
          </div>
          {phone && (
            <div className="flex items-center gap-2 text-sm text-text-dark">
              <Phone className="w-4 h-4 text-muted-text" />
              <span>{phone}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 text-sm text-text-dark">
              <MapPin className="w-4 h-4 text-muted-text" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};