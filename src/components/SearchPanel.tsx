import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { searchUnified, searchCountries, type SearchFilters, type SearchResponse } from '@/api/search';
import { upsertContact, type ContactData } from '@/api/crm';
import GlossyCard from '@/ui/GlossyCard';
import { CTAPrimary, CTAGhost } from '@/ui/CTA';
import Highlight from '@/lib/highlight';

interface SearchPanelProps {
  className?: string;
}

export default function SearchPanel({ className = '' }: SearchPanelProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'all' | 'air' | 'ocean'>('all');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [countries, setCountries] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [addingToCRM, setAddingToCRM] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 25;

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      const result = await searchCountries();
      if (result.success) {
        setCountries(result.data);
      }
    };
    loadCountries();
  }, []);

  // Get current user for CRM operations
  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  const handleSearch = async (page = 0) => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setCurrentPage(page);

    const searchFilters: SearchFilters = {
      query: searchQuery,
      mode,
      ...filters,
      limit: pageSize,
      offset: page * pageSize
    };

    try {
      const result = await searchUnified(searchFilters);
      setResults(result);

      if (!result.success) {
        toast({
          title: "Search Error",
          description: "Failed to search. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCRM = async (shipment: any) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add contacts to CRM",
        variant: "destructive"
      });
      return;
    }

    const shipmentId = shipment.id;
    setAddingToCRM(prev => new Set(prev).add(shipmentId));

    try {
      const contactData: ContactData = {
        org_id: currentUser.id,
        company_name: shipment.unified_company_name || shipment.shipper_name,
        source: 'trade-search',
        tags: ['trade-data'],
        notes: `Found via search: ${shipment.description || shipment.commodity_description || 'Trade record'}`
      };

      const result = await upsertContact(contactData);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add to CRM",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Add to CRM error:', error);
      toast({
        title: "Error",
        description: "Failed to add to CRM",
        variant: "destructive"
      });
    } finally {
      setAddingToCRM(prev => {
        const newSet = new Set(prev);
        newSet.delete(shipmentId);
        return newSet;
      });
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <GlossyCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Search Query</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Company name, commodity, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Mode</label>
            <Tabs value={mode} onValueChange={(value) => setMode(value as typeof mode)} className="w-fit">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="air">Air</TabsTrigger>
                <TabsTrigger value="ocean">Ocean</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <CTAPrimary onClick={() => handleSearch()} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </CTAPrimary>
        </div>
      </GlossyCard>

      {/* Advanced Filters */}
      <GlossyCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Origin Country</label>
            <Select value={filters.origin_country || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, origin_country: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Countries</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Destination Country</label>
            <Select value={filters.destination_country || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, destination_country: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Countries</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">HS Code</label>
            <Input
              placeholder="e.g. 8708"
              value={filters.hs_code || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, hs_code: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Carrier</label>
            <Input
              placeholder="Carrier name"
              value={filters.carrier || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, carrier: e.target.value }))}
            />
          </div>
        </div>
      </GlossyCard>

      {/* Results */}
      {results && (
        <GlossyCard className="p-6">
          {/* Summary */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h3 className="text-lg font-semibold">Search Results</h3>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  Total: {results.total.toLocaleString()}
                </Badge>
                <Badge variant="secondary">
                  Air: {results.summary.air_count.toLocaleString()}
                </Badge>
                <Badge variant="secondary">
                  Ocean: {results.summary.ocean_count.toLocaleString()}
                </Badge>
                <Badge variant="secondary">
                  Value: {formatCurrency(results.summary.total_value)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="table-wrap">
            <table className="table-enhanced">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Mode</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Date</th>
                  <th>Value</th>
                  <th>HS Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.data.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>
                      <div className="font-medium">
                        <Highlight text={shipment.unified_company_name || shipment.shipper_name || 'Unknown'} query={searchQuery} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Highlight text={shipment.description || shipment.commodity_description || ''} query={searchQuery} />
                      </div>
                    </td>
                    <td>
                      <Badge variant={shipment.mode === 'air' ? 'default' : 'secondary'}>
                        {shipment.mode || 'N/A'}
                      </Badge>
                    </td>
                    <td className="text-sm">
                      {shipment.origin_country || shipment.port_of_loading || 'N/A'}
                    </td>
                    <td className="text-sm">
                      {shipment.destination_country || shipment.port_of_discharge || 'N/A'}
                    </td>
                    <td className="text-sm">
                      {formatDate(shipment.unified_date)}
                    </td>
                    <td className="text-sm">
                      {formatCurrency(shipment.unified_value)}
                    </td>
                    <td className="text-sm font-mono">
                      {shipment.hs_code || 'N/A'}
                    </td>
                    <td>
                      <CTAPrimary
                        size="sm"
                        onClick={() => handleAddToCRM(shipment)}
                        disabled={addingToCRM.has(shipment.id)}
                        className="text-xs"
                      >
                        {addingToCRM.has(shipment.id) ? (
                          <>Adding...</>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Add to CRM
                          </>
                        )}
                      </CTAPrimary>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {results.total > pageSize && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, results.total)} of {results.total} results
              </div>
              <div className="flex gap-2">
                <CTAGhost
                  onClick={() => handleSearch(currentPage - 1)}
                  disabled={currentPage === 0 || loading}
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </CTAGhost>
                <CTAGhost
                  onClick={() => handleSearch(currentPage + 1)}
                  disabled={!results.pagination.hasMore || loading}
                  size="sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </CTAGhost>
              </div>
            </div>
          )}
        </GlossyCard>
      )}

      {/* No Results */}
      {results && results.data.length === 0 && (
        <GlossyCard className="p-12 text-center">
          <div className="text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        </GlossyCard>
      )}
    </div>
  );
}