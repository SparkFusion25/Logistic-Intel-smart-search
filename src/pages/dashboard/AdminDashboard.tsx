import { useState, useEffect } from "react";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  Settings, 
  UserPlus, 
  Database, 
  FileBarChart, 
  CreditCard,
  Share2,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Calculator,
  Globe,
  Type,
  Image as ImageIcon,
  Save,
  RefreshCw
} from "lucide-react";
import { BulkImportManager } from "@/components/admin/BulkImportManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const systemStats = [
  { name: "Total Users", value: "2,486", change: "+12%", icon: Users },
  { name: "Monthly Revenue", value: "$45,230", change: "+8%", icon: DollarSign },
  { name: "Active Sessions", value: "127", change: "+3%", icon: TrendingUp },
  { name: "System Alerts", value: "3", change: "-2", icon: AlertTriangle },
];

const recentUsers = [
  { id: 1, name: "John Smith", email: "john@company.com", plan: "Enterprise", status: "Active", joinedAt: "2024-01-15" },
  { id: 2, name: "Sarah Johnson", email: "sarah@startup.com", plan: "Pro", status: "Active", joinedAt: "2024-01-14" },
  { id: 3, name: "Mike Chen", email: "mike@logistics.com", plan: "Free", status: "Inactive", joinedAt: "2024-01-13" },
  { id: 4, name: "Emma Davis", email: "emma@freight.com", plan: "Pro", status: "Active", joinedAt: "2024-01-12" },
  { id: 5, name: "Alex Wilson", email: "alex@shipping.com", plan: "Enterprise", status: "Active", joinedAt: "2024-01-11" },
];

const systemAlerts = [
  { id: 1, type: "warning", message: "High API usage detected", time: "2 hours ago", severity: "medium" },
  { id: 2, type: "error", message: "Database connection timeout", time: "4 hours ago", severity: "high" },
  { id: 3, type: "info", message: "Scheduled maintenance completed", time: "1 day ago", severity: "low" },
];

const affiliateData = [
  { 
    id: 1, 
    name: "FreightForwarder Pro", 
    email: "contact@ffpro.com", 
    commissionRate: "10%", 
    totalEarnings: "$2,450", 
    referrals: 15, 
    status: "Active",
    joinedAt: "2023-12-01"
  },
  { 
    id: 2, 
    name: "LogiPartners", 
    email: "team@logipartners.com", 
    commissionRate: "8%", 
    totalEarnings: "$1,890", 
    referrals: 12, 
    status: "Active",
    joinedAt: "2023-11-15"
  },
  { 
    id: 3, 
    name: "ShipSmart Solutions", 
    email: "info@shipsmart.com", 
    commissionRate: "12%", 
    totalEarnings: "$3,220", 
    referrals: 22, 
    status: "Pending",
    joinedAt: "2024-01-05"
  },
];

const topPlans = [
  { name: "Enterprise", users: 245, revenue: "$24,500", growth: "+15%" },
  { name: "Pro", users: 1890, revenue: "$18,900", growth: "+8%" },
  { name: "Free", users: 351, revenue: "$0", growth: "+25%" },
];

function getAlertIcon(type: string) {
  switch (type) {
    case "error": return AlertTriangle;
    case "warning": return AlertTriangle;
    case "info": return TrendingUp;
    default: return AlertTriangle;
  }
}

function getAlertBg(type: string) {
  switch (type) {
    case "error": 
      return "bg-red-50 border-red-200";
    case "warning": 
      return "bg-yellow-50 border-yellow-200";
    case "info": 
      return "bg-blue-50 border-blue-200";
    default: 
      return "bg-gray-50 border-gray-200";
  }
}

