// src/components/search/PrimaryShipmentCard.tsx
import React from "react";
import { Copy, ExternalLink, Info, Loader2 } from "lucide-react";

/**
 * This card matches the upgraded branding:
 * - Dark navy base, soft shadows, rounded-2xl corners
 * - Mode badge (✈ / 🚢), crisp typography, subtle borders
 * - Compact on mobile, richer layout on desktop
 */

export type ShipmentRow = {
  id: string;
  mode: "air" | "ocean" | null;
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
  score: number | null; // search rank; can be used for subtle emphasis
};

type Props = {
  row: ShipmentRow;
  loading?: boolean;
  compact?: boolean;
  onAddToCrm?: (row: ShipmentRow) => void;
  onViewContacts?: (row: ShipmentRow) => void;
  onExport?: (row: ShipmentRow) => void;
};

const Stat: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
  if (value === undefined || value === null || value === "" || value === 0) return null;
  return (
    <div className="text-[13px]">
      <span className="text-ink-300">{label}:</span>{" "}
      <span className="text-white">{typeof value === "number" ? value.toLocaleString() : value}</span>
    </div>
  );
};

const Pill: React.FC<{ children: React.ReactNode; tone?: "default" | "accent" }> = ({
  children,
  tone = "default",
}) => (
  <span
    className={[
      "inline-flex items-center px-2 py-0.5 rounded-full text-[12px] border",
      tone === "accent" ? "bg-brand-500/15 text-brand-200 border-brand-500/30" : "bg-white/5 text-ink-200 border-white/10",
    ].join(" ")}
  >
    {children}
  </span>
);

export default function PrimaryShipmentCard({
  row,
  loading,
  compact,
  onAddToCrm,
  onViewContacts,
  onExport,
}: Props) {
  const title = row.unified_company_name || row.vessel_name || row.unified_carrier || "Shipment";
  const lane =
    (row.origin_country || "—") + " → " + (row.destination_city || row.destination_country || "—");
  const badge = row.mode === "air" ? "✈ Air" : row.mode === "ocean" ? "🚢 Ocean" : "—";

  return (
    <article
      data-card
      className={[
        "p-4 rounded-2xl bg-ink-900/60 border border-white/10 shadow-[0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.35)]",
        compact ? "py-3" : "",
      ].join(" ")}
      aria-busy={!!loading}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-ink-300">
            <Pill tone="accent">{badge}</Pill>
            <span>•</span>
            <span>{row.unified_date || "—"}</span>
            {typeof row.score === "number" ? (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Info size={12} className="opacity-70" />
                  score {row.score.toFixed(2)}
                </span>
              </>
            ) : null}
          </div>

          <h3 className="mt-1 text-base md:text-lg font-semibold leading-tight truncate">{title}</h3>
          <div className="text-sm text-ink-300 truncate">{lane}</div>
        </div>

        {/* Right-side quick stats */}
        <div className="text-right text-sm shrink-0">
          {row.value_usd ? <div>${Number(row.value_usd).toLocaleString()}</div> : null}
          {row.gross_weight_kg ? <div>{Number(row.gross_weight_kg).toLocaleString()} kg</div> : null}
          {row.container_count ? <div>{row.container_count} cntrs</div> : null}
        </div>
      </div>

      {/* Meta strip */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {row.hs_code ? (
          <div className="inline-flex items-center gap-1">
            <span className="text-ink-300">HS</span>
            <code className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{row.hs_code}</code>
          </div>
        ) : null}

        {row.bol_number ? (
          <div className="inline-flex items-center gap-1">
            <span className="text-ink-300">B/L</span>
            <code className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{row.bol_number}</code>
            <button
              aria-label="Copy B/L"
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

      {/* Optional description */}
      {row.description ? (
        <p className="mt-2 text-sm text-ink-300 line-clamp-2">{row.description}</p>
      ) : null}

      {/* Footer actions */}
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

      {/* Compact stat row for small cards (optional; shows below buttons on mobile) */}
      <div className="mt-2 grid grid-cols-2 md:hidden gap-x-4 gap-y-1">
        <Stat label="Value" value={row.value_usd ? `$${Number(row.value_usd).toLocaleString()}` : null} />
        <Stat label="Weight" value={row.gross_weight_kg} />
        <Stat label="Containers" value={row.container_count} />
      </div>
    </article>
  );
}
