// src/hooks/useUnifiedSearch.ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UnifiedSearchFilters {
  mode?: "all" | "air" | "ocean";
  company?: string;
  hs_code?: string;
  origin_country?: string;
  destination_country?: string;
  carrier?: string;
  date_from?: string; // ISO date
  date_to?: string;   // ISO date
  limit?: number;
  offset?: number;
}

export interface UnifiedSearchResult {
  id: string;
  mode: string | null;
  unified_company_name: string | null;
  hs_code: string | null;
  unified_date: string | null;
  unified_carrier: string | null;
  origin_country: string | null;
  destination_country: string | null;
  score: number;
}

export const useUnifiedSearch = (filters: UnifiedSearchFilters) => {
  const [data, setData] = useState<UnifiedSearchResult[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: rows, error } = await supabase.rpc("search_unified", {
          search_term: filters.company ?? null,
          mode: filters.mode ?? "all",
          date_from: filters.date_from ?? null,
          date_to: filters.date_to ?? null,
          hs_code: filters.hs_code ?? null,
          origin_country: filters.origin_country ?? null,
          destination_country: filters.destination_country ?? null,
          carrier: filters.carrier ?? null,
          limit_count: filters.limit ?? 25,
          offset_count: filters.offset ?? 0,
        });

        if (error) throw error;

        setData(rows ?? []);
        setTotal(rows?.length ?? 0);
      } catch (e: any) {
        console.error("Unified search error:", e);
        setError(e.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [JSON.stringify(filters)]);

  return { data, total, loading, error };
};
