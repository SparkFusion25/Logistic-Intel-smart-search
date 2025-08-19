// src/hooks/useUnifiedSearch.ts
import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type TransportMode = "all" | "ocean" | "air";

export type UnifiedFilters = {
  q?: string | null;
  mode?: TransportMode;
  date_from?: string | null; // YYYY-MM-DD
  date_to?: string | null;   // YYYY-MM-DD
  hs_code?: string | null;
  origin_country?: string | null;
  destination_country?: string | null;
  destination_city?: string | null;
  carrier?: string | null;
};

export type UnifiedRow = {
  id: string;
  mode: TransportMode | null;
  unified_date: string | null;
  unified_company_name: string | null;
  origin_country: string | null;
  destination_country: string | null;
  destination_city: string | null;
  hs_code: string | null;
  description: string | null;
  vessel_name: string | null;
  bol_number: string | null;
  unified_carrier: string | null;
  container_count: number | null;
  gross_weight_kg: number | null;
  value_usd: number | null;
  score: number | null;
  total_count: number | null;
};

type State = {
  items: UnifiedRow[];
  total: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  limit: number;
  offset: number;
};

export function useUnifiedSearch(initialLimit = 25) {
  const [state, setState] = useState<State>({
    items: [],
    total: 0,
    loading: false,
    error: null,
    hasMore: false,
    limit: initialLimit,
    offset: 0,
  });

  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(
    async (filters: UnifiedFilters, reset = true) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      if (abortRef.current) abortRef.current.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const { data, error } = await supabase.rpc(
          "search_run" as any,
          {
            p_q: filters.q?.trim() ? filters.q.trim() : null,
            p_mode: filters.mode || "all",
            p_date_from: filters.date_from ?? null,
            p_date_to: filters.date_to ?? null,
            p_hs_code: filters.hs_code ?? null,
            p_origin_country: filters.origin_country ?? null,
            p_destination_country: filters.destination_country ?? null,
            p_destination_city: filters.destination_city ?? null,
            p_carrier: filters.carrier ?? null,
            p_limit: state.limit,
            p_offset: reset ? 0 : state.offset + state.items.length,
          }
        );

        if (error) throw error;

        const rows = (data || []) as UnifiedRow[];
        const nextItems = reset ? rows : [...state.items, ...rows];
        const total =
          rows.length && rows[0].total_count != null
            ? Number(rows[0].total_count)
            : reset
            ? rows.length
            : state.total;

        setState((s) => ({
          ...s,
          items: nextItems,
          total,
          loading: false,
          hasMore: nextItems.length < total,
          offset: reset ? 0 : s.offset,
        }));

        return rows;
      } catch (e: any) {
        if (e?.name === "AbortError") return [];
        setState((s) => ({ ...s, loading: false, error: e?.message || "Search failed" }));
        return [];
      }
    },
    [state.items, state.limit, state.offset, state.total]
  );

  const loadMore = useCallback(
    async (filters: UnifiedFilters) => {
      if (!state.hasMore || state.loading) return [];
      return search(filters, false);
    },
    [search, state.hasMore, state.loading]
  );

  return {
    items: state.items,
    total: state.total,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    limit: state.limit,
    offset: state.offset,
    search,
    loadMore,
    setLimit: (n: number) => setState((s) => ({ ...s, limit: Math.max(1, Math.min(100, n)) })),
    reset: () => setState((s) => ({ ...s, items: [], total: 0, hasMore: false, offset: 0 })),
  };
}
