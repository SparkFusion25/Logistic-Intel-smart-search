import { useState } from "react"
import { 
  Search, Filter, Download, ArrowRight, Star, Eye, ExternalLink, 
  MoreHorizontal, Building2, MapPin, Calendar, Globe, Ship, TrendingUp,
  TrendingDown 
} from "lucide-react"

export function SearchIntelligence() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  
  const filters = [
    { id: "all", label: "All Companies", count: 2847 },
    { id: "importers", label: "Importers", count: 1567 },
    { id: "exporters", label: "Exporters", count: 892 },
    { id: "manufacturers", label: "Manufacturers", count: 388 }
  ]

  const savedSearches = [
    { name: "Electronics Importers", count: 1247, updated: "2 hours ago" },
    { name: "US → China Trade", count: 892, updated: "1 day ago" },
    { name: "High Volume Shippers", count: 453, updated: "3 days ago" }
  ]

  const searchResults = [
    {
      id: 1,
      company: "Apple Inc.",
      type: "Importer",
      location: "Cupertino, CA, USA",
      industry: "Technology",
      tradeVolume: "$2.4B",
      lastShipment: "2 days ago",
      routes: ["Shanghai → Los Angeles", "Shenzhen → San Francisco"],
      shipmentCount: 15420,
      confidence: 98,
      trending: "up"
    },
    {
      id: 2,
      company: "Samsung Electronics",
      type: "Manufacturer",
      location: "Seoul, South Korea",
      industry: "Electronics",
      tradeVolume: "$1.8B",
      lastShipment: "5 days ago",
      routes: ["Busan → Long Beach", "Seoul → Newark"],
      shipmentCount: 12350,
      confidence: 95,
      trending: "up"
    },
    {
      id: 3,
      company: "Global Logistics Corp",
      type: "Exporter",
      location: "Hamburg, Germany",
      industry: "Automotive",
      tradeVolume: "$890M",
      lastShipment: "1 week ago",
      routes: ["Hamburg → New York", "Bremen → Baltimore"],
      shipmentCount: 8750,
      confidence: 92,
      trending: "down"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies, products, or trade routes..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors">
            Search
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>
            
            {/* Filter Categories */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Type</label>
                <div className="space-y-2">
                  {filters.map((filter) => (
                    <label key={filter.id} className="flex items-center">
                      <input
                        type="radio"
                        name="companyType"
                        value={filter.id}
                        checked={selectedFilter === filter.id}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{filter.label}</span>
                      <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {filter.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option>All Industries</option>
                  <option>Electronics</option>
                  <option>Automotive</option>
                  <option>Textiles</option>
                  <option>Machinery</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trade Volume</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option>Any Volume</option>
                  <option>$1M - $10M</option>
                  <option>$10M - $100M</option>
                  <option>$100M - $1B</option>
                  <option>$1B+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Country or region"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Saved Searches */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Saved Searches</h4>
              <div className="space-y-2">
                {savedSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{search.name}</p>
                      <p className="text-xs text-gray-500">{search.count} results • {search.updated}</p>
                    </div>
                    <button className="text-gray-400 hover:text-sky-600">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Results */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Search Results</h2>
                <p className="text-sm text-gray-600 mt-1">Found 2,847 companies matching your criteria</p>
              </div>
              <div className="flex items-center space-x-3">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option>Sort by Relevance</option>
                  <option>Trade Volume (High to Low)</option>
                  <option>Trade Volume (Low to High)</option>
                  <option>Last Activity</option>
                  <option>Company Name</option>
                </select>
                <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div key={result.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-sky-600" />
                    </div>

                    {/* Company Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{result.company}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.type === 'Importer' ? 'bg-blue-100 text-blue-800' :
                          result.type === 'Exporter' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {result.type}
                        </span>
                        <div className="flex items-center">
                          {result.trending === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                          <span className="text-xs text-gray-500 ml-1">Trending</span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {result.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                          {result.industry}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Globe className="w-4 h-4 mr-2 text-gray-400" />
                          Trade Volume: <span className="font-semibold ml-1">{result.tradeVolume}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          Last shipment: {result.lastShipment}
                        </div>
                      </div>

                      {/* Routes */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-500">Trade Routes:</span>
                        {result.routes.map((route, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                            {route}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center">
                          <Ship className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="font-medium">{result.shipmentCount.toLocaleString()}</span>
                          <span className="text-gray-500 ml-1">shipments</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                          <span className="font-medium">{result.confidence}%</span>
                          <span className="text-gray-500 ml-1">confidence</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                      <Star className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <button className="bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700 transition-colors font-semibold">
              Load More Results
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}