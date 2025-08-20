import React from 'react';
import type { UnifiedRow } from '@/types/search';
export default function ContactsTable({ rows=[] }:{ rows?: Array<{company_name:string; full_name?:string; title?:string; email?:string; source?:string}> }){
  const cols=[{k:'company_name',l:'Company'},{k:'full_name',l:'Name'},{k:'title',l:'Title'},{k:'email',l:'Email'},{k:'source',l:'Source'}];
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900/80 text-slate-300"><tr>{cols.map(c=><th key={c.k} className="text-left px-3 py-2 font-medium">{c.l}</th>)}</tr></thead>
        <tbody>
          {rows.length===0 && (<tr><td colSpan={cols.length} className="px-3 py-6 text-center text-slate-400">No contacts yet — add from Search.</td></tr>)}
          {rows.map((r,i)=>(<tr key={i} className="odd:bg-slate-900/40 even:bg-slate-900/20">{cols.map(c=>(<td key={c.k} className="px-3 py-2 whitespace-nowrap">{(r as any)[c.k]??''}</td>))}</tr>))}
        </tbody>
      </table>
    </div>
  );
}