import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Clock, 
  Mail, 
  Phone, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle, 
  Star,
  MessageSquare,
  Calendar,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SmartAIAssistantProps {
  dealId?: string;
  contactId?: string;
  companyName?: string;
  dealValue?: number;
  lastActivity?: string;
}

interface AISuggestion {
  id: string;
  type: 'follow_up' | 'schedule_call' | 'send_proposal' | 'price_negotiation' | 'competitor_analysis';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  estimatedImpact: string;
  suggestedAction: string;
  timeframe: string;
}

interface AIInsight {
  type: 'opportunity' | 'risk' | 'timing' | 'competitive';
  title: string;
  description: string;
  confidence: number;
}

export function SmartAIAssistant({ dealId, contactId, companyName, dealValue, lastActivity }: SmartAIAssistantProps) {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  useEffect(() => {
    generateSuggestions();
    generateInsights();
  }, [dealId, contactId]);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      // Mock AI suggestions based on deal context
      const mockSuggestions: AISuggestion[] = [
        {
          id: '1',
          type: 'follow_up',
          priority: 'high',
          title: 'Send Follow-up Email',
          description: 'No contact in 5 days. High-value prospect showing interest.',
          reasoning: 'Analysis shows 73% higher close rate when following up within 7 days of initial contact.',
          confidence: 87,
          estimatedImpact: '+23% close probability',
          suggestedAction: 'Send personalized follow-up highlighting ROI benefits',
          timeframe: 'Within 24 hours'
        },
        {
          id: '2',
          type: 'schedule_call',
          priority: 'high',
          title: 'Schedule Demo Call',
          description: 'Contact viewed pricing page 3 times. Ready for product demo.',
          reasoning: 'Behavioral signals indicate high purchase intent. Similar prospects convert 64% of the time after demo.',
          confidence: 92,
          estimatedImpact: '+45% close probability',
          suggestedAction: 'Propose 30-minute product demonstration focusing on logistics optimization',
          timeframe: 'This week'
        },
        {
          id: '3',
          type: 'price_negotiation',
          priority: 'medium',
          title: 'Prepare Price Negotiation',
          description: 'Deal size suggests budget flexibility. Competitor pricing intel available.',
          reasoning: 'Company revenue indicates budget for premium solution. Competitor charges 15% more.',
          confidence: 78,
          estimatedImpact: '+12% deal value',
          suggestedAction: 'Prepare value-based pricing discussion with ROI calculator',
          timeframe: 'Before next meeting'
        }
      ];

      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    try {
      const mockInsights: AIInsight[] = [
        {
          type: 'opportunity',
          title: 'Expansion Opportunity',
          description: 'Company is expanding to 3 new locations this quarter. Potential for 3x deal size.',
          confidence: 84
        },
        {
          type: 'timing',
          title: 'Budget Cycle Alert',
          description: 'Q4 budget approvals typically close by Dec 15th. Timing is critical.',
          confidence: 91
        },
        {
          type: 'competitive',
          title: 'Competitive Advantage',
          description: 'Your solution offers 40% faster implementation than main competitor.',
          confidence: 76
        }
      ];

      setInsights(mockInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    }
  };

  const applySuggestion = async (suggestion: AISuggestion) => {
    setSelectedSuggestion(suggestion);
    setShowActionDialog(true);
  };

  const executeAction = async () => {
    if (!selectedSuggestion) return;

    try {
      // Implement action based on suggestion type
      switch (selectedSuggestion.type) {
        case 'follow_up':
        case 'send_proposal':
          // Open email composer
          toast({
            title: "Email Composer",
            description: "Opening email composer with AI-generated content",
          });
          break;
        case 'schedule_call':
          // Open calendar scheduler
          toast({
            title: "Calendar Scheduler",
            description: "Opening calendar to schedule demo call",
          });
          break;
        case 'price_negotiation':
          // Open pricing tools
          toast({
            title: "Pricing Tools",
            description: "Loading competitor analysis and pricing recommendations",
          });
          break;
      }

      setShowActionDialog(false);
      setSelectedSuggestion(null);
    } catch (error) {
      console.error('Error executing action:', error);
      toast({
        title: "Error",
        description: "Failed to execute action",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'follow_up': return Mail;
      case 'schedule_call': return Phone;
      case 'send_proposal': return Send;
      case 'price_negotiation': return TrendingUp;
      case 'competitor_analysis': return Brain;
      default: return MessageSquare;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return TrendingUp;
      case 'risk': return AlertTriangle;
      case 'timing': return Clock;
      case 'competitive': return Star;
      default: return Brain;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Smart Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                  <Icon className="h-4 w-4 mt-0.5 text-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confident
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion) => {
              const Icon = getTypeIcon(suggestion.type);
              return (
                <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Icon className="h-4 w-4 mt-0.5 text-primary" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(suggestion.priority)}`} />
                          <Badge variant="outline" className="text-xs">
                            {suggestion.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-medium">Impact:</span> {suggestion.estimatedImpact}
                          </div>
                          <div>
                            <span className="font-medium">Timeline:</span> {suggestion.timeframe}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => applySuggestion(suggestion)}>
                      Apply
                    </Button>
                  </div>
                  <div className="bg-accent/30 p-3 rounded text-xs">
                    <span className="font-medium">AI Reasoning:</span> {suggestion.reasoning}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Execute Recommended Action</DialogTitle>
          </DialogHeader>
          
          {selectedSuggestion && (
            <div className="space-y-4">
              <div className="p-4 bg-accent/50 rounded-lg">
                <h3 className="font-medium mb-2">{selectedSuggestion.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{selectedSuggestion.description}</p>
                <div className="text-sm">
                  <span className="font-medium">Suggested Action:</span> {selectedSuggestion.suggestedAction}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customize Action (Optional)</label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Add any specific instructions or modifications..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={executeAction} className="flex-1">
                  Execute Action
                </Button>
                <Button variant="outline" onClick={() => setShowActionDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}