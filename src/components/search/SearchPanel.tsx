import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Autocomplete } from "@/components/ui/autocomplete";
import { useToast } from "@/hooks/use-toast";
import { useAPI } from "@/hooks/useAPI";
import { useLocationAutocomplete } from "@/hooks/useLocationAutocomplete";
import { useCommodityAutocomplete } from "@/hooks/useCommodityAutocomplete";
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
  const [searchResults, setSearchResults] = useState({ total: 0, items: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    origin_country: "",
    origin_zip: "",
    destination_country: "",
    destination_zip: "",
    hs_code: "",
    commodity: "",
    date_from: "",
    date_to: "",
    min_value: "",
    max_value: ""
  });

  const { toast } = useToast();
  const { makeRequest } = useAPI();
  const { searchLocations, loading: locationsLoading } = useLocationAutocomplete();
  const { searchCommodities, loading: commoditiesLoading } = useCommodityAutocomplete();

  const handleSearch = async () => {
    // Allow empty searches to show all data
    // if (!searchQuery.trim()) {
    //   toast({
    //     title: "Search Required", 
    //     description: "Please enter a search query",
    //     variant: "destructive"
    //   });
    //   return;
    // }
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await makeRequest('/search-run', {
        method: 'POST',
        body: {
          q: searchQuery,
          tab: 'shipments',
          filters: {
            ...filters,
            mode: activeMode === 'all' ? undefined : activeMode
          },
          pagination: { limit: 20, offset: 0 },
          sort: { field: 'unified_date', dir: 'desc' }
        }
      });
      
        if (response) {
          setSearchResults(response);
          toast({
            title: "Search Complete",
            description: searchQuery ? `Found ${response.total} shipments for "${searchQuery}"` : `Found ${response.total} shipments`
          });
        }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "There was an error performing the search. Please try again.",
        variant: "destructive"
      });
      setSearchResults({ total: 0, items: [] });
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: number | null) => {
    if (!value) return "N/A";
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatWeight = (weight: number | null) => {
    if (!weight) return "N/A";
    if (weight >= 1000) return `${(weight / 1000).toFixed(1)}t`;
    return `${weight.toLocaleString()} kg`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (!hasSearched) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-sky-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Trade Intelligence</h2>
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
              placeholder="e.g., 'Electronics from China to US'"
              className="w-full pl-12 pr-4 py-4 text-lg"
            />
          </div>
          
            <Button onClick={handleSearch} size="lg" className="w-full">
              <Search className="w-5 h-5 mr-2" />
              Search Global Trade Data
            </Button>
            
            {/* Advanced Filters for Initial Search */}
            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Advanced Filters:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Autocomplete
                  value={filters.origin_country}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, origin_country: value }))}
                  options={searchLocations(filters.origin_country)}
                  placeholder="Origin"
                  searchPlaceholder="Search locations..."
                  className="w-full"
                />
                <Autocomplete
                  value={filters.destination_country}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, destination_country: value }))}
                  options={searchLocations(filters.destination_country)}
                  placeholder="Destination"
                  searchPlaceholder="Search locations..."
                  className="w-full"
                />
                <Input
                  placeholder="Origin ZIP"
                  value={filters.origin_zip}
                  onChange={(e) => setFilters(prev => ({ ...prev, origin_zip: e.target.value }))}
                />
                <Input
                  placeholder="Destination ZIP"
                  value={filters.destination_zip}
                  onChange={(e) => setFilters(prev => ({ ...prev, destination_zip: e.target.value }))}
                />
                <Input
                  placeholder="HS Code"
                  value={filters.hs_code}
                  onChange={(e) => setFilters(prev => ({ ...prev, hs_code: e.target.value }))}
                />
                <Autocomplete
                  value={filters.commodity}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, commodity: value }))}
                  options={searchCommodities(filters.commodity)}
                  placeholder="Commodity"
                  searchPlaceholder="Search commodities..."
                  className="w-full"
                />
              </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Panel */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-100/50 rounded-xl overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-6">
            {/* Primary Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Search shipments, companies, HS codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-12 pl-10 sm:pl-12 bg-white/80 border-blue-200 focus:border-blue-500"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 h-12"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Mode Toggle */}
            <div className="flex justify-center">
              <div className="flex bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-1 border border-blue-200/50">
                <Button
                  variant={activeMode === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode('all')}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 ${
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
                  className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                    activeMode === 'ocean' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Ship className="w-4 h-4 mr-2" />
                  Ocean
                </Button>
                <Button
                  variant={activeMode === 'air' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode('air')}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                    activeMode === 'air' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Plane className="w-4 h-4 mr-2" />
                  Air
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {loading ? "Searching..." : `${searchResults.total} Shipment Results`}
            {searchQuery && ` for "${searchQuery}"`}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-blue-200 text-slate-600 hover:bg-blue-50">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline" size="sm" className="border-blue-200 text-slate-600 hover:bg-blue-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Searching shipment data...</p>
          </div>
        ) : searchResults.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No shipments found for your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {searchResults.items.map((shipment: any) => (
              <Card
                key={shipment.id}
                className="bg-white/90 backdrop-blur-sm hover:bg-white border border-blue-100/50 hover:border-blue-300 transition-all duration-300 cursor-pointer group hover:shadow-lg rounded-xl overflow-hidden"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
                    {/* Left: Shipment Info */}
                    <div className="space-y-4 lg:space-y-0 lg:flex lg:items-start lg:space-x-6">
                      <div className="flex items-center space-x-3">
                        {shipment.mode === 'air' ? (
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                            <Plane className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
                            <Ship className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <Badge 
                          variant={shipment.mode === 'air' ? 'default' : 'secondary'} 
                          className={`font-semibold px-3 py-1 rounded-lg ${
                            shipment.mode === 'air' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-cyan-100 text-cyan-700'
                          }`}
                        >
                          {(shipment.mode || 'UNKNOWN').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
                            {shipment.company || shipment.unified_company_name || 'Unknown Company'}
                          </h4>
                          <p className="text-sm text-slate-600 font-medium">
                            {shipment.carrier || shipment.carrier_name || 'Unknown Carrier'}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-500">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="font-medium truncate">
                              {shipment.origin || shipment.origin_country || 'Unknown'} → {shipment.destination || shipment.destination_country || 'Unknown'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span>{formatDate(shipment.date || shipment.unified_date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span>HS {shipment.hs_code || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                          {shipment.description || shipment.commodity_description || 'No description available'}
                        </p>
                      </div>
                    </div>

                    {/* Right: Stats and Actions */}
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
                      {/* Value and Weight */}
                      <div className="flex justify-between items-center lg:flex-col lg:items-center">
                        <div>
                          <div className="font-bold text-slate-900 text-lg">
                            {formatValue(shipment.value || shipment.unified_value)}
                          </div>
                          <div className="text-sm text-slate-500 font-medium">
                            {formatWeight(shipment.weight || shipment.weight_kg)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2 w-full lg:w-auto">
                        <Button size="sm" variant="outline" className="flex-1 lg:flex-none border-blue-200 text-slate-600 hover:bg-blue-50">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                          <Plus className="w-4 h-4 mr-2" />
                          Add to CRM
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};