export function AdminDashboard() {
  const [newAffiliateOpen, setNewAffiliateOpen] = useState(false);
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);
  const [siteContent, setSiteContent] = useState<any>({});
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [selectedContentKey, setSelectedContentKey] = useState('');
  const [realAffiliates, setRealAffiliates] = useState([]);
  const [affiliateRequests, setAffiliateRequests] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = async () => {
    try {
      // Load site content
      const { data: content } = await supabase
        .from('site_content')
        .select('*');
      
      const contentMap = {};
      content?.forEach(item => {
        if (!contentMap[item.page_slug]) contentMap[item.page_slug] = {};
        contentMap[item.page_slug][item.section_key] = item.content_value;
      });
      setSiteContent(contentMap);

      // Load affiliate profiles
      const { data: affiliates } = await supabase
        .from('affiliate_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      setRealAffiliates(affiliates || []);

      // Load affiliate requests
      const { data: requests } = await supabase
        .from('affiliate_requests')
        .select('*')
        .order('created_at', { ascending: false });
      setAffiliateRequests(requests || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const updateSiteContent = async (pageSlug: string, sectionKey: string, value: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('site_content')
        .upsert({
          page_slug: pageSlug,
          section_key: sectionKey,
          content_type: 'text',
          content_value: value,
          updated_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content updated successfully"
      });

      loadRealData();
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive"
      });
    }
  };

  const approveAffiliateRequest = async (requestId: string, approve: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.functions.invoke('admin-affiliate-actions', {
        body: {
          action: approve ? 'approve_request' : 'reject_request',
          request_id: requestId
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Request ${approve ? 'approved' : 'rejected'} successfully`
      });

      loadRealData();
    } catch (error) {
      console.error('Error processing request:', error);
      toast({
        title: "Error",
        description: "Failed to process request",
        variant: "destructive"
      });
    }
  };

  return (
    <AppShell>
      {/* Header Section - Compact User-Style Hero */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Monitor system performance and platform health</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-3 py-2 border border-border rounded-lg bg-background text-sm">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 24 hours</option>
              </select>
              <Button size="sm" variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {systemStats.map((stat) => (
          <Card key={stat.name} className="p-4 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">{stat.name}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">{stat.change}</span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

        {/* Main Content Tabs */}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Bulk Import Manager */}
            <BulkImportManager />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Alerts */}
              <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemAlerts.map((alert) => {
                    const Icon = getAlertIcon(alert.type);
                    return (
                      <div key={alert.id} className={`p-4 rounded-lg border ${getAlertBg(alert.type)}`}>
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-slate-500">{alert.time}</p>
                          </div>
                          <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                            {alert.severity}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Top Plans */}
              <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Plan Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topPlans.map((plan) => (
                    <div key={plan.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-sm text-slate-500">{plan.users} users</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{plan.revenue}</p>
                        <p className="text-sm text-green-600">{plan.growth}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Users */}
            <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.plan === 'Enterprise' ? 'default' : user.plan === 'Pro' ? 'secondary' : 'outline'}>
                              {user.plan}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.joinedAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-500" />
                      Site Content Management
                    </CardTitle>
                    <CardDescription>
                      Manage all website content, titles, and text across different pages
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Home Page Content */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Home Page
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="hero_title">Hero Title</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="hero_title"
                            defaultValue={siteContent.home?.hero_title || 'Global Trade Intelligence Platform'}
                            placeholder="Main hero title"
                          />
                          <Button 
                            size="sm"
                            onClick={() => {
                              const input = document.getElementById('hero_title') as HTMLInputElement;
                              updateSiteContent('home', 'hero_title', input.value);
                            }}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                        <div className="flex gap-2">
                          <Textarea 
                            id="hero_subtitle"
                            defaultValue={siteContent.home?.hero_subtitle || 'Discover hidden opportunities in global supply chains'}
                            placeholder="Hero subtitle/description"
                          />
                          <Button 
                            size="sm"
                            onClick={() => {
                              const input = document.getElementById('hero_subtitle') as HTMLTextAreaElement;
                              updateSiteContent('home', 'hero_subtitle', input.value);
                            }}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cta_primary">Primary CTA Text</Label>
                          <div className="flex gap-2">
                            <Input 
                              id="cta_primary"
                              defaultValue={siteContent.home?.cta_primary || 'Start Free Trial'}
                              placeholder="Primary button text"
                            />
                            <Button 
                              size="sm"
                              onClick={() => {
                                const input = document.getElementById('cta_primary') as HTMLInputElement;
                                updateSiteContent('home', 'cta_primary', input.value);
                              }}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cta_secondary">Secondary CTA Text</Label>
                          <div className="flex gap-2">
                            <Input 
                              id="cta_secondary"
                              defaultValue={siteContent.home?.cta_secondary || 'Watch Demo'}
                              placeholder="Secondary button text"
                            />
                            <Button 
                              size="sm"
                              onClick={() => {
                                const input = document.getElementById('cta_secondary') as HTMLInputElement;
                                updateSiteContent('home', 'cta_secondary', input.value);
                              }}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Page Content */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pricing Page
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {['trial', 'starter', 'pro', 'enterprise'].map((plan) => (
                        <div key={plan}>
                          <Label htmlFor={`${plan}_title`}>{plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Title</Label>
                          <div className="flex gap-2">
                            <Input 
                              id={`${plan}_title`}
                              defaultValue={siteContent.pricing?.[`${plan}_title`] || plan.charAt(0).toUpperCase() + plan.slice(1)}
                              placeholder={`${plan} plan title`}
                            />
                            <Button 
                              size="sm"
                              onClick={() => {
                                const input = document.getElementById(`${plan}_title`) as HTMLInputElement;
                                updateSiteContent('pricing', `${plan}_title`, input.value);
                              }}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Manage Images
                      </Button>
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4 mr-2" />
                        SEO Settings
                      </Button>
                      <Button variant="outline" size="sm">
                        <Type className="h-4 w-4 mr-2" />
                        Typography
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliates" className="space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-purple-500" />
                      Affiliate Management
                    </CardTitle>
                    <CardDescription>
                      Manage affiliate partners, track performance, and process payouts
                    </CardDescription>
                  </div>
                  <Dialog open={newAffiliateOpen} onOpenChange={setNewAffiliateOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Affiliate
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Affiliate</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="affiliate-name">Name/Company</Label>
                          <Input id="affiliate-name" placeholder="Enter affiliate name" />
                        </div>
                        <div>
                          <Label htmlFor="affiliate-email">Email</Label>
                          <Input id="affiliate-email" type="email" placeholder="Enter email address" />
                        </div>
                        <div>
                          <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                          <Input id="commission-rate" type="number" placeholder="10" />
                        </div>
                        <div>
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea id="notes" placeholder="Additional notes..." />
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1">Create Affiliate</Button>
                          <Button variant="outline" onClick={() => setNewAffiliateOpen(false)}>Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Affiliate Requests */}
                  <div>
                    <h3 className="font-semibold mb-4">Pending Affiliate Requests</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {affiliateRequests.filter(req => req.status === 'pending').map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">{request.user_id}</TableCell>
                              <TableCell className="max-w-xs truncate">{request.reason || 'No reason provided'}</TableCell>
                              <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => approveAffiliateRequest(request.id, true)}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => approveAffiliateRequest(request.id, false)}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Active Affiliates */}
                  <div>
                    <h3 className="font-semibold mb-4">Active Affiliates</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {realAffiliates.map((affiliate) => (
                            <TableRow key={affiliate.id}>
                              <TableCell className="font-medium">{affiliate.user_id}</TableCell>
                              <TableCell>{affiliate.commission_rate}%</TableCell>
                              <TableCell>
                                <Badge variant={affiliate.status === 'approved' ? 'default' : 'secondary'}>
                                  {affiliate.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(affiliate.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setSelectedAffiliate(affiliate)}
                                      >
                                        <Calculator className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Process Payout</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div>
                                          <Label>Affiliate</Label>
                                          <p className="text-sm text-slate-600">{selectedAffiliate?.user_id}</p>
                                        </div>
                                         <div>
                                           <Label>Commission Rate</Label>
                                           <p className="text-sm text-slate-600">{selectedAffiliate?.commission_rate}%</p>
                                         </div>
                                         <div>
                                           <Label htmlFor="payout-amount">Payout Amount</Label>
                                           <Input id="payout-amount" placeholder="Enter amount" />
                                         </div>
                                         <div>
                                           <Label htmlFor="payout-method">Payment Method</Label>
                                           <Select>
                                             <SelectTrigger>
                                               <SelectValue placeholder="Select payment method" />
                                             </SelectTrigger>
                                             <SelectContent>
                                               <SelectItem value="stripe">Stripe</SelectItem>
                                               <SelectItem value="paypal">PayPal</SelectItem>
                                               <SelectItem value="bank">Bank Transfer</SelectItem>
                                             </SelectContent>
                                           </Select>
                                         </div>
                                         <div className="flex gap-2">
                                           <Button className="flex-1">Process Payout</Button>
                                           <Button variant="outline">Cancel</Button>
                                         </div>
                                       </div>
                                     </DialogContent>
                                   </Dialog>
                                 </div>
                               </TableCell>
                             </TableRow>
                           ))}
                         </TableBody>
                       </Table>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">User management features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">System configuration options will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Admin Actions */}
        <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                <UserPlus className="h-6 w-6" />
                <span className="text-sm">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                <Database className="h-6 w-6" />
                <span className="text-sm">Data Sources</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                <FileBarChart className="h-6 w-6" />
                <span className="text-sm">Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                <CreditCard className="h-6 w-6" />
                <span className="text-sm">Billing</span>
              </Button>
            </div>
          </CardContent>
        </Card>
            </div>
    </AppShell>
  );
}