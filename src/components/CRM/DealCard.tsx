"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { DealDrawer } from "./DealDrawer";
import { Building, Calendar, User, MessageSquare, FileText, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface Deal {
  id: string;
  title: string;
  company_name: string | null;
  value_usd: number | null;
  stage_id: string;
  expected_close_date: string | null;
  probability: number | null;
  contact_name: string | null;
  activities_count: number;
  notes_count: number;
}

interface DealCardProps {
  deal: Deal;
  stageId: string;
}

export function DealCard({ deal, stageId }: DealCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    data: {
      stageId,
      deal,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getProbabilityColor = (probability: number | null) => {
    if (!probability) return "bg-gray-100 text-gray-600";
    if (probability >= 75) return "bg-green-100 text-green-700";
    if (probability >= 50) return "bg-yellow-100 text-yellow-700";
    if (probability >= 25) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={(e) => {
          e.stopPropagation();
          setDrawerOpen(true);
        }}
        className={cn(
          "cursor-pointer rounded-xl p-4 bg-surface-primary border border-line transition-all duration-200",
          "hover:shadow-card hover:border-brand-primary/20",
          isDragging && "opacity-50 shadow-lg rotate-3"
        )}
      >
        {/* Deal Title */}
        <div className="font-medium text-sm text-text-main mb-2 line-clamp-2">
          {deal.title}
        </div>

        {/* Company */}
        {deal.company_name && (
          <div className="flex items-center gap-1 text-xs text-text-muted mb-2">
            <Building className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{deal.company_name}</span>
          </div>
        )}

        {/* Contact */}
        {deal.contact_name && (
          <div className="flex items-center gap-1 text-xs text-text-muted mb-2">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{deal.contact_name}</span>
          </div>
        )}

        {/* Value */}
        {deal.value_usd && (
          <div className="flex items-center gap-1 text-sm font-semibold text-brand-accent mb-2">
            <DollarSign className="h-3 w-3" />
            {deal.value_usd.toLocaleString()}
          </div>
        )}

        {/* Expected Close Date */}
        {deal.expected_close_date && (
          <div className="flex items-center gap-1 text-xs text-text-muted mb-2">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>{formatDate(deal.expected_close_date)}</span>
          </div>
        )}

        {/* Probability Badge */}
        {deal.probability !== null && (
          <div className="mb-2">
            <Badge 
              variant="secondary" 
              className={cn("text-xs", getProbabilityColor(deal.probability))}
            >
              {deal.probability}% probability
            </Badge>
          </div>
        )}

        {/* Activity Indicators */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-line">
          {deal.activities_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <MessageSquare className="h-3 w-3" />
              <span>{deal.activities_count}</span>
            </div>
          )}
          {deal.notes_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <FileText className="h-3 w-3" />
              <span>{deal.notes_count}</span>
            </div>
          )}
        </div>
      </Card>

      <DealDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
        dealId={deal.id}
      />
    </>
  );
}