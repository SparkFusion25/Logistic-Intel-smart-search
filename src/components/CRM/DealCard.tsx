"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import { DealDrawer } from "./DealDrawer";

interface Deal {
  id: string;
  title: string;
  company_name: string | null;
  value_usd: number | null;
}

interface DealCardProps {
  deal: Deal;
  onMove?: (dealId: string, toStageId: string) => void;
}

export function DealCard({ deal, onMove }: DealCardProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Card 
        onClick={() => setOpen(true)} 
        className="cursor-pointer rounded-2xl p-3 mb-2 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="font-medium text-sm truncate">{deal.title}</div>
        <div className="text-xs text-muted-foreground mt-1 truncate">
          {deal.company_name || "—"}
        </div>
        {deal.value_usd ? (
          <div className="text-xs mt-2 font-medium text-green-600">
            ${Number(deal.value_usd).toLocaleString()}
          </div>
        ) : null}
      </Card>
      <DealDrawer 
        open={open} 
        onOpenChange={setOpen} 
        dealId={deal.id} 
        onMove={onMove}
      />
    </>
  );
}