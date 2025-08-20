export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function post<T>(
  url: string, 
  body: unknown, 
  opts?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        ...(opts?.headers || {}) 
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      ...opts,
    });
    
    return await res.json();
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Request failed'
      }
    };
  }
}

export async function get<T>(
  url: string, 
  opts?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: opts?.headers || {},
      cache: 'no-store',
      ...opts,
    });
    
    return await res.json();
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Request failed'
      }
    };
  }
}

export async function patch<T>(
  url: string, 
  body: unknown, 
  opts?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json', 
        ...(opts?.headers || {}) 
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      ...opts,
    });
    
    return await res.json();
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Request failed'
      }
    };
  }
}

export async function del<T>(
  url: string, 
  opts?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: opts?.headers || {},
      cache: 'no-store',
      ...opts,
    });
    
    return await res.json();
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Request failed'
      }
    };
  }
}

// Search API types
export interface SearchRequest {
  company?: string;
  origin?: string;
  region?: string;
  mode?: 'air' | 'ocean';
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  company: string;
  mode: 'air' | 'ocean';
  est_value_usd?: number;
  confidence?: number;
  last_shipment_at?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

// CRM API types
export interface Contact {
  id: string;
  name: string;
  email: string;
  title?: string;
  phone?: string;
  company_id?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  title?: string;
  phone?: string;
  company_id?: string;
  tags?: string[];
}

// Quote API types
export interface Quote {
  id: string;
  pol: string;
  pod: string;
  mode: 'air' | 'sea';
  commodity: string;
  total_cost: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface CreateQuoteRequest {
  pol: string;
  pod: string;
  mode: 'air' | 'sea';
  commodity: string;
  total_cost: number;
  currency?: 'USD' | 'EUR';
}

// Tariff API types
export interface TariffRequest {
  originCountry: string;
  destinationCountry: string;
  hsCode: string;
}

export interface TariffResponse {
  dutyRate: number;
  vatRate: number;
  source: string;
}

// API Functions
export const searchAPI = {
  search: (params: SearchRequest) => 
    post<SearchResponse>('/api/search', params),
};

export const crmAPI = {
  getContacts: (params?: { q?: string; company_id?: string; page?: number }) => 
    get<{ contacts: Contact[]; total: number }>(`/api/crm/contacts${params ? '?' + new URLSearchParams(params as any).toString() : ''}`),
  
  createContact: (data: CreateContactRequest) =>
    post<Contact>('/api/crm/contacts', data),
  
  updateContact: (id: string, data: Partial<CreateContactRequest>) =>
    patch<Contact>(`/api/crm/contacts/${id}`, data),
  
  deleteContact: (id: string) =>
    del<void>(`/api/crm/contacts/${id}`),
};

export const quoteAPI = {
  createQuote: (data: CreateQuoteRequest) =>
    post<Quote>('/api/quotes', data),
};

export const tariffAPI = {
  calculate: (data: TariffRequest) =>
    post<TariffResponse>('/api/tariff', data),
};