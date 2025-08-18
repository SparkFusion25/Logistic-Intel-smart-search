"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  DollarSign, 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Ship,
  TrendingUp,
  Settings,
  Sparkles,
  Send,
  UserPlus,
  FileText,
  ExternalLink,
  Edit3,
  Save,
  Clock,
  Globe,
  Building2,
  Users,
  BarChart3,
  ArrowRight,
  MessageSquare,
  Target,
  Zap
} from "lucide-react";
import { SalesAssistant } from "./SalesAssistant";
import { OpportunityMeter } from "./OpportunityMeter";
import { LeadScoreChip } from "./LeadScoreChip";
import { ContactFields } from "./ContactFields";
import { useToast } from "@/hooks/use-toast";

interface ComprehensiveDealDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealId: string;
  companyData?: any;
}

export function ComprehensiveDealDrawer({ 
  open, 
  onOpenChange, 
  dealId, 
  companyData 
}: ComprehensiveDealDrawerProps) {
  const [dealData, setDealData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [isEnriching, setIsEnriching] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Enhanced mock deal data with comprehensive company information
  const mockDeal = {
    id: dealId,
    title: companyData?.name ? `${companyData.name} - Logistics Partnership` : "Ocean Import Deal",
    company_name: companyData?.name || "Global Logistics Corp",
    value_usd: companyData?.trade_volume_usd || 50000,
    currency: "USD",
    expected_close_date: "2025-03-15",
    status: "open",
    stage: "Prospect Identified",
    probability: 75,
    source: companyData?.source || "Search Intelligence",
    contact: {
      name: companyData?.contact?.name || "John Smith",
      email: companyData?.contact?.email || "john@globallogistics.com",
      phone: companyData?.contact?.phone || "+1 555-0123",
      title: companyData?.contact?.title || "Logistics Manager",
      linkedin: "https://linkedin.com/in/johnsmith"
    },
    company: {
      ...companyData,
      name: companyData?.name || "Global Logistics Corp",
      website: "https://globallogistics.com",
      employees: "500-1000",
      industry: companyData?.industry || "Logistics & Supply Chain",
      revenue: companyData?.revenue || "$50M - $100M",
      location: companyData?.location || "Los Angeles, CA",
      founded: "2010",
      description: "Leading logistics provider specializing in Asia-Pacific trade routes"
    },
    shipments: {
      total: companyData?.shipments || 1250,
      last_30_days: 125,
      recent: [
        { 
          id: "1",
          date: "2025-01-15", 
          type: "Ocean", 
          value: "$125K", 
          route: "Shanghai → Los Angeles",
          status: "In Transit",
          hs_code: "8517.12.00",
          weight: "2,500 kg"
        },
        { 
          id: "2",
          date: "2025-01-12", 
          type: "Air", 
          value: "$85K", 
          route: "Hong Kong → Chicago",
          status: "Delivered",
          hs_code: "8471.30.01",
          weight: "850 kg"
        },
        { 
          id: "3",
          date: "2025-01-08", 
          type: "Ocean", 
          value: "$200K", 
          route: "Rotterdam → New York",
          status: "Customs",
          hs_code: "8708.99.81",
          weight: "5,200 kg"
        }
      ],
      trends: {
        monthly_growth: "+12%",
        yearly_volume: "$2.4M",
        top_routes: ["Asia → US West Coast", "Europe → US East Coast"],
        avg_shipment_value: "$45K",
        preferred_mode: "Ocean (78%)"
      }
    },
    activities: [
      {
        id: "1",
        type: "email",
        date: "2025-01-16",
        description: "Sent initial proposal",
        user: "Sales Team"
      },
      {
        id: "2", 
        type: "call",
        date: "2025-01-14",
        description: "Discovery call with procurement team",
        user: "Account Manager"
      }
    ],
    notes: [
      {
        id: "1",
        date: "2025-01-16",
        content: "Company shows strong interest in our Asia-Pacific routes. Current provider contracts expire in Q2.",
        user: "Sales Rep"
      }
    ]
  };

  useEffect(() => {
    if (open) {
      setDealData(mockDeal);
      setEditedData(mockDeal);
    }
  }, [open, dealId]);

  const handleSave = async () => {
    try {
      // Save logic here
      setDealData(editedData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Deal updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update deal",
        variant: "destructive"
      });
    }
  };

  const handleEnrichContact = async () => {
    setIsEnriching(true);
    try {
      // Apollo API enrichment logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      toast({
        title: "Success",
        description: "Contact enriched with Apollo data"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enrich contact",
        variant: "destructive"
      });
    } finally {
      setIsEnriching(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      // Gmail/Outlook integration logic here
      window.open(`mailto:${dealData.contact.email}?subject=Re: ${dealData.title}&body=Hi ${dealData.contact.name},%0D%0A%0D%0AI wanted to follow up on our logistics partnership discussion...`, '_blank');
      toast({
        title: "Success",
        description: "Email composer opened"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open email composer",
        variant: "destructive"
      });
    }
  };

  const handleScheduleMeeting = async () => {
    try {
      // Calendar integration logic here
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting with ${dealData.contact.name}&details=Logistics partnership discussion&dates=20250120T100000Z/20250120T110000Z`;
      window.open(calendarUrl, '_blank');
      toast({
        title: "Success",
        description: "Calendar appointment created"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule meeting",
        variant: "destructive"
      });
    }
  };

  const handleCreateProposal = async () => {
    try {
      // Proposal generation logic here
      toast({
        title: "Success",
        description: "Proposal template generated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create proposal",
        variant: "destructive"
      });
    }
  };

  if (!dealData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full lg:max-w-[1200px] lg:h-[90vh] overflow-hidden p-0 flex flex-col">
        {/* Header Section */}
        <DialogHeader className="sticky top-0 bg-white border-b z-10 p-4 lg:p-6 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 lg:w-16 lg:h-16">
                <AvatarImage src={dealData.company?.logo} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                  {dealData.company_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl lg:text-2xl text-slate-900 mb-1">{dealData.company_name}</DialogTitle>
                <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                  <p className="text-sm text-slate-600">{dealData.company?.industry}</p>
                  <Badge variant="outline" className="text-xs">{dealData.stage}</Badge>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    {dealData.source}
                  </Badge>
                  <span className="text-lg lg:text-2xl font-bold text-green-600">${dealData.value_usd?.toLocaleString()}</span>
                  <span className="text-xs lg:text-sm text-slate-500">{dealData.probability}% probability</span>
                </div>
              </div>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <Save className="w-4 h-4 mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
              {isEditing ? "Save" : "Edit Deal"}
            </Button>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 lg:flex gap-2 lg:gap-3 mt-4">
            <Button onClick={handleSendEmail} className="text-xs lg:text-sm">
              <Mail className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Send Email
            </Button>
            <Button variant="outline" onClick={handleEnrichContact} disabled={isEnriching} className="text-xs lg:text-sm">
              <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              {isEnriching ? "Enriching..." : "Enrich"}
            </Button>
            <Button variant="outline" onClick={handleScheduleMeeting} className="text-xs lg:text-sm">
              <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Schedule Call
            </Button>
            <Button variant="outline" onClick={handleCreateProposal} className="text-xs lg:text-sm">
              <FileText className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Send Proposal
            </Button>
          </div>
        </DialogHeader>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4 lg:mb-6 shrink-0">
              <TabsTrigger value="overview" className="text-xs lg:text-sm px-2 lg:px-4">Overview</TabsTrigger>
              <TabsTrigger value="contact" className="text-xs lg:text-sm px-2 lg:px-4">Contact</TabsTrigger>
              <TabsTrigger value="shipments" className="text-xs lg:text-sm px-2 lg:px-4">Shipments</TabsTrigger>
              <TabsTrigger value="activities" className="text-xs lg:text-sm px-2 lg:px-4">Activities</TabsTrigger>
              <TabsTrigger value="email" className="text-xs lg:text-sm px-2 lg:px-4">Email</TabsTrigger>
              <TabsTrigger value="ai-assistant" className="text-xs lg:text-sm px-2 lg:px-4">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 lg:space-y-6 mt-0 flex-1 overflow-y-auto">
              {/* Key Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-sm">Deal Value</span>
                    </div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          type="number"
                          value={editedData.value_usd || ""}
                          onChange={(e) => setEditedData({...editedData, value_usd: Number(e.target.value)})}
                          placeholder="Deal value"
                          className="text-lg font-bold"
                        />
                        <Select value={editedData.currency || "USD"} onValueChange={(value) => setEditedData({...editedData, currency: value})}>
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg z-50">
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                  ) : (
                    <div className="text-2xl font-bold text-green-700">
                      ${dealData.value_usd?.toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-sm">Probability</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">{dealData.probability}%</div>
                  <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${dealData.probability}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-sm">Close Date</span>
                  </div>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedData.expected_close_date || ""}
                      onChange={(e) => setEditedData({...editedData, expected_close_date: e.target.value})}
                      className="text-lg font-semibold"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-orange-700">
                      {new Date(dealData.expected_close_date).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ship className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-sm">Shipments</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">{dealData.shipments.last_30_days}</div>
                  <div className="text-xs text-purple-600">Last 30 days</div>
                </CardContent>
              </Card>
            </div>

              {/* Company Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Website</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <a href={dealData.company?.website} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline text-sm break-all">
                          {dealData.company?.website}
                        </a>
                      </div>
                    </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Employees</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{dealData.company?.employees}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Revenue</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <BarChart3 className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{dealData.company?.revenue}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Location</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{dealData.company?.location}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Founded</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{dealData.company?.founded}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Industry</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{dealData.company?.industry}</span>
                    </div>
                  </div>
                </div>
                {dealData.company?.description && (
                  <div className="mt-4 pt-4 border-t">
                    <Label className="text-sm font-medium text-slate-600">Description</Label>
                    <p className="text-sm text-slate-700 mt-1">{dealData.company.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lead Score & Opportunity Meter */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Lead Score</span>
                    <LeadScoreChip score={78} />
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div>• Strong trade volume history</div>
                    <div>• Active shipping patterns</div>
                    <div>• Geographic match</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <OpportunityMeter score={78} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Primary Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                      {dealData.contact?.name?.substring(0, 2).toUpperCase() || "JD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{dealData.contact?.name}</h3>
                    <p className="text-slate-600">{dealData.contact?.title}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <a href={`mailto:${dealData.contact?.email}`} 
                         className="flex items-center gap-1 text-blue-600 hover:underline">
                        <Mail className="w-4 h-4" />
                        {dealData.contact?.email}
                      </a>
                      <a href={`tel:${dealData.contact?.phone}`} 
                         className="flex items-center gap-1 text-blue-600 hover:underline">
                        <Phone className="w-4 h-4" />
                        {dealData.contact?.phone}
                      </a>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleEnrichContact} disabled={isEnriching}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isEnriching ? "Enriching..." : "Enrich with Apollo"}
                  </Button>
                  <Button variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    PhantomBuster
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Find More Contacts</CardTitle>
                <CardDescription>Discover additional decision-makers at this company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find Procurement Team
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find Supply Chain Directors
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find C-Level Executives
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipments" className="space-y-6">
            {/* Shipment Overview */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ship className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-sm">Total Shipments</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{dealData.shipments.total}</div>
                  <div className="text-xs text-blue-600">All time</div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-sm">Growth</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {dealData.shipments.trends.monthly_growth}
                  </div>
                  <div className="text-xs text-green-600">Month over month</div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-sm">Avg Value</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    {dealData.shipments.trends.avg_shipment_value}
                  </div>
                  <div className="text-xs text-purple-600">Per shipment</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Shipments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Shipments</CardTitle>
                <CardDescription>Latest shipment activity for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dealData.shipments.recent.map((shipment: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={shipment.type === 'Ocean' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {shipment.type}
                          </Badge>
                          <span className="font-medium">{shipment.route}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{shipment.value}</div>
                          <div className="text-xs text-slate-500">{shipment.date}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">Status:</span> {shipment.status}
                        </div>
                        <div>
                          <span className="font-medium">HS Code:</span> {shipment.hs_code}
                        </div>
                        <div>
                          <span className="font-medium">Weight:</span> {shipment.weight}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trade Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Trade Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Top Routes</Label>
                    <div className="mt-2 space-y-1">
                      {dealData.shipments.trends.top_routes.map((route: string, index: number) => (
                        <div key={index} className="text-sm">{route}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Preferred Mode</Label>
                    <div className="mt-2 text-sm">{dealData.shipments.trends.preferred_mode}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Call
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Add Note
              </Button>
              <Button variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Send Proposal
              </Button>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dealData.activities.map((activity: any) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {activity.type === 'email' ? 
                          <Mail className="w-4 h-4 text-blue-600" /> : 
                          <Phone className="w-4 h-4 text-blue-600" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{activity.description}</span>
                          <span className="text-xs text-slate-500">{activity.date}</span>
                        </div>
                        <div className="text-sm text-slate-600">{activity.user}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dealData.notes.map((note: any) => (
                    <div key={note.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="text-sm">{note.content}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {note.user} • {note.date}
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <Textarea placeholder="Add a note..." className="mb-2" />
                    <Button size="sm">Add Note</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button>
                    <Mail className="w-4 h-4 mr-2" />
                    Compose Email
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Email Templates
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-3">Recent Email Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">Initial proposal sent</span>
                      <span className="text-xs text-slate-500">2 days ago</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm">Follow-up email opened</span>
                      <span className="text-xs text-slate-500">1 day ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-6">
            <SalesAssistant subjectType="deal" subjectId={dealId} />
          </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}