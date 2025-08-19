// src/components/search/SearchResults.tsx
import React from "react";
import PrimaryShipmentCard, { type ShipmentRow } from "@/components/search/PrimaryShipmentCard";
import { Loader2 } from "lucide-react";

export type SearchResultsProps = {
  items: ShipmentRow[];
  loading?: boolean;
  error?: string | null;
  total?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onAddToCrm?: (row: ShipmentRow) => void;
  onViewContacts?: (row: ShipmentRow) => void;
  onExport?: (row: ShipmentRow) => void;
};

const SkeletonCard: React.FC = () => (
  <div
    data-card
    className="p-4 rounded-2xl bg-ink-900/60 border border-white/10 animate-pulse space-y-3"
    aria-busy="true"
  >
    <div className="h-3 w-24 bg-white/10 rounded" />
    <div className="h-5 w-1/2 bg-white/10 rounded" />
    <div className="h-3 w-1/3 bg-white/10 rounded" />
    <div className="h-3 w-1/4 bg-white/10 rounded" />
  </div>
);

export default function SearchResults({
  items,
  loading = false,
  error = null,
  total = 0,
  hasMore = false,
  onLoadMore,
  onAddToCrm,
  onViewContacts,
  onExport,
}: SearchResultsProps) {
  if (error) {
    return (
      <div data-card className="p-4 border border-danger-500/30 text-danger-500">
        {error}
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div data-card className="p-6 text-ink-300">
        <div className="font-semibold text-white mb-1">Try a sample search</div>
        <div className="text-sm">
          Examples: <em>“Samsung United States 90d”</em>, <em>“8471 ocean China→US”</em>,{" "}
          <em>“AA air ORD”</em>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Optional header with count */}
      <div className="text-sm text-ink-300">
        Showing <span className="text-white">{items.length.toLocaleString()}</span>
        {total ? (
          <>
            {" "}
            of <span className="text-white">{Number(total).toLocaleString()}</span>
          </>
        ) : null}
      </div>

      {/* Cards */}
      {items.map((r) => (
        <PrimaryShipmentCard
          key={r.id}
          row={r}
          onAddToCrm={onAddToCrm}
          onViewContacts={onViewContacts}
          onExport={onExport}
        />
      ))}

      {/* Load more */}
      {hasMore ? (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-4 py-2 rounded-xl2 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 inline-flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : null}
            Load more
          </button>
        </div>
      ) : null}
    </div>
  );
}
