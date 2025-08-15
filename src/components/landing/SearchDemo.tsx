import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Calendar, Package, Plane, Ship } from "lucide-react";

export const SearchDemo = () => {
  const [searchQuery, setSearchQuery] = useState("Apple Inc");
  const [activeMode, setActiveMode] = useState<'all' | 'air' | 'ocean'>('all');

  const mockResults = [
    {
      id: 1,
      company: "Apple Inc",
      mode: "air",
      destination: "Shanghai, CN",
      value: "$2.4M",
      weight: "24,500 kg",
      confidence: 95,
      date: "2024-01-15",
      hs_code: "8471.60"
    },
    {
      id: 2,
      company: "Apple Operations International",
      mode: "ocean",
      destination: "Los Angeles, US",
      value: "$8.1M",
      weight: "450,000 kg",
      confidence: 87,
      date: "2024-01-12",
      hs_code: "8517.12"
    },
    {
      id: 3,
      company: "Apple Asia LLC",
      mode: "air",
      destination: "Frankfurt, DE",
      value: "$1.8M",
      weight: "18,200 kg",
      confidence: 92,
      date: "2024-01-10",
      hs_code: "8471.70"
    }
  ];

  const filteredResults = activeMode === 'all' 
    ? mockResults 
    : mockResults.filter(result => result.mode === activeMode);

  return (
    <Card className="max-w-6xl mx-auto shadow-card">
      <CardContent className="p-6">
        {/* Search Panel */}
        <div className="bg-gradient-to-r from-background to-background-secondary p-6 rounded-lg border border-white/10 mb-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search companies, HS codes, or trade lanes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-white/20 text-card-foreground"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 px-8">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Mode Toggle Pills */}
            <div className="flex justify-center">
              <div className="flex bg-white/10 rounded-lg p-1 border border-white/10">
                <Button
                  variant={activeMode === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode('all')}
                  className="px-4"
                >
                  All
                </Button>
                <Button
                  variant={activeMode === 'ocean' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode('ocean')}
                  className="px-4"
                >
                  <Ship className="w-3 h-3 mr-2" />
                  Ocean
                </Button>
                <Button
                  variant={activeMode === 'air' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode('air')}
                  className="px-4"
                >
                  <Plane className="w-3 h-3 mr-2" />
                  Air
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-card-foreground">
              {filteredResults.length} Results for "{searchQuery}"
            </h3>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="space-y-3">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {result.mode === 'air' ? (
                      <Plane className="w-4 h-4 text-primary" />
                    ) : (
                      <Ship className="w-4 h-4 text-accent" />
                    )}
                    <Badge variant={result.mode === 'air' ? 'default' : 'secondary'} className="text-xs">
                      {result.mode.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="font-medium text-card-foreground">{result.company}</div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {result.destination}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {result.date}
                      </div>
                      <div className="flex items-center">
                        <Package className="w-3 h-3 mr-1" />
                        {result.hs_code}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-medium text-card-foreground">{result.value}</div>
                    <div className="text-sm text-muted-foreground">{result.weight}</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-card-foreground">{result.confidence}%</span>
                  </div>

                  <Button size="sm" variant="outline">
                    Add to CRM
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};