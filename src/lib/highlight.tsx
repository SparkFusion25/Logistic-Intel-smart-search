import React from 'react';
import { s, lower } from './strings';
export function Highlight({ text, query }: { text: string | null | undefined; query: string; }) {
  const t = s(text); const q = s(query);
  if (!q) return <>{t}</>;
  const idx = lower(t).indexOf(lower(q));
  if (idx === -1) return <>{t}</>;
  return (<span>{t.slice(0, idx)}<mark className="bg-yellow-200 text-yellow-900 px-0.5 rounded">{t.slice(idx, idx+q.length)}</mark>{t.slice(idx+q.length)}</span>);
}