import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Package, 
  Plane, 
  Ship, 
  Download,
  Eye,
  Plus
} from "lucide-react";

export const SearchPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMode, setActiveMode] = useState<'all' | 'air' | 'ocean'>('all');
  const [filters, setFilters] = useState({
    origin_country: "",
    destination_country: "",
    hs_code: "",
    date_from: "",
    date_to: "",
    min_value: "",
    max_value: ""
  });

  // Sample results that match your Excel column structure
  const mockResults = [
    {
      id: 1,
      company: "Utilitymate Mfg",
      mode: "ocean",
      destination: "Los Angeles, US",
      origin: "Shanghai, CN",
      value: "$2,400,000",
      weight: "24,500 kg",
      confidence: 95,
      date: "2024-01-15",
      hs_code: "8471.60",
      carrier: "COSCO Shipping",
      description: "Manufacturing equipment",
      bol_number: "COSU1234567890",
      vessel: "COSCO SHIPPING PANAMA",
      transport_method: "Ocean Freight",
      consignee_name: "Utilitymate USA Inc",
      shipper_name: "Utilitymate Manufacturing Ltd",
      port_of_lading: "Shanghai Port",
      port_of_unlading: "Los Angeles Port",
      consignee_city: "Los Angeles",
      consignee_state: "CA",
      shipper_city: "Shanghai",
      consignee_industry: "Manufacturing",
      shipper_industry: "Industrial Equipment"
    },
    {
      id: 2,
      company: "Global Trade Corp",
      mode: "air",
      destination: "Frankfurt, DE",
      origin: "Hong Kong, HK",
      value: "$1,800,000",
      weight: "18,200 kg",
      confidence: 92,
      date: "2024-01-12",
      hs_code: "8517.12",
      carrier: "DHL Express",
      description: "Electronic components",
      bol_number: "DHL9876543210",
      vessel: "DHL Cargo Flight",
      transport_method: "Air Freight",
      consignee_name: "European Electronics GmbH",
      shipper_name: "Hong Kong Electronics Ltd",
      port_of_lading: "Hong Kong International Airport",
      port_of_unlading: "Frankfurt Airport",
      consignee_city: "Frankfurt",
      consignee_state: "Hesse",
      shipper_city: "Hong Kong",
      consignee_industry: "Electronics",
      shipper_industry: "Electronics Manufacturing"
    },
    {
      id: 3,
      company: "Maritime Solutions Inc",
      mode: "ocean",
      destination: "Hamburg, DE",
      origin: "Shenzhen, CN",
      value: "$5,200,000",
      weight: "280,000 kg",
      confidence: 89,
      date: "2024-01-10",
      hs_code: "8504.40",
      carrier: "Maersk Line",
      description: "Industrial machinery",
      bol_number: "MAEU5678901234",
      vessel: "MAERSK COPENHAGEN",
      transport_method: "Ocean Freight",
      consignee_name: "German Industrial Solutions",
      shipper_name: "Shenzhen Manufacturing Co",
      port_of_lading: "Shenzhen Port",
      port_of_unlading: "Hamburg Port",
      consignee_city: "Hamburg",
      consignee_state: "Hamburg",
      shipper_city: "Shenzhen",
      consignee_industry: "Industrial Equipment",
      shipper_industry: "Manufacturing"
    }
  ];

  const filteredResults = activeMode === 'all' 
    ? mockResults 
    : mockResults.filter(result => result.mode === activeMode);

  const countries = [
    "United States", "China", "Germany", "Japan", "United Kingdom", 
    "South Korea", "Netherlands", "France", "Italy", "Canada"
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Search Panel - Mobile Optimized */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg sm:shadow-xl border border-blue-100/50 rounded-xl sm:rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Search Trade Intelligence</h2>
              <p className="text-sm sm:text-base text-slate-600">Discover companies, track shipments, and analyze trade patterns</p>
            </div>

            {/* Primary Search Bar - Mobile First */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Search companies, HS codes, or trade lanes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 sm:h-14 pl-10 sm:pl-12 text-sm sm:text-base bg-white/80 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg sm:rounded-xl"
                />
              </div>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 sm:px-8 h-12 sm:h-14 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 w-full sm:w-auto">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Advanced Filters - Mobile Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Origin Country
                </label>
                <Select value={filters.origin_country} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, origin_country: value }))
                }>
                  <SelectTrigger className="h-10 sm:h-auto bg-white/80 border-blue-200 focus:border-blue-500 rounded-lg sm:rounded-xl text-sm">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Destination Country
                </label>
                <Select value={filters.destination_country} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, destination_country: value }))
                }>
                  <SelectTrigger className="h-10 sm:h-auto bg-white/80 border-blue-200 focus:border-blue-500 rounded-lg sm:rounded-xl text-sm">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  HS Code
                </label>
                <Input
                  placeholder="e.g., 8471.60"
                  value={filters.hs_code}
                  onChange={(e) => setFilters(prev => ({ ...prev, hs_code: e.target.value }))}
                  className="h-10 sm:h-auto bg-white/80 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg sm:rounded-xl text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Value Range (USD)
                </label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Min"
                    value={filters.min_value}
                    onChange={(e) => setFilters(prev => ({ ...prev, min_value: e.target.value }))}
                    className="h-10 sm:h-auto bg-white/80 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg sm:rounded-xl text-sm"
                  />
                  <Input
                    placeholder="Max"
                    value={filters.max_value}
                    onChange={(e) => setFilters(prev => ({ ...prev, max_value: e.target.value }))}
                    className="h-10 sm:h-auto bg-white/80 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg sm:rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Mode Toggle Pills - Mobile Optimized */}
            <div className="flex justify-center">
              <div className="flex bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-1 sm:p-2 border border-blue-200/50 shadow-lg w-full sm:w-auto">
                <Button
                  variant={activeMode === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode('all')}
                  className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-sm ${
                    activeMode === 'all' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  All Modes
                </Button>
                <Button
                  variant={activeMode === 'ocean' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode('ocean')}
                  className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-sm ${
                    activeMode === 'ocean' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Ship className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Ocean
                </Button>
                <Button
                  variant={activeMode === 'air' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode('air')}
                  className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-sm ${
                    activeMode === 'air' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Plane className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Air
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Results Section - Mobile Optimized */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {filteredResults.length} Search Results
            {searchQuery && ` for "${searchQuery}"`}
          </h3>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button variant="outline" size="sm" className="border-blue-200 text-slate-600 hover:bg-blue-50 rounded-lg sm:rounded-xl text-xs sm:text-sm">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              More Filters
            </Button>
            <Button variant="outline" size="sm" className="border-blue-200 text-slate-600 hover:bg-blue-50 rounded-lg sm:rounded-xl text-xs sm:text-sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Enhanced Results Grid - Mobile First */}
        <div className="space-y-3 sm:space-y-4">
          {filteredResults.map((result) => (
            <Card
              key={result.id}
              className="bg-white/90 backdrop-blur-sm hover:bg-white border border-blue-100/50 hover:border-blue-300 transition-all duration-300 cursor-pointer group hover:shadow-lg sm:hover:shadow-xl rounded-xl sm:rounded-2xl overflow-hidden"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
                  {/* Left: Company and Mode Info - Mobile Stacked */}
                  <div className="space-y-4 lg:space-y-0 lg:flex lg:items-start lg:space-x-6">
                    <div className="flex items-center space-x-3">
                      {result.mode === 'air' ? (
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Plane className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                      ) : (
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg sm:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Ship className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                      )}
                      <Badge 
                        variant={result.mode === 'air' ? 'default' : 'secondary'} 
                        className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-lg ${
                          result.mode === 'air' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-cyan-100 text-cyan-700'
                        }`}
                      >
                        {result.mode.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg sm:text-xl group-hover:text-blue-700 transition-colors">{result.company}</h4>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">{result.carrier}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                          <span className="font-medium truncate">{result.origin} → {result.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                          <span>{result.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Package className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                          <span>HS {result.hs_code}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 rounded-lg px-2 sm:px-3 py-1 sm:py-2">{result.description}</p>
                    </div>
                  </div>

                  {/* Right: Stats and Actions - Mobile Stacked */}
                  <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6 xl:space-x-8">
                    {/* Value and Weight */}
                    <div className="flex justify-between items-center lg:flex-col lg:items-center lg:justify-center">
                      <div>
                        <div className="font-bold text-slate-900 text-lg sm:text-2xl">{result.value}</div>
                        <div className="text-xs sm:text-sm text-slate-500 font-medium">{result.weight}</div>
                      </div>
                    </div>
                    
                    {/* Enhanced Confidence Score - Mobile Optimized */}
                    <div className="flex items-center justify-between lg:flex-col lg:items-center lg:space-y-2">
                      <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">Confidence</div>
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <div className="w-16 sm:w-20 bg-slate-200 rounded-full h-2 sm:h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full h-2 sm:h-3 transition-all duration-500 shadow-sm"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{result.confidence}%</span>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons - Mobile Optimized */}
                    <div className="flex space-x-2 sm:space-x-3 w-full lg:w-auto">
                      <Button size="sm" variant="outline" className="flex-1 lg:flex-none border-blue-200 text-slate-600 hover:bg-blue-50 rounded-lg sm:rounded-xl text-xs sm:text-sm">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                      <Button size="sm" className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm">
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Add to CRM</span>
                        <span className="sm:hidden">Add CRM</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Pagination - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 sm:pt-6">
          <p className="text-xs sm:text-sm text-slate-600 font-medium text-center sm:text-left">
            Showing 1-{filteredResults.length} of {filteredResults.length} results
          </p>
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <Button variant="outline" size="sm" disabled className="border-blue-200 text-slate-400 rounded-lg sm:rounded-xl text-xs sm:text-sm px-3 sm:px-4">
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg w-8 h-8 sm:w-auto sm:h-auto sm:px-3 text-xs sm:text-sm">1</Button>
              <Button variant="outline" size="sm" className="border-blue-200 text-slate-600 hover:bg-blue-50 rounded-lg w-8 h-8 sm:w-auto sm:h-auto sm:px-3 text-xs sm:text-sm">2</Button>
              <Button variant="outline" size="sm" className="border-blue-200 text-slate-600 hover:bg-blue-50 rounded-lg w-8 h-8 sm:w-auto sm:h-auto sm:px-3 text-xs sm:text-sm">3</Button>
            </div>
            <Button variant="outline" size="sm" className="border-blue-200 text-slate-600 hover:bg-blue-50 rounded-lg sm:rounded-xl text-xs sm:text-sm px-3 sm:px-4">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};