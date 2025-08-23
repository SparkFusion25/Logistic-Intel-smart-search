import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GlossyCard from '@/ui/GlossyCard';
import { CTAPrimary, CTAGhost } from '@/ui/CTA';

interface SearchPanelProps {
  className?: string;
}

export default function SearchPanelWorking({ className = '' }: SearchPanelProps) {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'all' | 'air' | 'ocean'>('all');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mockResults] = useState([
    {
      id: '1',
      company_name: 'Acme Corporation',
      mode: 'air',
      origin_country: 'China',
      destination_country: 'United States',
      date: '2024-01-15',
      value: 125000,
      hs_code: '8471'
    },
    {
      id: '2',
      company_name: 'Global Logistics Inc',
      mode: 'ocean',
      origin_country: 'Germany',
      destination_country: 'Canada', 
      date: '2024-01-10',
      value: 89000,
      hs_code: '8708'
    }
  ]);

  // Initialize search query from URL params
  useEffect(() => {
    const companyParam = searchParams.get('company');
    if (companyParam) {
      setSearchQuery(companyParam);
    }
  }, [searchParams]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasSearched(true);
      toast({
        title: "Search Complete",
        description: `Found results for "${searchQuery}"`
      });
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Unable to search at this time",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCRM = (company: any) => {
    toast({
      title: "Added to CRM",
      description: `${company.company_name} added to CRM successfully`
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <GlossyCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search companies, products, or HS codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={mode} onValueChange={(value: 'all' | 'air' | 'ocean') => setMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="air">Air</SelectItem>
                <SelectItem value="ocean">Ocean</SelectItem>
              </SelectContent>
            </Select>
            <CTAPrimary onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </CTAPrimary>
          </div>
        </div>
      </GlossyCard>

      {/* Mode Toggle */}
      <GlossyCard className="p-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'air', 'ocean'].map((modeOption) => (
            <Button
              key={modeOption}
              variant={mode === modeOption ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode(modeOption as 'all' | 'air' | 'ocean')}
              className="capitalize"
            >
              {modeOption}
            </Button>
          ))}
        </div>
      </GlossyCard>

      {/* Results */}
      {hasSearched && (
        <GlossyCard className="p-6">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h3 className="text-lg font-semibold">Search Results</h3>
              <div className="flex gap-2">
                <Badge variant="secondary">Total: {mockResults.length}</Badge>
                <Badge variant="secondary">Air: 1</Badge>
                <Badge variant="secondary">Ocean: 1</Badge>
                <Badge variant="secondary">Value: {formatCurrency(214000)}</Badge>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Company</th>
                  <th className="text-left p-3 font-medium">Mode</th>
                  <th className="text-left p-3 font-medium">Origin</th>
                  <th className="text-left p-3 font-medium">Destination</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Value</th>
                  <th className="text-left p-3 font-medium">HS Code</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockResults.map((result) => (
                  <tr key={result.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{result.company_name}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant={result.mode === 'air' ? 'default' : 'secondary'}>
                        {result.mode}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">{result.origin_country}</td>
                    <td className="p-3 text-sm">{result.destination_country}</td>
                    <td className="p-3 text-sm">{formatDate(result.date)}</td>
                    <td className="p-3 text-sm">{formatCurrency(result.value)}</td>
                    <td className="p-3 text-sm font-mono">{result.hs_code}</td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToCRM(result)}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add to CRM
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing 1 - {mockResults.length} of {mockResults.length} results
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </GlossyCard>
      )}

      {/* No Results Message */}
      {hasSearched && mockResults.length === 0 && (
        <GlossyCard className="p-12 text-center">
          <div className="text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        </GlossyCard>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <GlossyCard className="p-12 text-center">
          <div className="text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Search Intelligence</h3>
            <p>Enter a search term above to find companies, products, and trade data</p>
          </div>
        </GlossyCard>
      )}
    </div>
  );
}