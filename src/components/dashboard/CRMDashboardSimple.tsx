import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  Plus,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";

export function CRMDashboardSimple() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data to show functionality
  const mockDeals = [
    {
      id: 1,
      company: "Acme Corporation",
      contact: "John Smith",
      value: "$125,000",
      stage: "Negotiation",
      probability: 75,
      closeDate: "2024-02-15"
    },
    {
      id: 2,
      company: "Global Logistics",
      contact: "Sarah Johnson",
      value: "$89,000",
      stage: "Proposal",
      probability: 60,
      closeDate: "2024-02-28"
    },
    {
      id: 3,
      company: "TechFlow Inc",
      contact: "Mike Chen",
      value: "$200,000",
      stage: "Qualified",
      probability: 40,
      closeDate: "2024-03-10"
    }
  ];

  const mockContacts = [
    {
      id: 1,
      name: "John Smith",
      company: "Acme Corporation",
      email: "john@acme.com",
      phone: "+1 (555) 123-4567",
      lastContact: "2 days ago"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      company: "Global Logistics",
      email: "sarah@global.com", 
      phone: "+1 (555) 987-6543",
      lastContact: "1 week ago"
    },
    {
      id: 3,
      name: "Mike Chen",
      company: "TechFlow Inc",
      email: "mike@techflow.com",
      phone: "+1 (555) 456-7890",
      lastContact: "3 days ago"
    }
  ];

  return (
    <div className="h-full p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="card-surface">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Deals</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-surface">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pipeline Value</p>
                    <p className="text-2xl font-bold">$2.1M</p>
                  </div>
                  <Building2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-surface">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Contacts</p>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-surface">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Win Rate</p>
                    <p className="text-2xl font-bold">68%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="card-surface">
            <CardHeader>
              <CardTitle>Recent Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDeals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{deal.company}</p>
                        <p className="text-sm text-gray-600">{deal.contact}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{deal.value}</p>
                      <Badge variant="secondary">{deal.stage}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <Card className="card-surface">
            <CardHeader>
              <CardTitle>Deal Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDeals.map((deal) => (
                  <div key={deal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{deal.company}</h3>
                      <Badge variant="outline">{deal.stage}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Contact:</span>
                        <p>{deal.contact}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Value:</span>
                        <p className="font-medium">{deal.value}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Probability:</span>
                        <p>{deal.probability}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Close Date:</span>
                        <p>{deal.closeDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card className="card-surface">
            <CardHeader>
              <CardTitle>Contact List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockContacts.map((contact) => (
                  <div key={contact.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p>{contact.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p>{contact.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Contact:</span>
                        <p>{contact.lastContact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <Card className="card-surface">
            <CardHeader>
              <CardTitle>Company List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Company Management</h3>
                <p className="text-gray-600 mb-4">View and manage your company relationships</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}