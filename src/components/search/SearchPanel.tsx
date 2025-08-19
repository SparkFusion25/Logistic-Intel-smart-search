// src/components/search/SearchPanel.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search as SearchIcon, Filter, X, Loader2, Copy, ExternalLink } from "lucide-react";

type Mode = "all" | "ocean" | "air";

type Row = {
  id: string;
  mode: Mode | null;
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

type Filters = {
  date_from?: string | null;
  date_to?: string | null;
  hs_code?: string | null;
  origin_country?: string | null;
  destination_country?: string | null;
  destination_city?: string | null;
  carrier?: string | null;
};

/** UI bits */
const Chip: React.FC<{
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm border transition ${
      active
        ? "bg-white/10 text-white border-white/20"
        : "bg-white/5 text-ink-300 border-white/10 hover:text-white"
    }`}
  >
    {children}
  </button>
);

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

/** Self‑contained Shipment Card (no external imports needed) */
const ShipmentCard: React.FC<{
  row: Row;
  onAddToCrm?: (row: Row) => void;
  onViewContacts?: (row: Row) => void;
  onExport?: (row: Row) => void;
  compact?: boolean;
  loading?: boolean;
}> = ({ row, onAddToCrm, onViewContacts, onExport, compact, loading }) => {
  const title =
    row.unified_company_name || row.vessel_name || row.unified_carrier || "Shipment";
  const lane =
    (row.origin_country || "—") +
    " → " +
    (row.destination_city || row.destination_country || "—");
  const modeBadge = row.mode ? (row.mode === "air" ? "✈ AIR" : "🚢 OCEAN") : "—";

  return (
    <article data-card className={`p-4 ${compact ? "py-3" : ""}`} aria-busy={!!loading}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs md:text-sm text-ink-300">
            {modeBadge} • {row.unified_date || "—"}
          </div>
          <div className="text-base md:text-lg font-semibold leading-tight">{title}</div>
          <div className="text-sm text-ink-300">{lane}</div>
        </div>

        {/* Right stats */}
        <div className="text-right text-sm">
          {row.value_usd ? <div>${Number(row.value_usd).toLocaleString()}</div> : null}
          {row.gross_weight_kg ? (
            <div>{Number(row.gross_weight_kg).toLocaleString()} kg</div>
          ) : null}
          {row.container_count ? <div>{row.container_count} cntrs</div> : null}
        </div>
      </div>

      {/* Meta */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {row.hs_code ? (
          <div className="inline-flex items-center gap-1">
            <span className="text-ink-300">HS</span>
            <code className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
              {row.hs_code}
            </code>
          </div>
        ) : null}
        {row.bol_number ? (
          <div className="inline-flex items-center gap-1">
            <span className="text-ink-300">B/L</span>
            <code className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
              {row.bol_number}
            </code>
            <button
              aria-label="Copy B/L number"
              onClick={() => navigator.clipboard?.writeText(row.bol_number || "")}
              className="p-1 rounded hover:bg-white/5"
              title="Copy"
            >
              <Copy size={14} />
            </button>
          </div>
        ) : null}
        {row.vessel_name ? (
          <div className="inline-flex items-center gap-1">
            <span className="text-ink-300">Vessel</span>
            <span>{row.vessel_name}</span>
          </div>
        ) : null}
        {row.unified_carrier ? (
          <div className="inline-flex items-center gap-1">
            <span className="text-ink-300">Carrier</span>
            <span>{row.unified_carrier}</span>
          </div>
        ) : null}
      </div>

      {row.description ? (
        <p className="mt-2 text-sm text-ink-300 line-clamp-2">{row.description}</p>
      ) : null}

      {/* CTAs */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => onAddToCrm?.(row)}
          className="px-3 py-2 rounded-xl2 bg-white/5 border border-white/10 hover:bg-white/10"
        >
          {loading ? <Loader2 className="animate-spin inline-block mr-2 h-4 w-4" /> : null}
          Add to CRM
        </button>
        <button
          onClick={() => onViewContacts?.(row)}
          className="px-3 py-2 rounded-xl2 bg-white/5 border border-white/10 hover:bg-white/10"
        >
          View Contacts
        </button>
        <button
          onClick={() => onExport?.(row)}
          className="px-3 py-2 rounded-xl2 bg-white/5 border border-white/10 hover:bg-white/10 inline-flex items-center gap-2"
        >
          Export <ExternalLink size={14} />
        </button>
      </div>
    </article>
  );
};

/** Main Search Panel */
export default function SearchPanel() {
  const [mode, setMode] = useState<Mode>("all");
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [openFilters, setOpenFilters] = useState(false);

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [limit] = useState(25);
  const [offset, setOffset] = useState(0);
  const hasMore = useMemo(
    () => offset + rows.length < total,
    [offset, rows.length, total]
  );
  const abortRef = useRef<AbortController | null>(null);

  const runSearch = useCallback(
    async (reset = true) => {
      setLoading(true);
      setErrorMsg(null);
      if (abortRef.current) abortRef.current.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        // Call your Postgres function: public.search_unified
        const { data, error } = await supabase.rpc(
          "search_unified",
          {
            p_q: q.trim() ? q.trim() : null,
            p_mode: mode,
            p_date_from: filters.date_from ?? null,
            p_date_to: filters.date_to ?? null,
            p_hs_code: filters.hs_code ?? null,
            p_origin_country: filters.origin_country ?? null,
            p_destination_country: filters.destination_country ?? null,
            p_destination_city: filters.destination_city ?? null,
            p_carrier: filters.carrier ?? null,
            p_limit: limit,
            p_offset: reset ? 0 : offset + rows.length,
          },
          { signal: ac.signal as any }
        );

        if (error) throw error;

        const list = (data || []) as Row[];
        const next = reset ? list : [...rows, ...list];
        setRows(next);
        setTotal(
          list.length ? Number(list[0].total_count ?? next.length) : reset ? 0 : total
        );
        if (reset) setOffset(0);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setErrorMsg(e?.message || "Search failed");
        }
      } finally {
        setLoading(false);
      }
    },
    [q, mode, filters, limit, offset, rows, total]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await runSearch(false);
  }, [hasMore, loading, runSearch]);

  const onApplyFilters = useCallback(() => {
    setOpenFilters(false);
    runSearch(true);
  }, [runSearch]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-ink-900/70 backdrop-blur border-b border-white/10">
        <div className="p-3 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-ink-300" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch(true)}
                placeholder="Search companies, HS codes, lanes, B/L, vessels..."
                className="w-full pl-10 pr-10 py-2 rounded-xl2 bg-white/5 text-white placeholder:text-ink-300 outline-none border border-white/10 focus:border-brand-400"
              />
              <button
                className="absolute right-2 top-1.5 px-3 py-1.5 text-sm rounded-xl2 bg-brand-500 hover:bg-brand-400"
                onClick={() => runSearch(true)}
              >
                Search
              </button>
            </div>

            {/* Mobile filters button */}
            <button
              className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded-xl2 border border-white/10 bg-white/5"
              onClick={() => setOpenFilters(true)}
            >
              <Filter size={16} /> Filters
            </button>
          </div>

          {/* Mode chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {(["all", "ocean", "air"] as Mode[]).map((m) => (
              <Chip key={m} active={mode === m} onClick={() => setMode(m)}>
                {m === "all" ? "All" : m === "ocean" ? "Ocean 🚢" : "Air ✈️"}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3">
        {/* Desktop filter rail */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-3" aria-label="Filters">
          <div data-card className="p-4 space-y-3">
            <div className="text-sm font-semibold mb-1">Filters</div>
            <Input
              label="HS Code"
              placeholder="e.g., 8471..."
              value={filters.hs_code ?? ""}
              onChange={(e) => setFilters({ ...filters, hs_code: e.target.value || null })}
            />
            <Input
              label="Origin Country"
              placeholder="e.g., China"
              value={filters.origin_country ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, origin_country: e.target.value || null })
              }
            />
            <Input
              label="Destination Country"
              placeholder="e.g., United States"
              value={filters.destination_country ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, destination_country: e.target.value || null })
              }
            />
            <Input
              label="Destination City"
              placeholder="e.g., Los Angeles"
              value={filters.destination_city ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, destination_city: e.target.value || null })
              }
            />
            <Input
              label="Carrier"
              placeholder="e.g., Maersk / AA"
              value={filters.carrier ?? ""}
              onChange={(e) => setFilters({ ...filters, carrier: e.target.value || null })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="From"
                type="date"
                value={filters.date_from ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, date_from: e.target.value || null })
                }
              />
              <Input
                label="To"
                type="date"
                value={filters.date_to ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, date_to: e.target.value || null })
                }
              />
            </div>
            <button
              className="w-full mt-2 px-3 py-2 rounded-xl2 bg-brand-500 hover:bg-brand-400"
              onClick={onApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Results */}
        <section className="md:col-span-9 lg:col-span-9">
          {errorMsg ? (
            <div data-card className="p-4 border border-danger-500/30 text-danger-500">
              {errorMsg}
            </div>
          ) : null}

          {loading && rows.length === 0 ? (
            <div data-card className="p-6 flex items-center gap-3">
              <Loader2 className="animate-spin" /> Loading…
            </div>
          ) : rows.length === 0 ? (
            <div data-card className="p-6 text-ink-300">
              <div className="font-semibold text-white mb-1">Try a sample search</div>
              <div className="text-sm">
                Examples: <em>“Samsung United States 90d”</em>, <em>“8471 ocean China→US”</em>,{" "}
                <em>“AA air ORD”</em>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((r) => (
                <ShipmentCard
                  key={r.id}
                  row={r}
                  onAddToCrm={(row) => console.log("Add to CRM", row)}
                  onViewContacts={(row) => console.log("View Contacts", row)}
                  onExport={(row) => console.log("Export", row)}
                />
              ))}

              {hasMore && (
                <div className="flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl2 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : null}
                    Load more
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter drawer (self-contained) */}
      {openFilters && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenFilters(false)}
          />
          <div className="absolute inset-x-0 bottom-0 bg-ink-900 rounded-t-2xl ring-1 ring-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Filters</div>
              <button
                className="p-2 rounded-lg hover:bg-white/5"
                onClick={() => setOpenFilters(false)}
              >
                <X />
              </button>
            </div>

            <Input
              label="HS Code"
              placeholder="e.g., 8471"
              value={filters.hs_code ?? ""}
              onChange={(e) => setFilters({ ...filters, hs_code: e.target.value || null })}
            />
            <Input
              label="Origin Country"
              placeholder="e.g., China"
              value={filters.origin_country ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, origin_country: e.target.value || null })
              }
            />
            <Input
              label="Destination Country"
              placeholder="e.g., United States"
              value={filters.destination_country ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, destination_country: e.target.value || null })
              }
            />
            <Input
              label="Destination City"
              placeholder="e.g., Los Angeles"
              value={filters.destination_city ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, destination_city: e.target.value || null })
              }
            />
            <Input
              label="Carrier"
              placeholder="e.g., Maersk / AA"
              value={filters.carrier ?? ""}
              onChange={(e) => setFilters({ ...filters, carrier: e.target.value || null })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="From"
                type="date"
                value={filters.date_from ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, date_from: e.target.value || null })
                }
              />
              <Input
                label="To"
                type="date"
                value={filters.date_to ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, date_to: e.target.value || null })
                }
              />
            </div>

            <button
              className="w-full mt-1 px-3 py-2 rounded-xl2 bg-brand-500 hover:bg-brand-400 inline-flex items-center justify-center gap-2"
              onClick={onApplyFilters}
            >
              <Filter size={16} /> Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
