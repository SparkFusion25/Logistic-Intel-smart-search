// src/components/search/AdvancedFilters.tsx
import React, { useEffect, useMemo, useState } from 'react';
import AutocompleteInput from '@/components/inputs/AutocompleteInput';
import type { Filters } from '@/types/search';
import { WORLD_COUNTRIES, MAJOR_CITIES } from '@/data/locations';

/**
 * AdvancedFilters
 * - Mobile-first, collapsible-ready container (keeps DOM light)
 * - HS code, date range, geo (origin/destination), carrier
 * - Debounced autocomplete inputs for countries/cities
 * - No hard coupling to search logic — parent owns value + onChange
 */

const field = (v: any) => (typeof v === 'string' ? v : v == null ? '' : String(v));

export default function AdvancedFilters({
  value,
  onChange,
  onApply,
  onClear
}: {
  value?: Filters;
  onChange?: (next: Filters) => void;
  onApply?: () => void;
  onClear?: () => void;
}) {
  const [local, setLocal] = useState<Filters>({
    date_from: value?.date_from ?? null,
    date_to: value?.date_to ?? null,
    hs_code: value?.hs_code ?? '',
    origin_country: value?.origin_country ?? '',
    destination_country: value?.destination_country ?? '',
    destination_city: value?.destination_city ?? '',
    carrier: value?.carrier ?? ''
  });

  // keep local state in sync if parent changes (e.g., AI applied filters)
  useEffect(() => {
    setLocal({
      date_from: value?.date_from ?? null,
      date_to: value?.date_to ?? null,
      hs_code: value?.hs_code ?? '',
      origin_country: value?.origin_country ?? '',
      destination_country: value?.destination_country ?? '',
      destination_city: value?.destination_city ?? '',
      carrier: value?.carrier ?? ''
    });
  }, [
    value?.date_from,
    value?.date_to,
    value?.hs_code,
    value?.origin_country,
    value?.destination_country,
    value?.destination_city,
    value?.carrier
  ]);

  const applyDisabled = useMemo(() => false, [local]);

  const push = (next: Partial<Filters>) => {
    const merged = { ...local, ...next } as Filters;
    setLocal(merged);
    onChange?.(merged);
  };

  const clear = () => {
    const cleared: Filters = {
      date_from: null,
      date_to: null,
      hs_code: '',
      origin_country: '',
      destination_country: '',
      destination_city: '',
      carrier: ''
    };
    setLocal(cleared);
    onChange?.(cleared);
    onClear?.();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Filters</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date Range</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={field(local.date_from)}
              onChange={(e) => push({ date_from: e.target.value || null })}
              className="flex-1 rounded-lg bg-background border-2 border-border px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="From"
            />
            <input
              type="date"
              value={field(local.date_to)}
              onChange={(e) => push({ date_to: e.target.value || null })}
              className="flex-1 rounded-lg bg-background border-2 border-border px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="To"
            />
          </div>
        </div>

        {/* HS code */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">HS Code</label>
          <input
            value={field(local.hs_code)}
            onChange={(e) => push({ hs_code: e.target.value })}
            className="w-full rounded-lg bg-background border-2 border-border px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="Enter HS code..."
            inputMode="numeric"
          />
        </div>

        {/* Origin country */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Origin Country</label>
          <AutocompleteInput
            value={field(local.origin_country)}
            onChange={(v) => push({ origin_country: v })}
            options={WORLD_COUNTRIES.map((l) => ({ label: l }))}
            placeholder="Select or type country..."
          />
        </div>

        {/* Destination country */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Destination Country</label>
          <AutocompleteInput
            value={field(local.destination_country)}
            onChange={(v) => push({ destination_country: v })}
            options={WORLD_COUNTRIES.map((l) => ({ label: l }))}
            placeholder="Select or type country..."
          />
        </div>

        {/* Destination city */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Destination City</label>
          <AutocompleteInput
            value={field(local.destination_city)}
            onChange={(v) => push({ destination_city: v })}
            options={MAJOR_CITIES.map((l) => ({ label: l }))}
            placeholder="Select or type city..."
          />
        </div>

        {/* Carrier */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Carrier</label>
          <input
            value={field(local.carrier)}
            onChange={(e) => push({ carrier: e.target.value })}
            className="w-full rounded-lg bg-background border-2 border-border px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="Enter carrier name..."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          className="btn-primary px-6 py-2 text-sm font-medium flex-1 sm:flex-none"
          disabled={applyDisabled}
          onClick={onApply}
        >
          Apply Filters
        </button>
        <button
          className="btn-secondary px-6 py-2 text-sm font-medium flex-1 sm:flex-none"
          onClick={clear}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}