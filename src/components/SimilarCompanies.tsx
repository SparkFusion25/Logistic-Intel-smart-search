import { useState } from 'react';
import { Link } from 'react-router-dom';
import { watchCompany } from '../lib/watchlist';

type SimilarCompany = {
  company_id: string;    // ensure you're passing this in your list data
  company_name: string;
  score: number;
};

export function SimilarCompanies({ items }: { items: SimilarCompany[] }) {
  const [pending, setPending] = useState<string | null>(null);

  async function onWatch(id: string) {
    try {
      setPending(id);
      await watchCompany(id);
      // simple optimistic toast—swap to your toast lib if you have one
      alert('Added to Watchlist');
    } catch (e: any) {
      alert(`Failed: ${e.message ?? e}`);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="grid gap-3">
      {items.map((c) => (
        <div key={c.company_id} className="flex items-center justify-between rounded-xl border p-3">
          <div className="min-w-0">
            <div className="font-medium truncate">{c.company_name}</div>
            <div className="text-xs opacity-70">Similarity: {Math.round(c.score * 100)}%</div>
          </div>

          <div className="flex gap-2">
            <Link to={`/company/${c.company_id}`} className="text-sm underline">
              Open
            </Link>
            <button
              onClick={() => onWatch(c.company_id)}
              disabled={pending === c.company_id}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white/90 px-2 py-1 text-sm font-medium transition
                         hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-sm active:scale-[0.99] disabled:opacity-50"
              title="Add to Watchlist"
            >
              {pending === c.company_id ? 'Adding…' : 'Watch'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}