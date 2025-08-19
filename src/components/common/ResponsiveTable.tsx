import React from 'react';
export default function ResponsiveTable({ columns, rows }: { columns: {key:string;label:string}[], rows: any[] }){
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900/80 text-slate-300">
          <tr>{columns.map(c=> <th key={c.key} className="text-left px-3 py-2 font-medium">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length===0 && (
            <tr><td colSpan={columns.length} className="px-3 py-6 text-center text-slate-400">No data</td></tr>
          )}
          {rows.map((r,i)=> (
            <tr key={i} className="odd:bg-slate-900/40 even:bg-slate-900/20">
              {columns.map(c=> <td key={c.key} className="px-3 py-2 whitespace-nowrap">{String(r[c.key] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}