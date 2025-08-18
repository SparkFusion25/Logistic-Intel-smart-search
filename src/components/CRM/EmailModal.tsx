import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, Paperclip } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactEmail?: string;
  contactName?: string;
  dealId?: string;
  templateType?: 'proposal' | 'followup' | 'general';
}

const emailTemplates = {
  proposal: {
    subject: 'Business Proposal - {{company_name}}',
    body: `Dear {{contact_name}},

I hope this email finds you well. Following our recent discussions, I'm pleased to present our proposal for {{company_name}}.

Based on your shipping requirements and our analysis of your trade patterns, we believe our logistics solutions can provide significant value to your operations.

Key benefits include:
• Cost savings of up to 15-20% on your current shipping costs
• Improved delivery times through our optimized routing
• Enhanced tracking and visibility across all shipments
• Dedicated account management and 24/7 support

I've attached a detailed proposal document for your review. I would be happy to schedule a call to discuss this further and answer any questions you may have.

Best regards,
{{sender_name}}`
  },
  followup: {
    subject: 'Following up on our conversation - {{company_name}}',
    body: `Hi {{contact_name}},

I wanted to follow up on our recent conversation about {{company_name}}'s logistics needs.

Our team has been analyzing your shipping patterns and we've identified several opportunities to optimize your supply chain operations.

Would you be available for a brief call this week to discuss how we can help streamline your logistics processes?

Best regards,
{{sender_name}}`
  },
  general: {
    subject: 'Regarding {{company_name}}',
    body: `Dear {{contact_name}},

I hope you're doing well. I wanted to reach out regarding {{company_name}} and explore potential opportunities for collaboration.

Best regards,
{{sender_name}}`
  }
};

export function EmailModal({ isOpen, onClose, contactEmail, contactName, dealId, templateType = 'general' }: EmailModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    to: contactEmail || '',
    subject: emailTemplates[templateType].subject,
    body: emailTemplates[templateType].body,
    template: templateType
  });

  const handleSend = async () => {
    if (!emailData.to || !emailData.subject || !emailData.body) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject
            .replace('{{contact_name}}', contactName || 'there')
            .replace('{{company_name}}', contactName?.split(' ')[0] || 'your company')
            .replace('{{sender_name}}', 'Your Sales Team'),
          body: emailData.body
            .replace('{{contact_name}}', contactName || 'there')
            .replace('{{company_name}}', contactName?.split(' ')[0] || 'your company')
            .replace('{{sender_name}}', 'Your Sales Team'),
          dealId: dealId
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully"
      });
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Compose Email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="template">Email Template</Label>
            <Select 
              value={emailData.template} 
              onValueChange={(value: 'proposal' | 'followup' | 'general') => {
                setEmailData({
                  ...emailData,
                  template: value,
                  subject: emailTemplates[value].subject,
                  body: emailTemplates[value].body
                });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Email</SelectItem>
                <SelectItem value="proposal">Business Proposal</SelectItem>
                <SelectItem value="followup">Follow Up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="email"
              value={emailData.to}
              onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
              placeholder="recipient@company.com"
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              placeholder="Email subject"
            />
          </div>

          <div>
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              placeholder="Your message here..."
              rows={12}
              className="resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              Attach File
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={loading}>
                {loading ? 'Sending...' : 'Send Email'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}