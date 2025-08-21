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
