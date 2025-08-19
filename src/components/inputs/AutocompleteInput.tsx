// src/components/inputs/AutocompleteInput.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
export type AutocompleteOption = { label: string; value?: string } | string;
export type AutocompleteInputProps = { value?: string; onChange?: (v: string) => void; options?: AutocompleteOption[]; placeholder?: string; loading?: boolean; debounceMs?: number; className?: string; };
const asLabel = (o: AutocompleteOption): string => (typeof o === 'string' ? o : o?.label ?? '');
const asValue = (o: AutocompleteOption): string => (typeof o === 'string' ? o : o?.value ?? o?.label ?? '');
export default function AutocompleteInput({ value, onChange, options = [], placeholder, loading, debounceMs = 120, className }: AutocompleteInputProps) {
  const [query, setQuery] = useState(value ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => setQuery(value ?? ''), [value]);
  useEffect(() => { const onDocClick = (e: MouseEvent) => { if (!wrapRef.current) return; if (!wrapRef.current.contains(e.target as Node)) setOpen(false); }; document.addEventListener('mousedown', onDocClick); return () => document.removeEventListener('mousedown', onDocClick); }, []);
  const filtered = useMemo(() => { const q = (query || '').toLowerCase(); if (!q) return options.slice(0, 8); return options.filter((o) => asLabel(o).toLowerCase().includes(q)).slice(0, 8); }, [options, query]);
  const commit = (v: string) => { onChange?.(v); setOpen(false); };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) { setOpen(true); return; } if (!open) return; if (e.key === 'ArrowDown') setActive((i) => Math.min(filtered.length - 1, i + 1)); if (e.key === 'ArrowUp') setActive((i) => Math.max(0, i - 1)); if (e.key === 'Enter') commit(asValue(filtered[active] ?? query)); if (e.key === 'Escape') setOpen(false); };
  const onChangeDebounced = (v: string) => { setQuery(v); if (timer.current) window.clearTimeout(timer.current); timer.current = window.setTimeout(() => onChange?.(v), debounceMs); };
  return (
    <div className={`relative ${className ?? ''}`} ref={wrapRef}>
      <input value={query} onChange={(e) => onChangeDebounced(e.target.value)} onFocus={() => setOpen(true)} onKeyDown={onKeyDown} placeholder={placeholder} className="w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-blue-400" />
      {loading ? (<div className="absolute right-2 top-2 text-xs opacity-70">Loading…</div>) : null}
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-2xl border border-white/10 bg-neutral-900/95 backdrop-blur p-1 shadow-lg">
          {filtered.map((o, i) => {
            const lab = asLabel(o);
            return (
              <button key={lab + i} onMouseDown={(e) => e.preventDefault()} onClick={() => commit(asValue(o))} className={`w-full text-left px-3 py-2 rounded-xl ${i === active ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                {lab}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}