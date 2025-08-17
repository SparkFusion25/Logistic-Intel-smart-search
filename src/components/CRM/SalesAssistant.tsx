"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Suggestion = {
  title: string;
  dealId?: string;
  confidence: "Low"|"Medium"|"High";
  note: string;
  cta?: { label: string; onClick: () => void };
};

export function SalesAssistant() {
  const [items, setItems] = useState<Suggestion[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // For now, show static suggestions until we implement the full assistant API
        const suggestions: Suggestion[] = [
          {
            title: "Review pipeline activity",
            confidence: "Medium",
            note: "You have deals in 'Contacted' stage. Consider moving engaged prospects to the next stage.",
            cta: { label: "Review deals", onClick: () => console.log("Review deals clicked") }
          },
          {
            title: "Follow up on proposals", 
            confidence: "High",
            note: "2 deals in 'Proposal Sent' stage haven't been updated in 3 days.",
            cta: { label: "Send follow-up", onClick: () => console.log("Follow-up clicked") }
          }
        ];
        
        setItems(suggestions);
      } catch (error) {
        console.error('Error loading sales assistant data:', error);
        setItems([{
          title: "You're all caught up",
          confidence: "Medium",
          note: "No urgent actions. Review deals in 'Contacted' to move them forward.",
        }]);
      }
    })();
  }, []);

  return (
    <div className="p-4 space-y-3">
      <div className="text-lg font-semibold">Sales Assistant</div>
      {items.map((s, i) => (
        <Card key={i} className="p-4 space-y-2 rounded-2xl">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">NEXT BEST ACTION</div>
          <div className="font-medium">{s.title}</div>
          <div className="text-xs">Confidence: {s.confidence}</div>
          <div className="text-sm text-muted-foreground">{s.note}</div>
          {s.cta ? <Button size="sm" onClick={s.cta.onClick}>{s.cta.label}</Button> : null}
        </Card>
      ))}
    </div>
  );
}