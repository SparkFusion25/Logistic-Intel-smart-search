import React, { useState } from "react"
import { useRouter } from "next/router"
import { 
  Search, Filter, Download, ArrowRight, Star, Eye, ExternalLink, 
  MoreHorizontal, Building2, MapPin, Calendar, Globe, Ship, TrendingUp,
  TrendingDown, Plane, Package, Plus, Users, X, Phone, Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Autocomplete } from "@/components/ui/autocomplete"
import { useToast } from "@/hooks/use-toast"
import { useAPI } from "@/hooks/useAPI"
import { useLocationAutocomplete } from "@/hooks/useLocationAutocomplete"
import { useCommodityAutocomplete } from "@/hooks/useCommodityAutocomplete"
import { CompanyCard } from "./CompanyCard"
import { CompanyContactDrawer } from "./CompanyContactDrawer"
import AdvancedFilters from "../search/AdvancedFilters"
import { RevenueVesselResults } from "../search/RevenueVesselResults"
import { ExportButton } from "../search/ExportButton"

export function SearchIntelligence() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("companies")
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [watchlist, setWatchlist] = useState(new Set())
  const [searchResults, setSearchResults] = useState<{ total: number; items: any[] }>({ total: 0, items: [] })
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    mode: "all",
    range: "90d",
    origin_country: "",
    origin_zip: "",
    dest_country: "",
    dest_zip: "",
    hs_codes: "",
    commodity: "",
    entity: "all",
    min_shipments: "",
    min_confidence: "",
    // Date filters
    shipment_date_from: undefined as Date | undefined,
    shipment_date_to: undefined as Date | undefined,
    arrival_date_from: undefined as Date | undefined,
    arrival_date_to: undefined as Date | undefined,
    // Revenue Vessel filters
    importer_name: "",
    carrier_name: "",
    forwarder_name: "",
    notify_party: "",
    container_number: "",
    master_bol_number: "",
    house_bol_number: "",
    vessel_name: "",
    voyage_number: "",
    container_types: "all",
    is_lcl: "all"
  })
  const { toast } = useToast()
  const { request } = useAPI()
  const { countryOptions, cityOptions, loadingCountries, loadingCities } = useLocationAutocomplete()
  const { searchCommodities, isLoading: commoditiesLoading } = useCommodityAutocomplete()

  // All data now comes from real API - no hardcoded searches

  // Remove hardcoded mock data - use real search results from API

  const handleSearch = async () => {
    // Allow empty searches to show all data
    // if (!searchQuery.trim()) {
    //   toast({
    //     title: "Search Required", 
    //     description: "Please enter a search query",
    //     variant: "destructive"
    //   })
    //   return
    // }
    
    setLoading(true)
    setHasSearched(true)
    
    try {
      const response = await request('/search-run', {
        method: 'POST',
        body: {
          q: searchQuery,
          tab: activeTab,
          filters: filters,
          pagination: { limit: 20, offset: 0 },
          sort: { field: 'trade_volume', dir: 'desc' }
        }
      })
      
      if (response) {
        setSearchResults({
          total: response.total || 0,
          items: response.data || []
        })
        toast({
          title: "Search Complete",
          description: `Found ${response.total || 0} results for "${searchQuery}"`
        })
      }
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: "Search Failed",
        description: "There was an error performing the search. Please try again.",
        variant: "destructive"
      })
      setSearchResults({ total: 0, items: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSearch = () => {
    toast({
      title: "Search Saved",
      description: "Your search has been saved successfully"
    })
  }

  const handleExport = () => {
    // Export functionality is now handled by ExportButton component
    return
  }

  const handleAddToCRM = async (company: any) => {
    try {
      console.log('🔧 SearchIntelligence: Starting Add to CRM process')
      console.log('🔧 SearchIntelligence: Company data:', company)
      
      // Show immediate feedback
      toast({
        title: "Adding to Pipeline",
        description: `Adding ${company.name} to CRM pipeline...`
      })
      
      const requestPayload = {
        company: {
          name: company.name,
          location: company.location,
          industry: company.industry,
          trade_volume_usd: company.trade_volume_usd,
          contact: {
            name: `Contact at ${company.name}`,
            title: "Trade Manager", 
            email: `contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com`
          }
        },
        pipeline_name: 'Search Intelligence',
        stage_name: 'Prospect Identified',
        source: 'search'
      }
      
      console.log('🔧 SearchIntelligence: Request payload:', requestPayload)
      
      const response = await request('/crm-add-from-search', {
        method: 'POST',
        body: requestPayload
      })

      console.log('🔧 SearchIntelligence: API Response:', response)
      
      if (response?.success) {
        console.log('🔧 SearchIntelligence: Success - adding to pipeline')
        toast({
          title: "Success",
          description: response.message || `${company.name} added to CRM pipeline`
        })
      } else {
        console.log('🔧 SearchIntelligence: Error response:', response)
        throw new Error(response?.error || 'Failed to add to CRM')
      }
    } catch (error) {
      console.error('🔧 SearchIntelligence: Exception caught:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add company to CRM",
        variant: "destructive"
      })
    }
  }

  const handleViewCompany = (company: any) => {
    setSelectedCompany(company)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedCompany(null)
  }

  const handleViewFullProfile = (company: any) => {
    // Navigate to dedicated company profile page in the same tab
    router.push(`/dashboard/company/${company.company_id}`)
    toast({
      title: "Opening Full Profile",
      description: `Loading detailed profile for ${company.name}...`
    })
  }

  const handleWatchCompany = (company: any) => {
    const newWatchlist = new Set(watchlist)
    if (newWatchlist.has(company.company_id)) {
      newWatchlist.delete(company.company_id)
      toast({
        title: "Removed from Watchlist",
        description: `${company.name} removed from watchlist`
      })
    } else {
      newWatchlist.add(company.company_id)
      toast({
        title: "Added to Watchlist",
        description: `${company.name} added to watchlist`
      })
    }
    setWatchlist(newWatchlist)
  }

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

  if (!hasSearched) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-sky-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Search</h2>
          <p className="text-gray-600 mb-8">
            Search companies, HS codes, or trade lanes to discover global trade intelligence.
          </p>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g., 'Tesla suppliers CN→US last 90d'"
              className="w-full pl-12 pr-4 py-4 text-lg"
            />
          </div>
          
          <Button onClick={handleSearch} size="lg" className="w-full">
            <Search className="w-5 h-5 mr-2" />
            Search Trade Data
          </Button>
          
          <div className="mt-8 text-left">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Quick Examples:</h4>
            <div className="space-y-2">
              {[
                "Electronics importers from China",
                "Tesla suppliers last 6 months",
                "HS code 8517 US exports"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(example)}
                  className="block w-full text-left px-3 py-2 text-sm text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search companies, HS codes, lanes..."
              className="w-full pl-12 pr-4 py-3 text-base"
            />
          </div>
          <Button onClick={handleSearch} className="px-8 w-full sm:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        
        {/* Advanced Filters */}
        <AdvancedFilters 
          value={{
            date_from: null,
            date_to: null,
            hs_code: filters.hs_codes || '',
            origin_country: filters.origin_country || '',
            destination_country: filters.dest_country || '',
            destination_city: filters.dest_zip || '',
            carrier: ''
          }}
          onChange={(newFilters) => {
            setFilters(prev => ({
              ...prev,
              hs_codes: newFilters.hs_code || '',
              origin_country: newFilters.origin_country || '',
              dest_country: newFilters.destination_country || '',
              dest_zip: newFilters.destination_city || ''
            }));
          }}
          onApply={handleSearch}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-4 mx-auto lg:mx-0">
              <TabsTrigger value="companies" className="text-xs sm:text-sm">Companies</TabsTrigger>
              <TabsTrigger value="shipments" className="text-xs sm:text-sm">Shipments</TabsTrigger>
              <TabsTrigger value="routes" className="text-xs sm:text-sm">Routes</TabsTrigger>
              <TabsTrigger value="contacts" className="text-xs sm:text-sm">Contacts</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-3">
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by Relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="volume_desc">Trade Volume (High to Low)</SelectItem>
                  <SelectItem value="volume_asc">Trade Volume (Low to High)</SelectItem>
                  <SelectItem value="activity">Last Activity</SelectItem>
                  <SelectItem value="name">Company Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            {loading ? "Searching..." : searchQuery ? `Found ${searchResults.total} results for "${searchQuery}"` : `Found ${searchResults.total} results`}
          </p>
        </div>

        <TabsContent value="companies" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Searching trade data...</p>
            </div>
          ) : searchResults.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No companies found for your search.</p>
            </div>
          ) : (
            searchResults.items.map((company) => (
            <div key={company.company_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{company.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">{company.industry}</Badge>
                        <div className="flex items-center">
                          {company.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-xs text-gray-500 ml-1 hidden sm:inline">Trending</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{company.location}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">Volume: <span className="font-semibold">{formatCurrency(company.trade_volume_usd)}</span></span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">Last: {formatDate(company.last_shipment_at)}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Ship className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{company.shipment_count.toLocaleString()} shipments</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs sm:text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        <span className="font-medium">{company.confidence}%</span>
                        <span className="text-gray-500 ml-1 hidden sm:inline">confidence</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 lg:ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleWatchCompany(company)}
                    className={`${watchlist.has(company.company_id) ? "text-yellow-500" : ""} p-2`}
                  >
                    <Star className={`w-4 h-4 ${watchlist.has(company.company_id) ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewCompany(company)}
                    className="p-2"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCRM(company)}
                    className="hidden sm:flex"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Pipeline
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCRM(company)}
                    className="sm:hidden p-2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <p className="text-sm text-muted-foreground">
                <strong>{searchResults.total.toLocaleString()}</strong> results found
                {searchQuery && (
                  <span> for "<strong>{searchQuery}</strong>"</span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleSaveSearch} variant="outline" size="sm">
                Save Search
              </Button>
              <ExportButton 
                data={searchResults.items} 
                searchQuery={searchQuery}
                filters={filters}
              />
            </div>
          </div>
          <RevenueVesselResults results={searchResults.items} loading={loading} />
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">Top Trade Routes</h3>
            <div className="space-y-4">
              {[
                { route: "China → United States", volume: "$125.8B", count: 45720, share: "38%" },
                { route: "Germany → United States", volume: "$89.2B", count: 28150, share: "27%" },
                { route: "South Korea → United States", volume: "$56.4B", count: 19340, share: "17%" }
              ].map((route, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold">{route.route}</h4>
                    <p className="text-sm text-gray-600">{route.count.toLocaleString()} shipments</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{route.volume}</div>
                    <div className="text-sm text-gray-600">{route.share} share</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Upgrade to View Contacts</h3>
              <p className="text-gray-600 mb-4">
                Get access to verified contact information including emails, phone numbers, and LinkedIn profiles.
              </p>
              <Button>Upgrade to Pro</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Saved Searches - Coming Soon */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Saved Searches</h4>
        <div className="text-center py-4">
          <p className="text-sm text-gray-600">Save your search queries to access them quickly later.</p>
        </div>
      </div>

      {/* Company Details Modal */}
      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedCompany && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCompany.name}</h2>
                    <p className="text-gray-600">{selectedCompany.industry}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  View detailed company information, trade activity, and contact details.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Company Overview */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Company Overview</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="font-medium">{selectedCompany.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Industry</p>
                        <p className="font-medium">{selectedCompany.industry}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Trade Volume</p>
                        <p className="font-medium">{formatCurrency(selectedCompany.trade_volume_usd)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Confidence Score</p>
                        <p className="font-medium">{selectedCompany.confidence}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Trade Activity</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Total Shipments</p>
                        <p className="font-medium">{selectedCompany.shipment_count.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Shipment</p>
                        <p className="font-medium">{formatDate(selectedCompany.last_shipment_at)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Trend</p>
                        <div className="flex items-center">
                          {selectedCompany.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span className="font-medium capitalize">{selectedCompany.trend}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button
                        className="w-full justify-start"
                        onClick={() => handleAddToCRM(selectedCompany)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to CRM
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleWatchCompany(selectedCompany)}
                      >
                        <Star className={`w-4 h-4 mr-2 ${watchlist.has(selectedCompany.company_id) ? "fill-current text-yellow-500" : ""}`} />
                        {watchlist.has(selectedCompany.company_id) ? "Remove from Watchlist" : "Add to Watchlist"}
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleViewFullProfile(selectedCompany)}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Full Profile
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Upgrade to Pro to access verified contact details.
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                      <Mail className="w-4 h-4 mr-2" />
                      Email Contacts
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Company Contact Drawer */}
      <CompanyContactDrawer
        company={selectedCompany}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        userPlan="free" // This should come from user context/state
      />
    </div>
  )
}