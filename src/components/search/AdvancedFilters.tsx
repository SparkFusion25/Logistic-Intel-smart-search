// src/components/search/AdvancedFilters.tsx
import React from "react";
import AutocompleteInput from "@/components/inputs/AutocompleteInput";
import { useLocationAutocomplete } from "@/hooks/useLocationAutocomplete";

export type Filters = {
  date_from?: string | null;
  date_to?: string | null;
  hs_code?: string | null;
  origin_country?: string | null;
  destination_country?: string | null;
  destination_city?: string | null;
  carrier?: string | null;
};

type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
  onApply?: () => void;
  dense?: boolean; // use true inside the mobile drawer
  className?: string;
};

const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
> = ({ label, ...props }) => (
  <label className="block space-y-1">
    {label ? <span className="text-xs text-ink-300">{label}</span> : null}
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-xl2 bg-white/5 text-white placeholder:text-ink-300 outline-none border border-white/10 focus:border-brand-400 ${props.className || ""}`}
    />
  </label>
);

export default function AdvancedFilters({
  value,
  onChange,
  onApply,
  dense,
  className,
}: Props) {
  const { searchCountries, searchCities } = useLocationAutocomplete();

  return (
    <div className={className}>
      <div className={dense ? "space-y-2" : "space-y-3"}>
        <Input
          label="HS Code"
          placeholder="e.g., 8471"
          value={value.hs_code ?? ""}
          onChange={(e) => onChange({ ...value, hs_code: e.target.value || null })}
        />

        <AutocompleteInput
          label="Origin Country"
          placeholder="Type to search…"
          value={value.origin_country ?? ""}
          onChange={(v) => onChange({ ...value, origin_country: v || null })}
          onSelect={(v) => onChange({ ...value, origin_country: v || null })}
          fetchOptions={(term) => searchCountries(term, "origin")}
          minChars={1}
        />

        <AutocompleteInput
          label="Destination Country"
          placeholder="Type to search…"
          value={value.destination_country ?? ""}
          onChange={(v) => onChange({ ...value, destination_country: v || null })}
          onSelect={(v) => onChange({ ...value, destination_country: v || null })}
          fetchOptions={(term) => searchCountries(term, "destination")}
          minChars={1}
        />

        <AutocompleteInput
          label="Destination City"
          placeholder="e.g., Los Angeles"
          value={value.destination_city ?? ""}
          onChange={(v) => onChange({ ...value, destination_city: v || null })}
          onSelect={(v) => onChange({ ...value, destination_city: v || null })}
          fetchOptions={(term) =>
            searchCities(value.destination_country ?? null, term)
          }
          minChars={2}
        />

        <Input
          label="Carrier"
          placeholder="e.g., Maersk / AA"
          value={value.carrier ?? ""}
          onChange={(e) => onChange({ ...value, carrier: e.target.value || null })}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="From"
            type="date"
            value={value.date_from ?? ""}
            onChange={(e) => onChange({ ...value, date_from: e.target.value || null })}
          />
          <Input
            label="To"
            type="date"
            value={value.date_to ?? ""}
            onChange={(e) => onChange({ ...value, date_to: e.target.value || null })}
          />
        </div>

        {onApply ? (
          <button
            className="w-full mt-1 px-3 py-2 rounded-xl2 bg-brand-500 hover:bg-brand-400"
            onClick={onApply}
          >
            Apply Filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
