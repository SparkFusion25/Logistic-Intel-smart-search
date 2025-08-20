import { useState, useCallback } from 'react';

interface APIResponse<T = any> {
  data?: T;
  error?: string;
  loading: boolean;
  success?: boolean;
}

interface UseAPIOptions {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
}

interface ExtendedRequestInit extends Omit<RequestInit, 'body'> {
  params?: Record<string, any>;
  body?: any; // Allow any type for body - we'll handle JSON.stringify internally
}

export function useAPI(options: UseAPIOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T = any>(
    endpoint: string,
    config: ExtendedRequestInit = {}
  ): Promise<APIResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const baseURL = options.baseURL || '';
      let url = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint}`;
      
      // Handle params by converting to query string
      if (config.params) {
        const searchParams = new URLSearchParams();
        Object.entries(config.params).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, String(value));
          }
        });
        
        const queryString = searchParams.toString();
        if (queryString) {
          url += (url.includes('?') ? '&' : '?') + queryString;
        }
      }

      // Remove params from config before passing to fetch
      const { params, body, ...fetchConfig } = config;
      
      // Handle body - automatically stringify objects
      let processedBody: string | FormData | Blob | ArrayBufferView | ArrayBuffer | ReadableStream | null = null;
      if (body !== undefined) {
        if (typeof body === 'string' || body instanceof FormData || body instanceof Blob || 
            body instanceof ArrayBuffer || body instanceof ReadableStream) {
          processedBody = body;
        } else {
          processedBody = JSON.stringify(body);
        }
      }
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.defaultHeaders,
          ...fetchConfig.headers,
        },
        body: processedBody,
        ...fetchConfig,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      setLoading(false);
      return { data, loading: false, success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setLoading(false);
      return { error: errorMessage, loading: false, success: false };
    }
  }, [options.baseURL, options.defaultHeaders]);

  const get = useCallback(<T = any>(endpoint: string, config?: ExtendedRequestInit) => 
    request<T>(endpoint, { ...config, method: 'GET' }), [request]);

  const post = useCallback(<T = any>(endpoint: string, data?: any, config?: ExtendedRequestInit) => 
    request<T>(endpoint, { 
      ...config, 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }), [request]);

  const put = useCallback(<T = any>(endpoint: string, data?: any, config?: ExtendedRequestInit) => 
    request<T>(endpoint, { 
      ...config, 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }), [request]);

  const del = useCallback(<T = any>(endpoint: string, config?: ExtendedRequestInit) => 
    request<T>(endpoint, { ...config, method: 'DELETE' }), [request]);

  return {
    loading,
    error,
    request,
    makeRequest: request, // Alias for backward compatibility
    get,
    post,
    put,
    delete: del,
  };
}
