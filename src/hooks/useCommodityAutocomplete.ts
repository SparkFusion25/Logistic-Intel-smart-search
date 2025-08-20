import { useState, useEffect, useCallback } from 'react';
import { useAPI } from './useAPI';

interface Commodity {
  id: string;
  hsCode: string;
  description: string;
  category?: string;
  frequency?: number;
  aliases?: string[];
}

interface UseCommodityAutocompleteOptions {
  minLength?: number;
  debounceMs?: number;
  limit?: number;
  searchMode?: 'code' | 'description' | 'both';
}

export function useCommodityAutocomplete(options: UseCommodityAutocompleteOptions = {}) {
  const { minLength = 2, debounceMs = 300, limit = 10, searchMode = 'both' } = options;
  const [query, setQuery] = useState('');
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { request } = useAPI();

  const searchCommodities = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < minLength) {
      setCommodities([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: limit.toString(),
        mode: searchMode,
      });

      const { data, error: apiError } = await request({ commodities: Commodity[] }>(
        `/api/commodities/autocomplete?${params.toString()}`
      );

      if (apiError) {
        setError(apiError);
        setCommodities([]);
      } else if (data?.commodities) {
        setCommodities(data.commodities);
      } else {
        setCommodities([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search commodities');
      setCommodities([]);
    } finally {
      setIsLoading(false);
    }
  }, [get, minLength, limit, searchMode]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCommodities(query);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, searchCommodities, debounceMs]);

  const selectCommodity = useCallback((commodity: Commodity) => {
    setQuery(`${commodity.hsCode} - ${commodity.description}`);
    setCommodities([]);
  }, []);

  const clearCommodities = useCallback(() => {
    setCommodities([]);
    setQuery('');
    setError(null);
  }, []);

  // Format commodity for display
  const formatCommodity = useCallback((commodity: Commodity) => {
    return `${commodity.hsCode} - ${commodity.description}`;
  }, []);

  return {
    query,
    setQuery,
    commodities,
    isLoading,
    error,
    selectCommodity,
    clearCommodities,
    searchCommodities,
    formatCommodity,
  };
}
