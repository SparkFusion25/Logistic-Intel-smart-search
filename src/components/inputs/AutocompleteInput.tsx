// src/components/inputs/AutocompleteInput.tsx
import * as React from 'react';

export type AutocompleteOption = { label: string; value?: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  /** Optional static list of suggestions */
  options?: AutocompleteOption[];
  /** Optional async loader for suggestions (debounced) */
  loadOptions?: (q: string) => Promise<AutocompleteOption[]>;
  className?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
};

export default function AutocompleteInput({
  value,
  onChange,
  placeholder,
  options,
  loadOptions,
  className = '',
  disabled,
  name,
  id,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState(value || '');
  const [items, setItems] = React.useState<AutocompleteOption[]>(options || []);
  const [loading, setLoading] = React.useState(false);

  // keep internal query in sync when parent value changes externally
  React.useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // update suggestions when options prop changes
  React.useEffect(() => {
    if (options && !loadOptions) setItems(options);
  }, [options, loadOptions]);

  // debounced async fetch
  React.useEffect(() => {
    if (!loadOptions) return;
    let alive = true;
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await loadOptions(query);
        if (alive) setItems(res || []);
      } finally {
        if (alive) setLoading(false);
      }
    }, 200);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [query, loadOptions]);

  const choose = (opt: AutocompleteOption) => {
    const v = opt.value ?? opt.label;
    onChange(v);
    setQuery(v);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        name={name}
        disabled={disabled}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none ring-0 placeholder:text-white/40 focus:border-white/20"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // slight delay to allow click selection
          setTimeout(() => setOpen(false), 120);
        }}
      />
      {open && (items?.length || loading) ? (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-white/10 bg-slate-900/95 shadow-xl backdrop-blur">
          {loading ? (
            <div className="px-3 py-2 text-xs text-white/60">Loading…</div>
          ) : (
            items.map((opt, i) => (
              <button
                key={`${opt.value ?? opt.label}-${i}`}
                type="button"
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-white/5"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(opt)}
              >
                <span className="truncate">{opt.label}</span>
                {opt.value && opt.value !== opt.label ? (
                  <span className="ml-2 shrink-0 text-xs text-white/40">
                    {opt.value}
                  </span>
                ) : null}
              </button>
            ))
          )}
          {!loading && (!items || items.length === 0) ? (
            <div className="px-3 py-2 text-xs text-white/50">No matches</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}