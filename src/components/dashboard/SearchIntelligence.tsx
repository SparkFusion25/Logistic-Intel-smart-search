import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, Globe, Plane, Ship } from "lucide-react"
import { CompanyCard } from "./CompanyCard"

export function SearchIntelligence() {
  const [searchQuery, setSearchQuery] = useState("Electronics • China → USA • Last 30 days")
  
  const mockCompanies = [
    {
      name: "Apple Inc.",
      logo: "/placeholder.svg",
      contact: {
        name: "Sarah Johnson",
        title: "Supply Chain Director",
        email: "sarah.j@apple.com",
        phone: "+1 (555) 123-4567"
      },
      location: "Cupertino, CA, USA",
      status: "Hot Lead" as const,
      industry: "Technology",
      revenue: "$394.3B",
      shipments: 15420
    },
    {
      name: "Samsung Electronics",
      contact: {
        name: "Kim Min-jun",
        title: "Logistics Manager",
        email: "kim.mj@samsung.com"
      },
      location: "Seoul, South Korea",
      status: "Prospect" as const,
      industry: "Electronics",
      revenue: "$244.2B",
      shipments: 12350
    },
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
    }
  ]

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">Search Intelligence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Advanced Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-input"
                placeholder="Search trade data..."
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-4">
            <Select defaultValue="china">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="china">China</SelectItem>
                <SelectItem value="usa">USA</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="california">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="california">California</SelectItem>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="texas">Texas</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="8517">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="HS Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8517">8517 - Electronics</SelectItem>
                <SelectItem value="8471">8471 - Computers</SelectItem>
                <SelectItem value="9013">9013 - Optics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Active Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <Badge variant="secondary" className="gap-1">
              <Globe className="w-3 h-3" />
              Electronics
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Plane className="w-3 h-3" />
              China → USA
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Ship className="w-3 h-3" />
              Last 30 days
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">2,847 shipments found</h3>
              <p className="text-muted-foreground">Showing companies with highest trade volume</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
              <Button variant="outline" size="sm">
                Save Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Results */}
      <div className="grid gap-4">
        {mockCompanies.map((company, index) => (
          <CompanyCard key={index} company={company} />
        ))}
      </div>

      {/* Global Intelligence */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">Global Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-card-foreground mb-2">Trade Route Analysis</h4>
              <p className="text-sm text-muted-foreground mb-4">
                China → USA electronics trade has increased 15% this quarter
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Volume</span>
                  <span className="text-sm font-medium">$2.4B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Growth Rate</span>
                  <span className="text-sm font-medium text-success">+15.3%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground mb-2">Market Benchmark</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Your target companies rank in top 20% of importers
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Shipment Value</span>
                  <span className="text-sm font-medium">$145K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Market Share</span>
                  <span className="text-sm font-medium">18.7%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}