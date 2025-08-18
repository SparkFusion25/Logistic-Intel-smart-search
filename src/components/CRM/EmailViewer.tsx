import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Reply, RefreshCw, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmailViewerProps {
  isOpen: boolean;
  onClose: () => void;
  dealId?: string;
  contactEmail?: string;
}

interface Email {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  body: string;
  date: string;
  read: boolean;
}

export function EmailViewer({ isOpen, onClose, dealId, contactEmail }: EmailViewerProps) {
  const { toast } = useToast();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [composing, setComposing] = useState(false);
  const [replyTo, setReplyTo] = useState<Email | null>(null);
  const [emailForm, setEmailForm] = useState({
    to: contactEmail || '',
    subject: '',
    body: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchEmails();
    }
  }, [isOpen]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-integration', {
        body: { action: 'fetch' }
      });

      if (error) throw error;

      if (data?.success) {
        setEmails(data.emails || []);
      } else {
        throw new Error(data?.error || 'Failed to fetch emails');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast({
        title: "Error",
        description: "Failed to fetch emails",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!emailForm.to || !emailForm.subject || !emailForm.body) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-integration', {
        body: {
          action: replyTo ? 'reply' : 'send',
          email: emailForm.to,
          subject: emailForm.subject,
          body: emailForm.body,
          threadId: replyTo?.threadId,
          dealId
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Success",
          description: "Email sent successfully",
        });
        setComposing(false);
        setReplyTo(null);
        setEmailForm({ to: contactEmail || '', subject: '', body: '' });
        fetchEmails();
      } else {
        throw new Error(data?.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startReply = (email: Email) => {
    setReplyTo(email);
    setEmailForm({
      to: email.from,
      subject: email.subject.startsWith('Re: ') ? email.subject : `Re: ${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.from}\nSubject: ${email.subject}\n\n${email.body}`
    });
    setComposing(true);
  };

  const startNewEmail = () => {
    setReplyTo(null);
    setEmailForm({ to: contactEmail || '', subject: '', body: '' });
    setComposing(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Management
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Email History</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchEmails}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button size="sm" onClick={startNewEmail}>
                  <Send className="h-4 w-4 mr-2" />
                  New Email
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {emails.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No emails found. Connect your Gmail account to view emails.
                  </CardContent>
                </Card>
              ) : (
                emails.map((email) => (
                  <Card key={email.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={email.read ? "secondary" : "default"}>
                            {email.read ? "Read" : "Unread"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            From: {email.from}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(email.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-base">{email.subject}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {email.body}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startReply(email)}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {replyTo ? `Reply to: ${replyTo.subject}` : 'Compose New Email'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    value={emailForm.to}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, to: e.target.value }))}
                    placeholder="recipient@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Email subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Message</Label>
                  <Textarea
                    id="body"
                    value={emailForm.body}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="Type your message here..."
                    rows={8}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={sendEmail} disabled={loading}>
                    <Send className="h-4 w-4 mr-2" />
                    {loading ? 'Sending...' : 'Send Email'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setComposing(false);
                      setReplyTo(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Email tracking features will be available once Gmail integration is configured.
                  This will include open rates, click tracking, and response analytics.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}