import { useState } from 'react';
import { Search, Filter, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useUnifiedSearch } from '@/hooks/useUnifiedSearch';
import { CompanyDetailsModal } from './CompanyDetailsModal';
import { ResultRow } from './ResultRow';
import AdvancedFilters from './AdvancedFilters';
import { PaginationControls } from './PaginationControls';
import { useCRMAPI } from '@/hooks/useCRMAPI';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedSearchPanelProps {
  className?: string;
}

export function EnhancedSearchPanel({ className }: EnhancedSearchPanelProps) {
  const { toast } = useToast();
  const { addContact, loading: crmLoading } = useCRMAPI();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const {
    q: query, setQ: setQuery, mode, setMode, filters, setFilters,
    items: results, total, loading, currentPage: page, totalPages, nextPage, prevPage, goToPage, run, reset
  } = useUnifiedSearch();

  // Enhanced mobile-first search experience
  const handleSearch = async () => {
    if (query.trim() || Object.keys(filters).length > 0) {
      await run();
    }
  };

  const handleAddToCrm = async (row: any) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to add contacts to CRM."
        });
        return;
      }

      await supabase.from('crm_contacts').upsert({
        company_name: row.unified_company_name || 'Unknown Company',
        org_id: user.data.user.id,
        source: 'search_shipment',
        notes: `Added from shipment search - Mode: ${row.mode}, Date: ${row.unified_date}`,
        tags: ['search_import', row.mode].filter(Boolean),
        created_at: new Date().toISOString()
      });

      toast({
        title: "Added to CRM",
        description: `${row.unified_company_name} has been added to your contacts.`
      });
    } catch (error) {
      console.error('CRM add error:', error);
      toast({
        variant: "destructive", 
        title: "Error adding to CRM",
        description: "Please try again later."
      });
    }
  };

  const createCompanyFromRow = (row: any) => ({
    company_name: row.unified_company_name || 'Unknown Company',
    company_id: null,
    contacts_count: 0,
    shipments_count: 1,
    last_shipment_date: row.unified_date,
    modes: row.mode ? [row.mode.toUpperCase()] : [],
    dest_countries: row.destination_country ? [row.destination_country] : [],
    top_commodities: row.description ? [row.description] : [],
    website: null,
    country: row.origin_country,
    industry: null
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mobile-optimized search header */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, products, routes..."
              className="pl-10 h-12 text-base bg-background border-border/50"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex gap-2">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-12 px-4 border-border/50 bg-background"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {Object.keys(filters).length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 rounded-full text-xs">
                      {Object.keys(filters).length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <AdvancedFilters 
                    value={filters}
                    onChange={setFilters}
                    onApply={() => {
                      setFiltersOpen(false);
                      handleSearch();
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="h-12 px-6 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2">
          {(['all', 'ocean', 'air'] as const).map((m) => (
            <Button
              key={m}
              variant={mode === m ? "default" : "outline"}
              size="sm"
              onClick={() => setMode(m)}
              className="capitalize"
            >
              {m === 'all' ? 'All Modes' : m}
            </Button>
          ))}
        </div>
      </div>

      {/* Results section */}
      {loading && results.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Searching trade data...</p>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {/* Results header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>{total.toLocaleString()} shipments found</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear search
            </Button>
          </div>

          {/* Results grid - optimized for mobile */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
            {results.map((row) => (
              <ResultRow
                key={row.id}
                row={row}
                query={query}
                onAddToCrm={handleAddToCrm}
                onViewCompany={(row) => {
                  setSelectedCompany(createCompanyFromRow(row));
                  setShowCompanyModal(true);
                }}
                loading={crmLoading}
              />
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onNext={nextPage}
            onPrev={prevPage}
            onGoToPage={goToPage}
            loading={loading}
          />
        </div>
      ) : (
        <div className="text-center py-12 space-y-3">
          <Search className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            {query || Object.keys(filters).length > 0 
              ? 'No shipments found for your search criteria' 
              : 'Enter search terms to find trade data'
            }
          </p>
        </div>
      )}

      {/* Company details modal */}
      {selectedCompany && (
        <CompanyDetailsModal
          isOpen={showCompanyModal}
          onClose={() => setShowCompanyModal(false)}
          company={selectedCompany}
        />
      )}
    </div>
  );
}