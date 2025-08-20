import * as React from 'react';
import useSearchAI from '@/hooks/useSearchAI';
export default function AIAssistBar({ q, filters, lastResults, onPickSuggestion, onApplyStructured }:{ q:string; filters:any; lastResults:any[]; onPickSuggestion:(s:string)=>void; onApplyStructured:(f:any)=>void; }){
  const { suggestions, structured, summary, loading, assist } = useSearchAI();
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-300">Smart AI Assist</div>
        <button onClick={()=>assist(q,filters,lastResults)} className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs hover:bg-white/10">{loading?'Thinking…':'Suggest'}</button>
      </div>
      {summary && <div className="text-xs text-slate-300 mb-2">{summary}</div>}
      <div className="flex flex-wrap gap-2">
        {(suggestions||[]).map((s,i)=>(<button key={i} onClick={()=>onPickSuggestion(s)} className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-slate-200 hover:bg-white/10">{s}</button>))}
        {structured && Object.keys(structured).length>0 && (
          <button onClick={()=>onApplyStructured(structured)} className="inline-flex items-center gap-1 rounded-full border border-blue-400/40 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-200">Apply filters</button>
        )}
      </div>
    </div>
  );
}