// src/hooks/useLocationAutocomplete.ts
import { useEffect, useMemo, useState } from 'react';

export function useLocationAutocomplete(opts?: { destinationCountryHint?: string }) {
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    let mounted = true; setLoadingCountries(true);
    fetch('/api/search/countries').then(r => r.json()).then(j => {
      if (!mounted) return; setCountries((j?.countries || []) as string[]);
    }).catch(() => {
      if (mounted) setCountries(['United States','China','Mexico','Germany','United Kingdom','India','Vietnam']);
    }).finally(() => { if (mounted) setLoadingCountries(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true; setLoadingCities(true);
    const p = opts?.destinationCountryHint ? `?country=${encodeURIComponent(opts.destinationCountryHint)}` : '';
    fetch(`/api/search/cities${p}`).then(r => r.json()).then(j => {
      if (!mounted) return; setCities((j?.cities || []) as string[]);
    }).catch(() => { if (mounted) setCities(['Los Angeles','New York','Chicago','Houston','Dallas','Miami']); })
      .finally(() => { if (mounted) setLoadingCities(false); });
    return () => { mounted = false; };
  }, [opts?.destinationCountryHint]);

  const countryOptions = useMemo(() => countries.map((c) => ({ label: c })), [countries]);
  const cityOptions = useMemo(() => cities.map((c) => ({ label: c })), [cities]);

  return { countryOptions, cityOptions, loadingCountries, loadingCities } as const;
}

export default useLocationAutocomplete;