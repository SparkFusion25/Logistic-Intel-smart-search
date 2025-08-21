// src/hooks/useapi.ts
'use client';

export interface PaginationMeta {
  hasMore?: boolean;
  limit?: number;
  offset?: number;
  page?: number;
}

export interface APIResponse<T = any, M = any> {
  // canonical fields
  success: boolean;
  data: T;
  total?: number;                // unified/search endpoints often use "total"
  total_count?: number;          // some CRM screens expect "total_count"
  count?: number;                // some list endpoints return "count"
  pagination?: PaginationMeta;   // normalized pagination
  summary?: any;                 // search/unified summary block
  message?: string;              // optional message on success
  error?: string;                // populated on failure
  status?: number;               // HTTP status for error handling
  meta?: M;                      // extra metadata if needed
  raw?: any;                     // original JSON (for debugging/migration)
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type MakeRequestOptions = {
  method?: HttpMethod;
  params?: Record<string, string | number | boolean | null | undefined>;
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
};

/** Build a query string from params, skipping null/undefined */
function toQuery(params?: MakeRequestOptions['params']) {
  if (!params) return '';
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === undefined) continue;
    qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}

/** Normalize various API shapes into one predictable payload */
function normalizePayload<T = any>(json: any): APIResponse<T> {
  // Prefer arrays/lists from: data | items | results | rows
  let data: any =
    json?.data ??
    json?.items ??
    json?.results ??
    json?.rows ??
    json;

  // Allow non-array single objects too
  // (most of our callers expect arrays; leave objects as-is)
  const pagination: PaginationMeta | undefined =
    json?.pagination ??
    (typeof json?.page === 'number' || typeof json?.limit === 'number'
      ? { page: json.page, limit: json.limit, offset: json.offset }
      : undefined);

  // Compute a unified total for convenience
  const computedTotal =
    json?.total ??
    json?.total_count ??
    json?.count ??
    (Array.isArray(data) ? data.length : undefined);

  return {
    success: json?.success ?? true, // many endpoints return success: true
    data,
    total: json?.total ?? computedTotal,
    total_count: json?.total_count ?? computedTotal,
    count: json?.count,
    pagination,
    summary: json?.summary,
    message: json?.message,
    error: json?.error,
    meta: json?.meta,
    raw: json, // keep original for debugging
  };
}

/** Low-level request helper (no React state) */
export async function makeRequest<T = any, M = any>(
  endpoint: string,
  opts: MakeRequestOptions = {}
): Promise<APIResponse<T, M>> {
  const { method = 'GET', params, body, headers, cache } = opts;

  const url = `${endpoint}${toQuery(params)}`;
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    cache,
  };

  if (body != null && method !== 'GET') {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const res = await fetch(url, init);

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // empty body or non-JSON — treat as error if not ok
    if (!res.ok) {
      return {
        success: false,
        data: [] as any,
        error: `HTTP ${res.status} ${res.statusText}`,
        status: res.status,
        raw: null,
      };
    }
    // ok but empty — return minimal success
    return {
      success: true,
      data: [] as any,
      total: 0,
      total_count: 0,
      raw: null,
    };
  }

  if (!res.ok || json?.success === false) {
    // unify error shape
    return {
      success: false,
      data: (json?.data ?? []) as any,
      error: json?.error || json?.message || `HTTP ${res.status} ${res.statusText}`,
      status: res.status,
      raw: json,
    };
  }

  // success path — normalize
  // Virtual endpoint mapping for direct Supabase access
  if (endpoint.startsWith('/api/search/unified')) {
    const { searchUnified } = await import('@/repositories/search.repo');
    const result = await searchUnified(opts?.params || {});
    return result.success 
      ? { success: true, data: result.data as any, total: result.total, total_count: result.total, pagination: result.pagination }
      : { success: false, data: [] as any, error: (result as any).error };
  }
  
  if (endpoint.startsWith('/api/search/companies')) {
    const { searchCompanies } = await import('@/repositories/search.repo');
    const result = await searchCompanies(opts?.params || {});
    return result.success 
      ? { success: true, data: result.data as any, total: result.total, total_count: result.total }
      : { success: false, data: [] as any, error: (result as any).error };
  }

  return normalizePayload<T>(json);
}

/** Optional React wrapper if you want loading/error state */
import { useCallback, useState } from 'react';

export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const request = useCallback(
    async <T = any, M = any>(
      endpoint: string,
      opts: MakeRequestOptions = {}
    ): Promise<APIResponse<T, M>> => {
      setLoading(true);
      setLastError(null);
      try {
        const res = await makeRequest<T, M>(endpoint, opts);
        if (!res.success) setLastError(res.error ?? 'Unknown error');
        return res;
      } catch (e: any) {
        const err: APIResponse<T, M> = {
          success: false,
          data: [] as any,
          error: e?.message ?? 'Network error',
          status: 0,
        };
        setLastError(err.error!);
        return err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { request, loading, error: lastError };
}
