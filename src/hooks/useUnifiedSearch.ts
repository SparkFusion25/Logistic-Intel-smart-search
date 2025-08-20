import { useState, useCallback } from 'react';

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
}

export function useUnifiedSearch(options: UseUnifiedSearchOptions = {}) {
  const { initialMode = 'all', initialLimit = 25 } = options;
  
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<Mode>(initialMode);
  const [filters, setFilters] = useState<Partial<Filters>>({});
  const [items, setItems] = useState<UnifiedRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [limit] = useState(initialLimit);
  const [offset, setOffset] = useState(0);

  const buildSearchParams = useCallback((searchOffset = 0): SearchParams => {
    return {
      q: q.trim(),
      mode,
      filters,
      limit,
      offset: searchOffset,
    };
  }, [q, mode, filters, limit]);

  const searchAPI = useCallback(async (params: SearchParams): Promise<{
    items: UnifiedRow[];
    total: number;
    hasMore: boolean;
  }> => {
    const searchParams = new URLSearchParams();
    
    if (params.q) searchParams.set('q', params.q);
    if (params.mode !== 'all') searchParams.set('mode', params.mode);
    searchParams.set('limit', params.limit.toString());
    searchParams.set('offset', params.offset.toString());
    
    // Add filters
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });

    const response = await fetch(`/api/search/unified?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      items: data.items || [],
      total: data.total || 0,
      hasMore: data.hasMore || false,
    };
  }, []);

  const run = useCallback(async (resetOffset = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchOffset = resetOffset ? 0 : offset;
      const params = buildSearchParams(searchOffset);
      const result = await searchAPI(params);
      
      if (resetOffset) {
        setItems(result.items);
        setOffset(limit);
      } else {
        setItems(prev => [...prev, ...result.items]);
        setOffset(prev => prev + limit);
      }
      
      setTotal(result.total);
      setHasMore(result.hasMore);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      
      if (resetOffset) {
        setItems([]);
        setTotal(0);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [buildSearchParams, searchAPI, offset, limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      run(false);
    }
  }, [loading, hasMore, run]);

  const reset = useCallback(() => {
    setQ('');
    setMode(initialMode);
    setFilters({});
    setItems([]);
    setTotal(0);
    setError(null);
    setHasMore(false);
    setOffset(0);
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
    hasMore,
    
    // Actions
    setQ,
    setMode,
    setFilters,
    run,
    loadMore,
    reset,
  };
}
