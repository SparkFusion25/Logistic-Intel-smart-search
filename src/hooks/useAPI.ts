import { useState } from 'react';

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any;
}

interface APIRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async <T = any>(
    endpoint: string, 
    options: APIRequestOptions = {}
  ): Promise<APIResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const { method = 'GET', body, headers = {} } = options;

      // Ensure endpoint starts with /api if it's a relative path
      const url = endpoint.startsWith('/api') 
        ? endpoint 
        : endpoint.startsWith('/') 
          ? `/api${endpoint}`
          : `/api/${endpoint}`;

      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    makeRequest,
    loading,
    error,
  };
}

// Specialized hook for CRM operations
export function useCRMAPI() {
  const { makeRequest, loading, error } = useAPI();

  const addContact = async (contactData: any) => {
    return makeRequest('/crm/contacts', {
      method: 'POST',
      body: contactData,
    });
  };

  const getContacts = async (page = 0, limit = 50, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }

    return makeRequest(`/crm/contacts?${params.toString()}`);
  };

  const updateContact = async (contactId: string, updates: any) => {
    return makeRequest(`/crm/contacts/${contactId}`, {
      method: 'PUT',
      body: updates,
    });
  };

  const deleteContact = async (contactId: string) => {
    return makeRequest(`/crm/contacts/${contactId}`, {
      method: 'DELETE',
    });
  };

  return {
    addContact,
    getContacts,
    updateContact,
    deleteContact,
    loading,
    error,
  };
}
