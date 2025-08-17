import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Calendar, Phone, Mail, ExternalLink, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Suggestion {
  id: string;
  subject_type: 'deal' | 'contact' | 'campaign';
  subject_id?: string;
  suggestion_type: string;
  score: number;
  confidence: 'Low' | 'Medium' | 'High';
  rationale: string;
  source_signals: Record<string, any>;
  status: 'new' | 'applied' | 'dismissed';
  created_at: string;
}

interface SalesAssistantProps {
  subjectType?: 'deal' | 'contact' | 'campaign';
  subjectId?: string;
}

export function SalesAssistant({ subjectType, subjectId }: SalesAssistantProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, [subjectType, subjectId]);

  const loadSuggestions = async () => {
    try {
      const params = new URLSearchParams();
      if (subjectType) params.append('subjectType', subjectType);
      if (subjectId) params.append('subjectId', subjectId);
      params.append('limit', '5');

      const { data, error } = await supabase.functions.invoke('assistant-next-best-action', {
        body: {},
        headers: { 'Content-Type': 'application/json' }
      });

      if (error) {
        console.error('Error loading suggestions:', error);
        setSuggestions([]);
      } else if (data?.success) {
        setSuggestions(data.data || []);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = async (suggestion: Suggestion) => {
    try {
      const { data, error } = await supabase.functions.invoke(`assistant-apply/${suggestion.id}`, {
        body: { mode: "execute" },
        headers: { 'Content-Type': 'application/json' }
      });

      if (error) {
        console.error('Error applying suggestion:', error);
        toast.error('Failed to apply suggestion');
        return;
      }

      if (data?.success) {
        toast.success('Suggestion applied successfully');
        setSuggestions(prev => 
          prev.map(s => s.id === suggestion.id ? { ...s, status: 'applied' } : s)
        );
      }
    } catch (error) {
      console.error('Error applying suggestion:', error);
      toast.error('Failed to apply suggestion');
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'follow_up':
        return <Mail className="h-4 w-4" />;
      case 'schedule_call':
        return <Phone className="h-4 w-4" />;
      case 'advance_stage':
        return <TrendingUp className="h-4 w-4" />;
      case 'send_email':
        return <Mail className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatActionTitle = (type: string) => {
    switch (type) {
      case 'follow_up':
        return 'Send Follow-up';
      case 'schedule_call':
        return 'Schedule Call';
      case 'advance_stage':
        return 'Advance Stage';
      case 'send_email':
        return 'Send Email';
      case 'attach_quote':
        return 'Attach Quote';
      case 'share_tariff':
        return 'Share Tariff';
      default:
        return 'Take Action';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Sales Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
            <div className="text-center">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-3" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full mb-3" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Sales Assistant
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Smart recommendations to boost your sales performance
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-xs text-muted-foreground">Deals this week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-xs text-muted-foreground">Calls scheduled</div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Next Best Actions
          </h4>
          
          {suggestions.length === 0 ? (
            <Card className="p-4 text-center">
              <div className="text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">You're all caught up!</p>
                <p className="text-xs text-muted-foreground">
                  No new recommendations at this time.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="p-4 transition-all hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {getActionIcon(suggestion.suggestion_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm">
                          {formatActionTitle(suggestion.suggestion_type)}
                        </h5>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                        >
                          {suggestion.confidence}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {suggestion.rationale}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                          disabled={suggestion.status === 'applied'}
                          className="text-xs h-7"
                        >
                          {suggestion.status === 'applied' ? 'Applied' : 'Apply'}
                        </Button>
                        {suggestion.status === 'applied' && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Done
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}