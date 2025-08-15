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

  const mockResults = [
    {
      id: 1,
      company: "Apple Inc",
      mode: "air",
      destination: "Shanghai, CN",
      origin: "Los Angeles, US",
      value: "$2,400,000",
      weight: "24,500 kg",
      confidence: 95,
      date: "2024-01-15",
      hs_code: "8471.60",
      carrier: "FedEx Express",
      description: "Computer parts and accessories"
    },
    {
      id: 2,
      company: "Apple Operations International",
      mode: "ocean",
      destination: "Los Angeles, US",
      origin: "Shenzhen, CN",
      value: "$8,100,000",
      weight: "450,000 kg",
      confidence: 87,
      date: "2024-01-12",
      hs_code: "8517.12",
      carrier: "COSCO Shipping",
      description: "Telecommunication equipment"
    },
    {
      id: 3,
      company: "Apple Asia LLC",
      mode: "air",
      destination: "Frankfurt, DE",
      origin: "Hong Kong, HK",
      value: "$1,800,000",
      weight: "18,200 kg",
      confidence: 92,
      date: "2024-01-10",
      hs_code: "8471.70",
      carrier: "DHL Express",
      description: "Storage units and processors"
    },
    {
      id: 4,
      company: "Apple Manufacturing",
      mode: "ocean",
      destination: "Hamburg, DE",
      origin: "Yantian, CN",
      value: "$5,200,000",
      weight: "280,000 kg",
      confidence: 89,
      date: "2024-01-08",
      hs_code: "8504.40",
      carrier: "Maersk Line",
      description: "Power supply units"
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
    <div className="space-y-6">
      {/* Search Panel - Boxed white card as per spec */}
      <Card className="bg-card shadow-card border-white/20">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Primary Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search companies, HS codes, or trade lanes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">
                  Origin Country
                </label>
                <Select value={filters.origin_country} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, origin_country: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">
                  Destination Country
                </label>
                <Select value={filters.destination_country} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, destination_country: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">
                  HS Code
                </label>
                <Input
                  placeholder="e.g., 8471.60"
                  value={filters.hs_code}
                  onChange={(e) => setFilters(prev => ({ ...prev, hs_code: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">
                  Value Range (USD)
                </label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Min"
                    value={filters.min_value}
                    onChange={(e) => setFilters(prev => ({ ...prev, min_value: e.target.value }))}
                  />
                  <Input
                    placeholder="Max"
                    value={filters.max_value}
                    onChange={(e) => setFilters(prev => ({ ...prev, max_value: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Mode Toggle Pills - As per spec */}
            <div className="flex justify-center">
              <div className="flex bg-secondary/50 rounded-lg p-1 border border-border">
                <Button
                  variant={activeMode === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode('all')}
                  className="px-6"
                >
                  All
                </Button>
                <Button
                  variant={activeMode === 'ocean' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode('ocean')}
                  className="px-6"
                >
                  <Ship className="w-4 h-4 mr-2" />
                  Ocean
                </Button>
                <Button
                  variant={activeMode === 'air' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode('air')}
                  className="px-6"
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">
            {filteredResults.length} Search Results
            {searchQuery && ` for "${searchQuery}"`}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-white/20 text-foreground">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 text-foreground">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Results Grid - Responsive layout as per spec */}
        <div className="space-y-3">
          {filteredResults.map((result) => (
            <Card
              key={result.id}
              className="bg-card hover:shadow-card transition-all duration-200 cursor-pointer border-border hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Left: Company and Mode Info */}
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center space-x-2">
                      {result.mode === 'air' ? (
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Plane className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Ship className="w-4 h-4 text-accent" />
                        </div>
                      )}
                      <Badge variant={result.mode === 'air' ? 'default' : 'secondary'} className="text-xs">
                        {result.mode.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-semibold text-card-foreground text-lg">{result.company}</h4>
                        <p className="text-sm text-muted-foreground">{result.carrier}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {result.origin} → {result.destination}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {result.date}
                        </div>
                        <div className="flex items-center">
                          <Package className="w-3 h-3 mr-1" />
                          HS {result.hs_code}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                    </div>
                  </div>

                  {/* Right: Stats and Actions */}
                  <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
                    {/* Value and Weight */}
                    <div className="text-right lg:text-left">
                      <div className="font-semibold text-card-foreground text-lg">{result.value}</div>
                      <div className="text-sm text-muted-foreground">{result.weight}</div>
                    </div>
                    
                    {/* Confidence Score */}
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all duration-300"
                              style={{ width: `${result.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-card-foreground">{result.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" className="bg-accent hover:bg-accent/90">
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

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-foreground/60">
            Showing 1-{filteredResults.length} of {filteredResults.length} results
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled className="border-white/20 text-foreground">
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled className="border-white/20 text-foreground">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};