import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Share2, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AffiliateRequestButton() {
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkExistingRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: requests } = await supabase
        .from('affiliate_requests')
        .select('status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (requests && requests.length > 0) {
        setRequestStatus(requests[0].status);
      }
    } catch (error) {
      console.error('Error checking request:', error);
    }
  };

  const submitRequest = async (formData: FormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('affiliate_requests')
        .insert({
          user_id: user.id,
          reason: formData.get('reason') as string,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your affiliate request has been submitted for review"
      });

      setRequestStatus('pending');
      setRequestOpen(false);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Check for existing request when component mounts
  useState(() => {
    checkExistingRequest();
  });

  if (requestStatus === 'approved') {
    return (
      <Button variant="outline" asChild>
        <a href="/affiliate-portal" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Access Affiliate Portal
        </a>
      </Button>
    );
  }

  if (requestStatus === 'pending') {
    return (
      <Badge variant="secondary" className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Request Pending Review
      </Badge>
    );
  }

  return (
    <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Become an Affiliate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Affiliate Access</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          submitRequest(new FormData(e.target as HTMLFormElement));
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Why do you want to become an affiliate?</Label>
              <Textarea 
                id="reason" 
                name="reason"
                placeholder="Tell us about your audience, marketing channels, or why you'd like to promote our platform..."
                required
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>As an affiliate, you'll be able to:</p>
              <ul className="list-disc ml-4 mt-2">
                <li>Create custom affiliate links</li>
                <li>Generate promo codes for your audience</li>
                <li>Track referrals and commissions</li>
                <li>Access detailed performance reports</li>
                <li>Receive monthly payouts via Stripe</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setRequestOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}