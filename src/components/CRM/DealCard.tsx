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
          "cursor-pointer rounded-xl p-4 bg-white border border-slate-200 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10",
          "hover:border-blue-300 hover:-translate-y-1 group",
          isDragging && "opacity-50 shadow-xl rotate-3 scale-105"
        )}
      >
        {/* Deal Title */}
        <div className="font-semibold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {deal.title}
        </div>

        {/* Company */}
        {deal.company_name && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Building className="h-3 w-3 text-white" />
            </div>
            <span className="truncate font-medium">{deal.company_name}</span>
          </div>
        )}

        {/* Contact */}
        {deal.contact_name && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>
            <span className="truncate">{deal.contact_name}</span>
          </div>
        )}

        {/* Value */}
        {deal.value_usd && (
          <div className="flex items-center gap-2 mb-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <DollarSign className="h-3 w-3 text-white" />
            </div>
            <span className="text-green-700 font-bold text-lg">
              ${deal.value_usd.toLocaleString()}
            </span>
          </div>
        )}

        {/* Expected Close Date */}
        {deal.expected_close_date && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Calendar className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium">{formatDate(deal.expected_close_date)}</span>
          </div>
        )}

        {/* Probability Badge */}
        {deal.probability !== null && (
          <div className="mb-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200">
              {deal.probability}% chance
            </div>
          </div>
        )}

        {/* Activity Indicators */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
          {deal.activities_count > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md">
              <MessageSquare className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">{deal.activities_count}</span>
            </div>
          )}
          {deal.notes_count > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-md">
              <FileText className="h-3 w-3 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">{deal.notes_count}</span>
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