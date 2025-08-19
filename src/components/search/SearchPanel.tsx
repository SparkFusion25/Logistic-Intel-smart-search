// src/components/search/SearchPanel.tsx
import React from 'react';
import { useUnifiedSearch } from '@/hooks/useUnifiedSearch';
import type { Mode, Filters, UnifiedRow } from '@/types/search';
import AdvancedFilters from './AdvancedFilters';
import ConfidenceIndicator from './ConfidenceIndicator';
import { Highlight } from '@/lib/highlight';
import { upper } from '@/lib/strings';

function ModeToggle({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const btn = (m: Mode, label: string) => (
    <button onClick={() => setMode(m)} className={`px-3 py-1.5 rounded-full border ${mode === m ? 'bg-blue-500 border-blue-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{label}</button>
  );
  return (
    <div className="flex items-center gap-2">
      {btn('all','All')}{btn('air','Air ✈')}{btn('ocean','Ocean 🚢')}
    </div>
  );
}

function ResultRow({ r, q }: { r: UnifiedRow; q: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 bg-white/5">{r.mode ? upper(r.mode) : '—'}</span>
          <div className="font-semibold text-sm md:text-base"><Highlight text={r.unified_company_name} query={q} /></div>
        </div>
        <ConfidenceIndicator score={r?.score != null ? Number(r.score) * 100 : null} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs opacity-85">
        <div><span className="opacity-60">HS:</span> {r.hs_code || '—'}</div>
        <div><span className="opacity-60">Origin:</span> {r.origin_country || '—'}</div>
        <div><span className="opacity-60">Dest:</span> {r.destination_city || r.destination_country || '—'}</div>
        <div><span className="opacity-60">Date:</span> {r.unified_date || '—'}</div>
      </div>
      <div className="text-xs line-clamp-2 opacity-80">{r.description || 'No description'}</div>
      <div className="flex items-center gap-2 pt-1">
        <button className="rounded-xl bg-white/5 border border-white/10 px-2 py-1 text-xs hover:bg-white/10">Add to CRM</button>
        <button className="rounded-xl bg-white/5 border border-white/10 px-2 py-1 text-xs hover:bg-white/10">Export</button>
      </div>
    </div>
  );
}

export default function SearchPanel() {
  const { q, setQ, mode, setMode, filters, setFilters, items, total, loading, error, hasMore, run, loadMore } = useUnifiedSearch({ initialMode: 'all', initialLimit: 25 });

  const onApplyFilters = () => run(true);
  const onClearFilters = () => run(true);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <ModeToggle mode={mode} setMode={setMode} />
        <div className="flex-1" />
        <div className="w-full md:w-96">
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') run(true); }} placeholder="Search companies, HS codes, carriers…" className="w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-blue-400" />
        </div>
        <button onClick={() => run(true)} className="px-3 py-2 rounded-2xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60" disabled={loading}>Search</button>
      </div>

      <AdvancedFilters value={filters as Filters} onChange={setFilters as any} onApply={onApplyFilters} onClear={onClearFilters} />

      <div className="flex items-center justify-between">
        <div className="text-sm opacity-75">{loading ? 'Loading…' : error ? `Error: ${error}` : `${total} results`}</div>
        {hasMore && (
          <button onClick={loadMore} disabled={loading} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm">Load more</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {items.map((r) => <ResultRow key={r.id} r={r} q={q} />)}
      </div>
    </div>
  );
}