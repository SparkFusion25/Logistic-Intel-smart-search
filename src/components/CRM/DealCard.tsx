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
          "cursor-pointer rounded-lg p-2 sm:p-2.5 bg-white border border-slate-200 transition-all duration-200 hover:shadow-md hover:shadow-blue-500/10",
          "hover:border-blue-300 hover:-translate-y-0.5 group touch-manipulation",
          "min-h-20 sm:min-h-24 w-48 sm:w-52",
          isDragging && "opacity-50 shadow-lg rotate-2 scale-105"
        )}
      >
        {/* Deal Title - Compact */}
        <div className="font-medium text-slate-800 mb-1.5 sm:mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors text-sm leading-tight">
          {deal.title}
        </div>

        {/* Company - Compact */}
        {deal.company_name && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1.5">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Building className="h-2 w-2 text-white" />
            </div>
            <span className="truncate font-medium">{deal.company_name}</span>
          </div>
        )}

        {/* Value - Prominent but compact */}
        {deal.value_usd && (
          <div className="flex items-center gap-1.5 mb-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-md p-1.5">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-2 w-2 text-white" />
            </div>
            <span className="text-green-700 font-bold text-sm">
              ${deal.value_usd.toLocaleString()}
            </span>
          </div>
        )}

        {/* Contact - Only if space allows */}
        {deal.contact_name && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1.5 sm:block hidden">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <User className="h-2 w-2 text-white" />
            </div>
            <span className="truncate">{deal.contact_name}</span>
          </div>
        )}

        {/* Expected Close Date - Compact */}
        {deal.expected_close_date && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1.5">
            <Calendar className="h-3 w-3 text-orange-500 flex-shrink-0" />
            <span className="font-medium">{formatDate(deal.expected_close_date)}</span>
          </div>
        )}

        {/* Bottom row - Probability and Activities */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
          {/* Probability - Compact */}
          {deal.probability !== null && (
            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              {deal.probability}%
            </div>
          )}

          {/* Activity Indicators - Compact */}
          <div className="flex items-center gap-1.5">
            {deal.activities_count > 0 && (
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 rounded text-xs">
                <MessageSquare className="h-2.5 w-2.5 text-blue-600" />
                <span className="text-blue-700 font-medium">{deal.activities_count}</span>
              </div>
            )}
            {deal.notes_count > 0 && (
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 rounded text-xs">
                <FileText className="h-2.5 w-2.5 text-amber-600" />
                <span className="text-amber-700 font-medium">{deal.notes_count}</span>
              </div>
            )}
          </div>
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