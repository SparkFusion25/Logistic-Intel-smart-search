// src/hooks/useapi.ts
'use client';
import { useCallback, useState } from 'react';
import { listContacts, upsertContact, listDealsByPipeline, moveDealStage } from '@/repositories/crm.repo';
import { searchUnified } from '@/repositories/search.repo';

export interface APIResponse<T = any> {
  success: boolean;
  data: T;
  total?: number;
  total_count?: number;
  count?: number;
  pagination?: { hasMore?: boolean; limit?: number; offset?: number; page?: number };
  summary?: any;
  message?: string;
  error?: string;
  status?: number;
  raw?: any;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type MakeRequestOptions = { method?: HttpMethod; params?: Record<string, any>; body?: any; headers?: Record<string, string>; cache?: RequestCache };

const USE_SUPABASE_DIRECT = String(process.env.USE_SUPABASE_DIRECT).toLowerCase() === 'true';

async function httpRequest<T = any>(endpoint: string, opts: MakeRequestOptions = {}): Promise<APIResponse<T>> {
  const { method = 'GET', params, body, headers, cache } = opts;
  const qs = params ? `?${new URLSearchParams(Object.entries(params).reduce((a,[k,v])=>{if(v==null)return a;a[k]=String(v);return a;},{} as any)).toString()}` : '';
  const res = await fetch(`${endpoint}${qs}`, { method, headers: { 'Content-Type': 'application/json', ...(headers||{}) }, cache, body: method==='GET' ? undefined : JSON.stringify(body ?? {}) });
  let json: any = null;
  try { json = await res.json(); } catch {}
  if (!res.ok || json?.success === false) return { success: false, data: [] as any, error: json?.error || json?.message || `HTTP ${res.status}`, status: res.status, raw: json };
  const data = json?.data ?? json?.items ?? json?.results ?? json;
  const total = json?.total ?? json?.total_count ?? json?.count ?? (Array.isArray(data)?data.length:undefined);
  return { success: true, data, total, total_count: total, count: json?.count, pagination: json?.pagination, summary: json?.summary, raw: json };
}

export async function makeRequest<T = any>(endpoint: string, opts: MakeRequestOptions = {}): Promise<APIResponse<T>> {
  if (!USE_SUPABASE_DIRECT) return httpRequest<T>(endpoint, opts);

  // Route known endpoints to repos (extend as needed)
  if (endpoint.startsWith('/api/search/unified')) {
    return searchUnified(opts.params) as any;
  }
  if (endpoint.startsWith('/api/crm/contacts') && opts.method === 'POST') {
    const r = await upsertContact(opts.body || {});
    return r.success ? { success: true, data: r.contact, total: 1, total_count: 1 } : { success: false, data: [] as any, error: r.error };
  }
  if (endpoint.startsWith('/api/crm/contacts')) {
    const r = await listContacts(opts.params || {});
    return r.success ? { success: true, data: r.data, total: r.total, total_count: r.total } : { success: false, data: [] as any, error: r.error };
  }
  if (endpoint.startsWith('/api/crm/deals/move') && opts.method === 'POST') {
    const r = await moveDealStage(opts.body);
    return r.success ? { success: true, data: r.deal, total: 1, total_count: 1 } : { success: false, data: [] as any, error: r.error };
  }
  if (endpoint.startsWith('/api/crm/deals')) {
    const r = await listDealsByPipeline({ pipeline_id: (opts.params||{}).pipeline_id, search: (opts.params||{}).search, limit: (opts.params||{}).limit, offset: (opts.params||{}).offset });
    return r.success ? { success: true, data: r.data, total: r.total, total_count: r.total } : { success: false, data: [] as any, error: r.error };
  }

  // Unknown → fallback to HTTP route
  return httpRequest<T>(endpoint, opts);
}

import { useState } from 'react';
export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const request = useCallback(async <T = any>(endpoint: string, opts: MakeRequestOptions = {}): Promise<APIResponse<T>> => {
    setLoading(true); setLastError(null);
    try { const r = await makeRequest<T>(endpoint, opts); if (!r.success) setLastError(r.error || 'Unknown error'); return r; }
    catch (e: any) { const err: APIResponse<T> = { success: false, data: [] as any, error: e?.message || 'Network error', status: 0 }; setLastError(err.error!); return err; }
    finally { setLoading(false); }
  }, []);
  return { request, makeRequest, loading, error: lastError };
}

export const getTotal = (r: { total?: number; total_count?: number; data?: any }) => (typeof r.total === 'number' ? r.total : undefined) ?? (typeof r.total_count === 'number' ? r.total_count : undefined) ?? (Array.isArray(r.data) ? r.data.length : 0);