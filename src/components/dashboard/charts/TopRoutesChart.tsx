import * as React from 'react';

// Lightweight placeholder chart (keeps build green).
// Replace with real chart lib later (Recharts, Chart.js, or Visx)
const TopRoutesChart: React.FC<{ items?: { route: string; count: number }[] }> = ({ items = [] }) => {
  const max = Math.max(1, ...items.map(i => i.count));
  return (
    <div className="li-card p-4">
      <div className="mb-3 text-sm text-slate-300">Top Routes</div>
      <div className="space-y-2">
        {items.length === 0 && <div className="text-slate-500 text-sm">No data</div>}
        {items.map(({ route, count }) => (
          <div key={route} className="flex items-center gap-3">
            <div className="w-28 text-xs text-slate-400 truncate">{route}</div>
            <div className="flex-1 h-2 rounded bg-white/10">
              <div className="h-2 rounded bg-blue-600" style={{ width: `${(count / max) * 100}%` }} />
            </div>
            <div className="w-10 text-right text-xs text-slate-300">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TopRoutesChart;