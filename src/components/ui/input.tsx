// src/components/inputs/AutocompleteInput.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (next: string) => void;
  onSelect?: (selected: string) => void;
  fetchOptions: (term: string) => Promise<string[]>; // e.g., useLocationAutocomplete().searchCities(...)
  minChars?: number; // default 1
  debounceMs?: number; // default 200
  className?: string;
  disabled?: boolean;
};

const cn = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(" ");

export default function AutocompleteInput({
  label,
  placeholder,
  value,
  onChange,
  onSelect,
  fetchOptions,
  minChars = 1,
  debounceMs = 200,
  className,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number>(-1);
  const [error, setError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Simple debounce on value changes
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (!value || value.trim().length < minChars) {
      setItems([]);
      setOpen(false);
      return;
    }
    timerRef.current = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchOptions(value.trim());
        setItems(res || []);
        setOpen(true);
        setHoverIdx(-1);
      } catch (e: any) {
        setError(e?.message || "Failed to load");
        setItems([]);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, debounceMs) as unknown as number;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [value, minChars, debounceMs, fetchOptions]);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    const max = items.length - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHoverIdx((i) => (i < max ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHoverIdx((i) => (i > 0 ? i - 1 : max));
    } else if (e.key === "Enter") {
      if (hoverIdx >= 0 && hoverIdx <= max) {
        e.preventDefault();
        const chosen = items[hoverIdx];
        onChange(chosen);
        onSelect?.(chosen);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showFooter = useMemo(() => loading || error, [loading, error]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      {label ? <div className="text-xs text-ink-300 mb-1">{label}</div> : null}

      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value && value.length >= minChars && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full px-3 py-2 rounded-xl2 bg-white/5 text-white placeholder:text-ink-300 outline-none border border-white/10 focus:border-brand-400",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        />
        {value ? (
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-white/5 border border-white/10"
            onClick={() => {
              onChange("");
              setItems([]);
              setOpen(false);
              setHoverIdx(-1);
              inputRef.current?.focus();
            }}
            aria-label="Clear"
            title="Clear"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-xl2 border border-white/10 bg-ink-900 shadow-xl overflow-hidden">
          {items.length === 0 && !showFooter ? (
            <div className="px-3 py-2 text-sm text-ink-300">No matches</div>
          ) : (
            <ul className="max-h-64 overflow-auto">
              {items.map((opt, idx) => (
                <li key={`${opt}-${idx}`}>
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-white/5",
                      idx === hoverIdx && "bg-white/10"
                    )}
                    onMouseEnter={() => setHoverIdx(idx)}
                    onMouseLeave={() => setHoverIdx(-1)}
                    onClick={() => {
                      onChange(opt);
                      onSelect?.(opt);
                      setOpen(false);
                    }}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {showFooter ? (
            <div className="px-3 py-2 border-t border-white/10 text-xs text-ink-300">
              {loading ? "Loading…" : error}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
