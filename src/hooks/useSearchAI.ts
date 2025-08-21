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

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Generate intelligent suggestions based on query and results
      const suggestions: string[] = [];
      const structured: Record<string, any> = {};
      let summary = '';

      // Analyze query for suggestions
      const queryLower = query.toLowerCase();
      
      if (queryLower.includes('electronics')) {
        suggestions.push('HS 8504 power supplies', 'HS 8517 phones', 'HS 8471 computers');
        summary = 'Electronics query detected - showing related HS codes and suppliers';
      } else if (queryLower.includes('furniture')) {
        suggestions.push('HS 9403 furniture', 'Vietnam exporters', 'top manufacturers');
        summary = 'Furniture trade patterns - Vietnam is a key supplier';
      } else if (queryLower.includes('textile')) {
        suggestions.push('HS 6109 t-shirts', 'Bangladesh suppliers', 'cotton importers');
        summary = 'Textile industry insights - Bangladesh dominates apparel exports';
      } else if (lastResults.length > 0) {
        // Generate suggestions based on results
        const companies = Array.from(new Set(lastResults.map(r => r.unified_company_name).filter(Boolean)));
        const modes = Array.from(new Set(lastResults.map(r => r.mode).filter(Boolean)));
        const countries = Array.from(new Set(lastResults.map(r => r.origin_country).filter(Boolean)));
        
        if (companies.length > 0) suggestions.push(`top ${companies[0]} competitors`);
        if (modes.length > 0) suggestions.push(`${modes[0]} freight rates`);
        if (countries.length > 0) suggestions.push(`${countries[0]} trade regulations`);
        
        summary = `Found ${lastResults.length} results. Consider exploring related companies and trade patterns.`;
      } else {
        suggestions.push('solar panels importers', 'China exporters', 'ocean freight rates');
        summary = 'Try searching for specific products, companies, or HS codes to get better insights.';
      }

      setState(prev => ({
        ...prev,
        loading: false,
        suggestions,
        structured: Object.keys(structured).length > 0 ? structured : null,
        summary,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to generate AI suggestions',
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
