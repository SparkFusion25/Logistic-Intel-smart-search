import React, { useState } from 'react';
import { Mail, Send, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function EmailMiniCard() {
  const [open, setOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  const handleSend = () => {
    if (!emailData.to || !emailData.subject || !emailData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Mock email sending - in real app would integrate with email service
    toast.success('Email sent successfully!');
    setEmailData({ to: '', subject: '', message: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="card-glass p-6 flex flex-col items-center gap-3 min-h-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border-0 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-foreground block">Quick Email</span>
            <span className="text-xs text-muted-foreground">Compose & send</span>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Quick Email
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">To</label>
            <Input
              placeholder="recipient@example.com"
              value={emailData.to}
              onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Subject</label>
            <Input
              placeholder="Email subject"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Message</label>
            <Textarea
              placeholder="Your message..."
              value={emailData.message}
              onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSend} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}