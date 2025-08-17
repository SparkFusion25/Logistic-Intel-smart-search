import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Save, Paperclip } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailComposerProps {
  contact?: {
    name?: string;
    email?: string;
    company?: string;
  };
  onClose?: () => void;
}

export function EmailComposer({ contact, onClose }: EmailComposerProps) {
  const [to, setTo] = useState(contact?.email || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const generateAIContent = async (type: 'subject' | 'body') => {
    setGeneratingAI(true);
    try {
      const prompt = type === 'subject' 
        ? `Generate a professional email subject line for reaching out to ${contact?.name} at ${contact?.company} about our logistics services.`
        : `Generate a professional email body for reaching out to ${contact?.name} at ${contact?.company}. Keep it concise, mention our logistics intelligence platform, and include a clear call to action.`;

      const { data, error } = await supabase.functions.invoke('assistant-apply', {
        body: { prompt, type: 'email_generation' },
        headers: { 'Content-Type': 'application/json' }
      });

      if (error) {
        console.error('Error generating AI content:', error);
        toast.error('Failed to generate AI content');
        return;
      }

      if (data?.content) {
        if (type === 'subject') {
          setSubject(data.content);
        } else {
          setBody(data.content);
        }
        toast.success('AI content generated successfully');
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast.error('Failed to generate AI content');
    } finally {
      setGeneratingAI(false);
    }
  };

  const generateSuggestions = async () => {
    setGeneratingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('assistant-apply', {
        body: { 
          prompt: `Generate 3 different email approaches for ${contact?.name} at ${contact?.company}`,
          type: 'email_suggestions' 
        },
        headers: { 'Content-Type': 'application/json' }
      });

      if (error) {
        console.error('Error generating suggestions:', error);
        toast.error('Failed to generate suggestions');
        return;
      }

      if (data?.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate suggestions');
    } finally {
      setGeneratingAI(false);
    }
  };

  const sendEmail = async () => {
    if (!to || !subject || !body) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Here you would integrate with your email sending service
      toast.success('Email sent successfully');
      onClose?.();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Compose Email
          {contact && (
            <Badge variant="outline">
              To: {contact.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Suggestions Panel */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI Writing Assistant</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateAIContent('subject')}
              disabled={generatingAI}
            >
              Generate Subject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateAIContent('body')}
              disabled={generatingAI}
            >
              Generate Email
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={generateSuggestions}
              disabled={generatingAI}
            >
              Get Suggestions
            </Button>
          </div>
          
          {aiSuggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              <span className="text-xs font-medium text-muted-foreground">AI Suggestions:</span>
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="text-xs p-2 bg-white rounded border cursor-pointer hover:bg-gray-50"
                  onClick={() => setBody(suggestion)}
                >
                  {suggestion.substring(0, 100)}...
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">To</label>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@company.com"
              type="email"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Subject</label>
            <div className="flex gap-2">
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="flex-1"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => generateAIContent('subject')}
                disabled={generatingAI}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Message</label>
            <div className="relative">
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email message..."
                rows={8}
                className="resize-none"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => generateAIContent('body')}
                disabled={generatingAI}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <Paperclip className="h-4 w-4 mr-1" />
              Attach
            </Button>
            <Button size="sm" variant="ghost">
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={sendEmail} disabled={generatingAI}>
              <Send className="h-4 w-4 mr-1" />
              Send Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}