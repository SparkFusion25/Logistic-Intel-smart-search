import { useState, useCallback } from 'react';

interface APIResponse<T = any> {
  data?: T;
  error?: string;
  loading: boolean;
}

interface UseAPIOptions {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
}

export function useAPI(options: UseAPIOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T = any>(
    endpoint: string,
    config: RequestInit = {}
  ): Promise<APIResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const baseURL = options.baseURL || '';
      const url = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.defaultHeaders,
          ...config.headers,
        },
        ...config,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      setLoading(false);
      return { data, loading: false };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setLoading(false);
      return { error: errorMessage, loading: false };
    }
  }, [options.baseURL, options.defaultHeaders]);

  const get = useCallback(<T = any>(endpoint: string, config?: RequestInit) => 
    request<T>(endpoint, { ...config, method: 'GET' }), [request]);

  const post = useCallback(<T = any>(endpoint: string, data?: any, config?: RequestInit) => 
    request<T>(endpoint, { 
      ...config, 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }), [request]);

  const put = useCallback(<T = any>(endpoint: string, data?: any, config?: RequestInit) => 
    request<T>(endpoint, { 
      ...config, 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }), [request]);

  const del = useCallback(<T = any>(endpoint: string, config?: RequestInit) => 
    request<T>(endpoint, { ...config, method: 'DELETE' }), [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del,
  };
}
