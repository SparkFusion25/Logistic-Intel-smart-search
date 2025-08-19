// src/lib/highlight.tsx
import React from 'react';
import { lower, s } from './strings';
export function Highlight({ text, query }: { text?: string | null; query?: string | null }) {
  const t = s(text);
  const q = s(query);
  if (!q) return <>{t}</>;
  const idx = lower(t).indexOf(lower(q));
  if (idx === -1) return <>{t}</>;
  const before = t.slice(0, idx);
  const match = t.slice(idx, idx + q.length);
  const after = t.slice(idx + q.length);
  return (
    <>
      {before}
      <mark className="rounded px-0.5 bg-yellow-200/60 dark:bg-yellow-400/20">{match}</mark>
      {after}
    </>
  );
}
export default Highlight;