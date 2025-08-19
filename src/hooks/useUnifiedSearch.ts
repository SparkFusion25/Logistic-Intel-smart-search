// src/hooks/useUnifiedSearch.ts
import { useCallback, useMemo, useRef, useState } from 'react';
import type { Filters, Mode, UnifiedRow } from '@/types/search';

export type UseUnifiedSearchOptions = { initialMode?: Mode; initialLimit?: number };

export function useUnifiedSearch(opts: UseUnifiedSearchOptions = {}) {
  const initialMode = opts.initialMode ?? 'all';
  const limit = opts.initialLimit ?? 25;

  const [mode, setMode] = useState<Mode>(initialMode);
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [items, setItems] = useState<UnifiedRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const hasMore = useMemo(() => offset + items.length < total, [offset, items, total]);

  const run = useCallback(async (reset: boolean = true) => {
    setLoading(true); setError(null);
    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const nextOffset = reset ? 0 : offset + items.length;
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (mode) params.set('mode', mode);
      if (filters.date_from) params.set('date_from', filters.date_from);
      if (filters.date_to) params.set('date_to', filters.date_to);
      if (filters.hs_code) params.set('hs_code', filters.hs_code);
      if (filters.origin_country) params.set('origin_country', filters.origin_country);
      if (filters.destination_country) params.set('destination_country', filters.destination_country);
      if (filters.destination_city) params.set('destination_city', filters.destination_city);
      if (filters.carrier) params.set('carrier', filters.carrier);
      params.set('limit', String(limit));
      params.set('offset', String(nextOffset));

      const res = await fetch(`/api/search/unified?${params.toString()}`, { signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list = (json?.data || []) as UnifiedRow[];
      const merged = reset ? list : [...items, ...list];
      setItems(merged);
      setTotal(Number(json?.total ?? (merged[0]?.total_count ?? merged.length)));
      if (reset) setOffset(0);
    } catch (e: any) {
      if (e?.name !== 'AbortError') setError(e?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [q, mode, filters, limit, offset, items]);

  const loadMore = useCallback(async () => { if (!hasMore || loading) return; await run(false); }, [hasMore, loading, run]);
  const resetAndRun = useCallback(() => run(true), [run]);

  return { q, setQ, mode, setMode, filters, setFilters, items, total, loading, error, hasMore, run: resetAndRun, loadMore } as const;
}

export default useUnifiedSearch;