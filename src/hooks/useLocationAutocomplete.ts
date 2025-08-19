// src/hooks/useLocationAutocomplete.ts
import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Lightweight country & city autocomplete backed by Supabase.
 * - Countries come from origin_country + destination_country (deduped).
 * - Cities come from destination_city (optionally filtered by country).
 * - All results are client‑deduped and alphabetized.
 *
 * Usage:
 * const { countries, cities, loading, searchCountries, searchCities, clear } = useLocationAutocomplete();
 * await searchCountries("uni"); // -> ["United Arab Emirates", "United Kingdom", "United States", ...]
 * await searchCities("United States", "los"); // -> ["Los Angeles", "Los Gatos", ...]
 */

const normalize = (v: unknown) =>
  typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();

const uniqSort = (arr: (string | null | undefined)[]) =>
  Array.from(
    new Set(
      arr
        .map((s) => normalize(s))
        .filter((s) => s.length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

type CountryRole = "any" | "origin" | "destination";

export function useLocationAutocomplete() {
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // simple in‑memory cache to cut duplicate queries while typing
  const cacheRef = useRef<Record<string, string[]>>({});

  const searchCountries = useCallback(
    async (qRaw: string, role: CountryRole = "any", limit = 50) => {
      const q = normalize(qRaw);
      const cacheKey = `countries:${role}:${q}:${limit}`;
      if (cacheRef.current[cacheKey]) {
        setCountries(cacheRef.current[cacheKey]);
        return cacheRef.current[cacheKey];
      }

      setLoading(true);
      setError(null);
      try {
        const cols =
          role === "origin"
            ? "origin_country"
            : role === "destination"
            ? "destination_country"
            : "origin_country, destination_country";

        // Pull a small, representative slice; we'll dedupe client‑side.
        // Note: using OR with ilike for both columns when role === "any".
        const base = supabase
          .from("unified_shipments")
          .select(cols, { count: "exact", head: false })
          .limit(limit);

        let res;
        if (q) {
          if (role === "origin") {
            res = await base.ilike("origin_country", `%${q}%`);
          } else if (role === "destination") {
            res = await base.ilike("destination_country", `%${q}%`);
          } else {
            // OR syntax: "col1.ilike.%foo%,col2.ilike.%foo%"
            res = await base.or(
              `origin_country.ilike.%${q}%,destination_country.ilike.%${q}%`
            );
          }
        } else {
          res = await base;
        }

        if (res.error) throw res.error;
        const rows = res.data as any[];

        const values =
          role === "origin"
            ? rows.map((r) => r.origin_country)
            : role === "destination"
            ? rows.map((r) => r.destination_country)
            : rows.flatMap((r) => [r.origin_country, r.destination_country]);

        const list = uniqSort(values);
        cacheRef.current[cacheKey] = list;
        setCountries(list);
        return list;
      } catch (e: any) {
        setError(e?.message || "Failed to load countries");
        setCountries([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchCities = useCallback(
    async (countryRaw: string | null, qRaw: string, limit = 50) => {
      const q = normalize(qRaw);
      const country = normalize(countryRaw || "");
      const cacheKey = `cities:${country}:${q}:${limit}`;
      if (cacheRef.current[cacheKey]) {
        setCities(cacheRef.current[cacheKey]);
        return cacheRef.current[cacheKey];
      }

      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from("unified_shipments")
          .select("destination_city, destination_country, origin_country", {
            count: "exact",
            head: false,
          })
          .limit(limit);

        // Filter by country if provided (matches either origin or destination country).
        if (country) {
          query = query.or(
            `destination_country.eq.${country},origin_country.eq.${country}`
          );
        }

        // Filter by city substring if provided.
        if (q) {
          query = query.ilike("destination_city", `%${q}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        const list = uniqSort((data as any[]).map((r) => r.destination_city));
        cacheRef.current[cacheKey] = list;
        setCities(list);
        return list;
      } catch (e: any) {
        setError(e?.message || "Failed to load cities");
        setCities([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clear = useCallback(() => {
    setCountries([]);
    setCities([]);
    setError(null);
  }, []);

  return {
    countries,
    cities,
    loading,
    error,
    searchCountries,
    searchCities,
    clear,
  };
}

export default useLocationAutocomplete;
