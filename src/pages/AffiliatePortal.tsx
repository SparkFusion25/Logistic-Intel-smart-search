import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Link as LinkIcon,
  Copy,
  Eye,
  Edit,
  Plus,
  Upload,
  BarChart3,
  Gift,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AffiliatePortal() {
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [affiliateLinks, setAffiliateLinks] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLinkOpen, setNewLinkOpen] = useState(false);
  const [newPromoOpen, setNewPromoOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load affiliate profile
      const { data: profile } = await supabase
        .from('affiliate_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setAffiliateData(profile);

      if (profile) {
        // Load affiliate links
        const { data: links } = await supabase
          .from('affiliate_links')
          .select('*')
          .eq('affiliate_id', profile.id);
        setAffiliateLinks(links || []);

        // Load promo codes
        const { data: codes } = await supabase
          .from('affiliate_promo_codes')
          .select('*')
          .eq('affiliate_id', profile.id);
        setPromoCodes(codes || []);

        // Load referrals
        const { data: refs } = await supabase
          .from('affiliate_referrals')
          .select('*')
          .eq('affiliate_id', profile.id);
        setReferrals(refs || []);

        // Load payouts
        const { data: pays } = await supabase
          .from('affiliate_payouts')
          .select('*')
          .eq('affiliate_id', profile.id);
        setPayouts(pays || []);
      }
    } catch (error) {
      console.error('Error loading affiliate data:', error);
      toast({
        title: "Error",
        description: "Failed to load affiliate data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAffiliateLink = async (formData: FormData) => {
    try {
      const { data, error } = await supabase.functions.invoke('affiliate-links', {
        body: {
          action: 'create',
          link_name: formData.get('link_name'),
          base_url: formData.get('base_url')
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Affiliate link created successfully"
      });

      setNewLinkOpen(false);
      loadAffiliateData();
    } catch (error) {
      console.error('Error creating link:', error);
      toast({
        title: "Error",
        description: "Failed to create affiliate link",
        variant: "destructive"
      });
    }
  };

  const createPromoCode = async (formData: FormData) => {
    try {
      const { data, error } = await supabase.functions.invoke('affiliate-promo-codes', {
        body: {
          action: 'create',
          code: formData.get('code'),
          discount_type: formData.get('discount_type'),
          discount_value: formData.get('discount_value'),
          max_uses: formData.get('max_uses'),
          expires_at: formData.get('expires_at')
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Promo code created successfully"
      });

      setNewPromoOpen(false);
      loadAffiliateData();
    } catch (error) {
      console.error('Error creating promo code:', error);
      toast({
        title: "Error",
        description: "Failed to create promo code",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!affiliateData) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Affiliate Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to be approved as an affiliate to access this portal.
            </p>
            <Button asChild>
              <a href="/dashboard/settings">Request Affiliate Access</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalEarnings = referrals.reduce((sum, ref) => sum + (ref.commission_earned || 0), 0);
  const pendingPayouts = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const clicksThisMonth = affiliateLinks.reduce((sum, link) => sum + (link.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8" style={{ background: 'var(--sidebar-background)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={affiliateData.avatar_url} />
                  <AvatarFallback className="bg-white/20 text-white text-lg">
                    {affiliateData.user_email?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Affiliate Portal
                  </h1>
                  <p className="text-white/80">
                    Commission Rate: {affiliateData.commission_rate}% | Status: 
                    <Badge className="ml-2" variant={affiliateData.status === 'approved' ? 'default' : 'secondary'}>
                      {affiliateData.status}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-slate-900">${totalEarnings.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Referrals</p>
                  <p className="text-2xl font-bold text-slate-900">{referrals.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Clicks This Month</p>
                  <p className="text-2xl font-bold text-slate-900">{clicksThisMonth}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Payouts</p>
                  <p className="text-2xl font-bold text-slate-900">${pendingPayouts.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="links" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="promo">Promo Codes</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="links">
            <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Affiliate Links
                  </CardTitle>
                  <Dialog open={newLinkOpen} onOpenChange={setNewLinkOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Link
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Affiliate Link</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        createAffiliateLink(new FormData(e.target as HTMLFormElement));
                      }}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="link_name">Link Name</Label>
                            <Input id="link_name" name="link_name" placeholder="Homepage Link" required />
                          </div>
                          <div>
                            <Label htmlFor="base_url">Base URL</Label>
                            <Input id="base_url" name="base_url" placeholder="https://example.com/signup" required />
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" className="flex-1">Create Link</Button>
                            <Button type="button" variant="outline" onClick={() => setNewLinkOpen(false)}>Cancel</Button>
                          </div>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Conversions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {affiliateLinks.map((link: any) => (
                        <TableRow key={link.id}>
                          <TableCell className="font-medium">{link.link_name}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {link.base_url}?ref={link.tracking_code}
                          </TableCell>
                          <TableCell>{link.clicks || 0}</TableCell>
                          <TableCell>{link.conversions || 0}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyToClipboard(`${link.base_url}?ref=${link.tracking_code}`)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promo">
            <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Promo Codes
                  </CardTitle>
                  <Dialog open={newPromoOpen} onOpenChange={setNewPromoOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Promo Code</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        createPromoCode(new FormData(e.target as HTMLFormElement));
                      }}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="code">Promo Code</Label>
                            <Input id="code" name="code" placeholder="SAVE20" required />
                          </div>
                          <div>
                            <Label htmlFor="discount_type">Discount Type</Label>
                            <select id="discount_type" name="discount_type" className="w-full p-2 border rounded" required>
                              <option value="percentage">Percentage</option>
                              <option value="fixed">Fixed Amount</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="discount_value">Discount Value</Label>
                            <Input id="discount_value" name="discount_value" type="number" step="0.01" required />
                          </div>
                          <div>
                            <Label htmlFor="max_uses">Max Uses</Label>
                            <Input id="max_uses" name="max_uses" type="number" />
                          </div>
                          <div>
                            <Label htmlFor="expires_at">Expires At</Label>
                            <Input id="expires_at" name="expires_at" type="datetime-local" />
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" className="flex-1">Create Code</Button>
                            <Button type="button" variant="outline" onClick={() => setNewPromoOpen(false)}>Cancel</Button>
                          </div>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Uses</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promoCodes.map((code: any) => (
                        <TableRow key={code.id}>
                          <TableCell className="font-medium font-mono">{code.code}</TableCell>
                          <TableCell>
                            {code.discount_type === 'percentage' 
                              ? `${code.discount_value}%` 
                              : `$${code.discount_value}`
                            }
                          </TableCell>
                          <TableCell>{code.current_uses}/{code.max_uses || '∞'}</TableCell>
                          <TableCell>
                            <Badge variant={code.is_active ? 'default' : 'secondary'}>
                              {code.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyToClipboard(code.code)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Referrals & Commissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.map((referral: any) => (
                        <TableRow key={referral.id}>
                          <TableCell>{new Date(referral.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{referral.referred_user_id}</TableCell>
                          <TableCell>${referral.conversion_value || 0}</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            ${referral.commission_earned || 0}
                          </TableCell>
                          <TableCell>
                            <Badge variant={referral.status === 'confirmed' ? 'default' : 'secondary'}>
                              {referral.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payout History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Processed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payouts.map((payout: any) => (
                        <TableRow key={payout.id}>
                          <TableCell>
                            {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-semibold">${payout.amount}</TableCell>
                          <TableCell className="capitalize">{payout.payment_method}</TableCell>
                          <TableCell>
                            <Badge variant={payout.status === 'completed' ? 'default' : 'secondary'}>
                              {payout.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {payout.processed_at ? new Date(payout.processed_at).toLocaleDateString() : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Affiliate Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell us about yourself..."
                        defaultValue={affiliateData.bio}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website_url">Website URL</Label>
                      <Input 
                        id="website_url" 
                        placeholder="https://your-website.com"
                        defaultValue={affiliateData.website_url}
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment_email">Payment Email</Label>
                      <Input 
                        id="payment_email" 
                        type="email"
                        placeholder="payments@example.com"
                        defaultValue={affiliateData.payment_email}
                      />
                    </div>
                    <div>
                      <Label>Avatar</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={affiliateData.avatar_url} />
                          <AvatarFallback>
                            {affiliateData.user_email?.charAt(0).toUpperCase() || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload New
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full md:w-auto">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}