import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { 
  ArrowLeft, Building2, MapPin, Globe, TrendingUp, TrendingDown, 
  Calendar, Ship, Package, Users, Mail, Phone, ExternalLink,
  Star, Download, Filter, Eye, MoreHorizontal
} from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { TopBar } from "@/components/ui/TopBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function CompanyProfilePage() {
  const { companyId } = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("6months")

  // Mock company data - in real app, fetch based on companyId
  useEffect(() => {
    const mockData = {
      company_id: companyId,
      name: "Apple Inc.",
      logo_url: null,
      website: "https://apple.com",
      industry: "Technology & Electronics",
      location: "Cupertino, CA, USA",
      founded: "1976",
      employees: "164,000+",
      revenue: "$394.3B (2022)",
      description: "Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services. The company is best known for its iPhone smartphone line.",
      trade_volume_usd: 2400000000,
      shipment_count: 15420,
      last_shipment_at: "2025-08-13T08:00:00Z",
      confidence: 98,
      trend: "up",
      trade_partners: 45,
      active_routes: 12,
      avg_shipment_value: 155000,
      primary_products: ["Electronics", "Computer Hardware", "Consumer Devices"],
      top_destinations: ["China", "Germany", "United Kingdom", "Japan", "South Korea"],
      top_origins: ["China", "Taiwan", "South Korea", "Japan", "Vietnam"]
    }
    
    setTimeout(() => {
      setCompany(mockData)
      setLoading(false)
    }, 1000)
  }, [companyId])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(0)}M`
    return `$${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const handleAddToCRM = () => {
    toast({
      title: "Added to CRM",
      description: `${company.name} has been added to your CRM`
    })
  }

  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${company.name} is now being monitored`
    })
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <TopBar />
            <main className="flex-1 p-6">
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    )
  }

  if (!company) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <TopBar />
            <main className="flex-1 p-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h1>
                <p className="text-gray-600 mb-8">The company you're looking for doesn't exist.</p>
                <Link to="/dashboard/search">
                  <Button>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Search
                  </Button>
                </Link>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopBar />
          <main className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/dashboard/search">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Search
                  </Button>
                </Link>
                <div className="h-8 w-px bg-border" />
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
                    <p className="text-muted-foreground">{company.industry}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleAddToWatchlist}>
                  <Star className="w-4 h-4 mr-2" />
                  Watch
                </Button>
                <Button onClick={handleAddToCRM}>
                  <Users className="w-4 h-4 mr-2" />
                  Add to CRM
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Company Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-blue-100/30 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Trade Volume</p>
                      <p className="text-2xl font-bold text-blue-700">{formatCurrency(company.trade_volume_usd)}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Shipments</p>
                      <p className="text-2xl font-bold text-emerald-700">{company.shipment_count.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Ship className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-purple-100/30 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Trade Partners</p>
                      <p className="text-2xl font-bold text-purple-700">{company.trade_partners}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-amber-100/30 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Confidence Score</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-amber-700">{company.confidence}%</p>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="shipments">Shipments</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="contacts">Contacts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{company.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Founded</p>
                            <p className="font-semibold">{company.founded}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Employees</p>
                            <p className="font-semibold">{company.employees}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Revenue</p>
                            <p className="font-semibold">{company.revenue}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-semibold">{company.location}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Primary Products</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {company.primary_products.map((product: string, index: number) => (
                            <Badge key={index} variant="secondary">{product}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Trade Routes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Top Destinations</h4>
                          <div className="flex flex-wrap gap-2">
                            {company.top_destinations.map((country: string, index: number) => (
                              <Badge key={index} variant="outline">{country}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Top Origins</h4>
                          <div className="flex flex-wrap gap-2">
                            {company.top_origins.map((country: string, index: number) => (
                              <Badge key={index} variant="outline">{country}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="shipments">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Shipments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Shipment data would be displayed here with filtering and pagination.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="analytics">
                    <Card>
                      <CardHeader>
                        <CardTitle>Trade Analytics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Charts and analytics data would be displayed here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="contacts">
                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Upgrade to View Contacts</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Access verified contact information with a Pro or Enterprise plan.
                          </p>
                          <Button>Upgrade Plan</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Shipment Value</span>
                      <span className="font-semibold">{formatCurrency(company.avg_shipment_value)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Routes</span>
                      <span className="font-semibold">{company.active_routes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Activity</span>
                      <span className="font-semibold">{formatDate(company.last_shipment_at)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>External Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Company Website
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      LinkedIn Page
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}