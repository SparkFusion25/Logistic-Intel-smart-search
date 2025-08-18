"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Save
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
  const { toast } = useToast();

  // Mock deal data with shipment information
  const mockDeal = {
    id: dealId,
    title: companyData?.name || "Ocean Import Deal",
    company_name: companyData?.name || "Global Logistics Corp",
    value_usd: companyData?.trade_volume_usd || 50000,
    currency: "USD",
    expected_close_date: "2025-01-31",
    status: "open",
    stage: "Proposal Sent",
    contact: {
      name: companyData?.contact?.name || "John Smith",
      email: companyData?.contact?.email || "john@globallogistics.com",
      phone: companyData?.contact?.phone || "+1 555-0123",
      title: companyData?.contact?.title || "Logistics Manager",
      linkedin: "https://linkedin.com/in/johnsmith"
    },
    company: {
      ...companyData,
      website: "https://globallogistics.com",
      employees: "500-1000",
      industry: companyData?.industry || "Logistics & Supply Chain",
      revenue: companyData?.revenue || "$50M - $100M"
    },
    shipments: {
      total: companyData?.shipments || 1250,
      recent: [
        { date: "2025-01-15", type: "Ocean", value: "$125K", route: "Shanghai → Los Angeles" },
        { date: "2025-01-12", type: "Air", value: "$85K", route: "Hong Kong → Chicago" },
        { date: "2025-01-08", type: "Ocean", value: "$200K", route: "Rotterdam → New York" }
      ],
      trends: {
        monthly_growth: "+12%",
        yearly_volume: "$2.4M",
        top_routes: ["Asia → US West Coast", "Europe → US East Coast"]
      }
    }
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

  if (!dealData) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90vw] sm:w-[800px] max-w-[800px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={dealData.company?.logo} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Building className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-xl">{dealData.company_name}</SheetTitle>
                <p className="text-sm text-muted-foreground">{dealData.company?.industry}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{dealData.stage}</Badge>
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? <Save className="w-4 h-4 mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Deal Value</span>
                  </div>
                  {isEditing ? (
                    <Input
                      value={editedData.value_usd || ""}
                      onChange={(e) => setEditedData({...editedData, value_usd: Number(e.target.value)})}
                      placeholder="Deal value"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-green-700">
                      ${dealData.value_usd?.toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">Expected Close</span>
                  </div>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedData.expected_close_date || ""}
                      onChange={(e) => setEditedData({...editedData, expected_close_date: e.target.value})}
                    />
                  ) : (
                    <div className="text-lg font-semibold">{dealData.expected_close_date}</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Lead Score and Opportunity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Lead Score:</span>
                <LeadScoreChip score={78} />
              </div>
              <OpportunityMeter score={78} className="col-span-2" />
            </div>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Website</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{dealData.company?.website}</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Employees</Label>
                    <div className="text-sm">{dealData.company?.employees}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Revenue</Label>
                    <div className="text-sm">{dealData.company?.revenue}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <div className="text-sm">{dealData.company?.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleSendEmail} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Compose Email
              </Button>
              <Button variant="outline" onClick={handleEnrichContact} disabled={isEnriching}>
                <Sparkles className="w-4 h-4 mr-2" />
                {isEnriching ? "Enriching..." : "Enrich Contact"}
              </Button>
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
                <ContactFields contact={dealData.contact} />
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleEnrichContact} disabled={isEnriching}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isEnriching ? "Enriching..." : "Enrich with Apollo"}
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    PhantomBuster
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Contacts</CardTitle>
                <CardDescription>Discover more contacts at this company</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Find More Contacts
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipments" className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ship className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Total Shipments</span>
                  </div>
                  <div className="text-2xl font-bold">{dealData.shipments.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Monthly Growth</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {dealData.shipments.trends.monthly_growth}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Yearly Volume</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {dealData.shipments.trends.yearly_volume}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dealData.shipments.recent.map((shipment: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{shipment.type}</Badge>
                        <div>
                          <div className="font-medium">{shipment.route}</div>
                          <div className="text-sm text-muted-foreground">{shipment.date}</div>
                        </div>
                      </div>
                      <div className="font-semibold">{shipment.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  No activities yet. Start engaging with this prospect!
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-6">
            <SalesAssistant subjectType="deal" subjectId={dealId} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}