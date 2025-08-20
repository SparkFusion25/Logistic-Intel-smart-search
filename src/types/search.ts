// Core search types
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
  value_usd?: number;
  gross_weight_kg?: number;
  container_count?: number;
}

export interface SearchResponse {
  items: UnifiedRow[];
  total: number;
  hasMore: boolean;
  page?: number;
  limit?: number;
}

export interface SearchParams {
  q?: string;
  mode?: Mode;
  filters?: Partial<Filters>;
  limit?: number;
  offset?: number;
}

// AI Assist types
export interface AIAssistRequest {
  query: string;
  filters: Partial<Filters>;
  lastResults: UnifiedRow[];
}

export interface AIAssistResponse {
  suggestions: string[];
  structured: Partial<Filters> | null;
  summary: string | null;
}

// Autocomplete types
export interface AutocompleteOption {
  label: string;
  value?: string;
  group?: string;
  frequency?: number;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  mode: 'air' | 'ocean';
  frequency?: number;
  lastSeen?: string;
}

export interface Commodity {
  id: string;
  hsCode: string;
  description: string;
  category?: string;
  frequency?: number;
  aliases?: string[];
}

// Search error types
export interface SearchError {
  message: string;
  code?: string;
  details?: any;
}

// Search context/state
export interface SearchState {
  query: string;
  mode: Mode;
  filters: Partial<Filters>;
  results: UnifiedRow[];
  total: number;
  loading: boolean;
  error: SearchError | null;
  hasMore: boolean;
  page: number;
  limit: number;
}

// Search actions
export type SearchAction = 
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_MODE'; payload: Mode }
  | { type: 'SET_FILTERS'; payload: Partial<Filters> }
  | { type: 'SEARCH_START' }
  | { type: 'SEARCH_SUCCESS'; payload: SearchResponse }
  | { type: 'SEARCH_ERROR'; payload: SearchError }
  | { type: 'LOAD_MORE_START' }
  | { type: 'LOAD_MORE_SUCCESS'; payload: UnifiedRow[] }
  | { type: 'RESET' };

// Export configurations
export interface ExportConfig {
  format: 'csv' | 'json' | 'xlsx';
  includeMetadata?: boolean;
  maxRecords?: number;
}

export interface ExportData {
  searchQuery: string;
  filters: Partial<Filters>;
  exportDate: string;
  totalRecords: number;
  data: UnifiedRow[];
}
