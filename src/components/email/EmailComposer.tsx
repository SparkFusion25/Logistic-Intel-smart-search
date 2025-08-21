import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Paperclip, Save, Send } from 'lucide-react';

interface EmailComposerProps {
  onClose?: () => void;
}

export default function EmailComposer({ onClose }: EmailComposerProps) {
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSend = () => {
    console.log('Sending email:', { to, subject, message });
    onClose?.();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Compose Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to" className="text-sm font-medium">To</Label>
              <Input
                id="to"
                type="email"
                placeholder="recipient@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="min-h-[44px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="min-h-[44px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message..."
                className="min-h-[200px] sm:min-h-[300px] resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          
          {/* Mobile-optimized action buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="min-h-[44px] touch-manipulation">
                <Paperclip className="h-4 w-4 mr-2" />
                Attach
              </Button>
              <Button variant="outline" size="sm" className="min-h-[44px] touch-manipulation">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              {onClose && (
                <Button variant="outline" onClick={onClose} className="min-h-[44px] touch-manipulation">
                  Cancel
                </Button>
              )}
              <Button onClick={handleSend} className="min-h-[44px] touch-manipulation">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}