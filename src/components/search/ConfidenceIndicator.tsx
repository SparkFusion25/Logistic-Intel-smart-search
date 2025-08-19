// src/components/search/ConfidenceIndicator.tsx
import React from 'react';
import { clamp, cn } from '@/lib/utils';
export default function ConfidenceIndicator({ score }: { score?: number | null }) {
  const pct = clamp(Number(score ?? 0), 0, 100);
  const band = pct >= 80 ? 'high' : pct >= 50 ? 'med' : 'low';
  const label = band === 'high' ? 'High' : band === 'med' ? 'Medium' : 'Low';
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className={cn('h-full', band === 'high' ? 'bg-emerald-400' : band === 'med' ? 'bg-amber-400' : 'bg-rose-400')} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs opacity-80">{label} · {pct}%</span>
    </div>
  );
}