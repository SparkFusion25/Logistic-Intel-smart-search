import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EmailComposerProps {
  onClose?: () => void;
}

export default function EmailComposer({ onClose }: EmailComposerProps) {
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSend = () => {
    console.log('Sending email:', { to, subject, message });
    if (onClose) onClose();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Compose Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">To</label>
          <Input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Enter email address"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Subject</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Message</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="min-h-[200px] w-full resize-none"
          />
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 000-2.828z" />
            </svg>
            Attach
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">Save Draft</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSend} className="bg-primary text-primary-foreground hover:opacity-90">
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}