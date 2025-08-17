"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Target, Clock, Phone, Mail, MessageSquare } from "lucide-react";

type Suggestion = {
  id: string;
  type: "follow_up" | "schedule_call" | "advance_stage" | "send_email";
  title: string;
  confidence: "Low" | "Medium" | "High";
  note: string;
  priority: number;
  cta?: { label: string; onClick: () => void };
};

export function SalesAssistant() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    dealsThisWeek: 12,
    callsScheduled: 5,
    followUpsNeeded: 8,
    hotLeads: 3
  });

  useEffect(() => {
    // Mock suggestions
    const mockSuggestions: Suggestion[] = [
      {
        id: "1",
        type: "follow_up",
        title: "Follow up with Global Logistics Corp",
        confidence: "High",
        note: "Last contact was 3 days ago. They showed strong interest in ocean freight.",
        priority: 1,
        cta: { label: "Send Follow-up", onClick: () => console.log("Follow up") }
      },
      {
        id: "2", 
        type: "schedule_call",
        title: "Schedule discovery call",
        confidence: "High",
        note: "Contact opened email 3 times and clicked pricing link.",
        priority: 2,
        cta: { label: "Schedule Call", onClick: () => console.log("Schedule call") }
      }
    ];
    
    setSuggestions(mockSuggestions);
    setLoading(false);
  }, []);

  const getActionIcon = (type: string) => {
    switch (type) {
      case "follow_up": return <Mail className="w-4 h-4" />;
      case "schedule_call": return <Phone className="w-4 h-4" />;
      case "advance_stage": return <TrendingUp className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Sales Assistant</h2>
        <p className="text-sm text-muted-foreground mt-1">AI-powered next best actions</p>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Quick Stats */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">This Week</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">{stats.dealsThisWeek}</div>
                  <div className="text-xs text-muted-foreground">New Deals</div>
                </div>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">{stats.callsScheduled}</div>
                  <div className="text-xs text-muted-foreground">Calls Scheduled</div>
                </div>
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
            </Card>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Next Best Actions</h3>
            <Badge variant="secondary" className="text-xs">AI Powered</Badge>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <Card key={i} className="p-4">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getActionIcon(suggestion.type)}
                        <div className="font-medium text-sm">
                          {suggestion.title}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.confidence}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {suggestion.note}
                    </p>
                    
                    {suggestion.cta && (
                      <Button 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={suggestion.cta.onClick}
                      >
                        {suggestion.cta.label}
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}