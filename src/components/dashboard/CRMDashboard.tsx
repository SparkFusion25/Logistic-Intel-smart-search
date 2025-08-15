import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, Users, Building, MessageSquare } from "lucide-react"
import { MetricCard } from "./MetricCard"
import { CompanyCard } from "./CompanyCard"

export function CRMDashboard() {
  const crmCompanies = [
    {
      name: "TechCorp Solutions",
      contact: {
        name: "Michael Chen",
        title: "Import/Export Manager", 
        email: "m.chen@techcorp.com",
        phone: "+86 138 0013 8000"
      },
      location: "Shenzhen, China",
      status: "Customer" as const,
      industry: "Technology Hardware",
      revenue: "$2.1B",
      shipments: 8750
    },
    {
      name: "Global Electronics Inc.",
      contact: {
        name: "Lisa Rodriguez",
        title: "Supply Chain VP",
        email: "l.rodriguez@globalelec.com"
      },
      location: "Austin, TX, USA",
      status: "Hot Lead" as const,
      industry: "Electronics Manufacturing",
      revenue: "$850M",
      shipments: 5200
    },
    {
      name: "Pacific Trade Co.",
      contact: {
        name: "Yuki Tanaka",
        title: "Logistics Director",
        email: "y.tanaka@pacifictrade.jp",
        phone: "+81 3-1234-5678"
      },
      location: "Tokyo, Japan",
      status: "Prospect" as const,
      industry: "Import/Export",
      revenue: "$420M",
      shipments: 3100
    }
  ]

  return (
    <div className="space-y-6">
      {/* CRM Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">CRM Dashboard</h1>
          <p className="text-muted-foreground">Manage your contacts and prospects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Import Contacts
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* CRM Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Contacts"
          value="1,247"
          change={{ value: "+12%", type: "increase" }}
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <MetricCard
          title="Active Prospects"
          value="89"
          change={{ value: "+8%", type: "increase" }}
          icon={<Building className="w-6 h-6 text-accent" />}
        />
        <MetricCard
          title="Notes Added"
          value="24"
          change={{ value: "+5%", type: "increase" }}
          icon={<MessageSquare className="w-6 h-6 text-success" />}
        />
      </div>

      {/* CRM Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10 bg-background border-input"
                placeholder="Search contacts..."
              />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="hot-lead">Hot Lead</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="recent">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="shipments">Shipments</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
          
          {/* Active Filters Display */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <Badge variant="secondary">Air Shipper</Badge>
            <Badge variant="secondary">Ranked</Badge>
            <Badge variant="secondary">Untagged</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Contact List */}
      <div className="grid gap-4">
        {crmCompanies.map((company, index) => (
          <CompanyCard key={index} company={company} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Plus className="w-6 h-6" />
              <span className="text-sm">Add Contact</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="w-6 h-6" />
              <span className="text-sm">Import List</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">Send Email</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Building className="w-6 h-6" />
              <span className="text-sm">Create Segment</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}