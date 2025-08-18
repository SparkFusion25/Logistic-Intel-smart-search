import { useState } from "react";
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
  Calculator
} from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8" style={{ background: 'var(--sidebar-background)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 -translate-y-48 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-white/80 text-lg">
                  Manage users, affiliates, and system operations
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <Select defaultValue="7d">
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/20 hover:bg-white/30">
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {systemStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    <span className="text-sm text-slate-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Referrals</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {affiliateData.map((affiliate) => (
                        <TableRow key={affiliate.id}>
                          <TableCell className="font-medium">{affiliate.name}</TableCell>
                          <TableCell>{affiliate.email}</TableCell>
                          <TableCell>{affiliate.commissionRate}</TableCell>
                          <TableCell>{affiliate.referrals}</TableCell>
                          <TableCell className="font-semibold text-green-600">{affiliate.totalEarnings}</TableCell>
                          <TableCell>
                            <Badge variant={affiliate.status === 'Active' ? 'default' : 'secondary'}>
                              {affiliate.status}
                            </Badge>
                          </TableCell>
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
                                      <p className="text-sm text-slate-600">{selectedAffiliate?.name}</p>
                                    </div>
                                    <div>
                                      <Label>Current Earnings</Label>
                                      <p className="text-lg font-semibold text-green-600">{selectedAffiliate?.totalEarnings}</p>
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
                                          <SelectItem value="paypal">PayPal</SelectItem>
                                          <SelectItem value="stripe">Stripe</SelectItem>
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
    </div>
  );
}