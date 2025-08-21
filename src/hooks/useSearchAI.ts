import { useState, useCallback } from 'react';

interface SearchAIState {
  suggestions: string[];
  structured: Record<string, any> | null;
  summary: string | null;
  loading: boolean;
  error: string | null;
}

export default function useSearchAI() {
  const [state, setState] = useState<SearchAIState>({
    suggestions: [],
    structured: null,
    summary: null,
    loading: false,
    error: null,
  });

  const assist = useCallback(async (
    query: string,
    filters: any,
    lastResults: any[]
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('search-ai-assist', {
        body: {
          query: query.trim(),
          filters,
          lastResults: lastResults.slice(0, 10), // Send only first 10 results for context
        },
      });

      if (error) {
        throw new Error(error.message || 'AI assist failed');
      }

      setState(prev => ({
        ...prev,
        loading: false,
        suggestions: data.suggestions || [],
        structured: data.structured || null,
        summary: data.summary || null,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI assist failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const clear = useCallback(() => {
    setState({
      suggestions: [],
      structured: null,
      summary: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    assist,
    clear,
  };
}
