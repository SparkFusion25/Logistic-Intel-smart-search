import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

// Types based on your search components
export type Mode = 'all' | 'air' | 'ocean';

export interface Filters {
  date_from?: string | null;
  date_to?: string | null;
  hs_code?: string;
  origin_country?: string;
  destination_country?: string;
  destination_city?: string;
  carrier?: string;
}

export interface UnifiedRow {
  id: string;
  mode?: Mode | null;
  unified_company_name?: string;
  unified_date?: string;
  unified_carrier?: string;
  hs_code?: string;
  origin_country?: string;
  destination_country?: string;
  destination_city?: string;
  description?: string;
  bol_number?: string;
  vessel_name?: string;
  score?: number;
}

interface UseUnifiedSearchOptions {
  initialMode?: Mode;
  initialLimit?: number;
}

interface SearchParams {
  q: string;
  mode: Mode;
  filters: Partial<Filters>;
  limit: number;
  offset: number;
  page: number;
}

export function useUnifiedSearch(options: UseUnifiedSearchOptions = {}) {
  const { initialMode = 'all', initialLimit = 50 } = options;
  
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<Mode>(initialMode);
  const [filters, setFilters] = useState<Partial<Filters>>({});
  const [items, setItems] = useState<UnifiedRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(0);

  const buildSearchParams = useCallback((page = 1): SearchParams => {
    return {
      q: q.trim(),
      mode,
      filters,
      limit,
      offset: (page - 1) * limit,
      page,
    };
  }, [q, mode, filters, limit]);

  const searchAPI = useCallback(async (params: SearchParams): Promise<{
    items: UnifiedRow[];
    total: number;
    hasMore: boolean;
  }> => {
    // Use the virtual API endpoint that routes to repository
    const { makeRequest } = await import('@/hooks/useAPI');
    
    const result = await makeRequest('/api/search/unified', {
      method: 'GET',
      params: {
        q: params.q,
        mode: params.mode,
        origin_country: params.filters?.origin_country,
        destination_country: params.filters?.destination_country,
        hs_code: params.filters?.hs_code,
        carrier: params.filters?.carrier,
        date_from: params.filters?.date_from,
        date_to: params.filters?.date_to,
        limit: params.limit,
        offset: params.offset
      }
    });

    if (!result.success) {
      throw new Error(result.error || 'Search failed');
    }

    const items = Array.isArray(result.data) ? result.data : [];
    const total = result.total || result.total_count || items.length;
    const hasMore = result.pagination?.hasMore || (items.length === params.limit && total > items.length);

    return {
      items,
      total,
      hasMore,
    };
  }, []);

  const run = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = buildSearchParams(page);
      const result = await searchAPI(params);
      
      setItems(result.items);
      setTotal(result.total);
      setCurrentPage(page);
      setTotalPages(Math.ceil(result.total / limit));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setItems([]);
      setTotal(0);
      setCurrentPage(1);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [buildSearchParams, searchAPI, limit]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && !loading) {
      run(page);
    }
  }, [totalPages, loading, run]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const reset = useCallback(() => {
    setQ('');
    setMode(initialMode);
    setFilters({});
    setItems([]);
    setTotal(0);
    setError(null);
    setCurrentPage(1);
    setTotalPages(0);
  }, [initialMode]);

  return {
    // State
    q,
    mode,
    filters,
    items,
    total,
    loading,
    error,
    currentPage,
    totalPages,
    
    // Actions
    setQ,
    setMode,
    setFilters,
    run,
    goToPage,
    nextPage,
    prevPage,
    reset,
  };
}
