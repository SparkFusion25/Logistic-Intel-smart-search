import * as React from 'react';
import useCrmAI from '@/hooks/useCrmAI';
export default function SmartEnrichmentPanel({ company, shipments }:{ company:string; shipments:any[] }){
  const { bullets, tags, risk, enrich, loading, summarize, plan } = useCrmAI();
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="flex items-center justify-between"><div className="text-sm text-slate-300">AI Company Intel</div><div className="flex gap-2"><button onClick={()=>summarize(company,shipments)} className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs hover:bg-white/10">{loading?'Summarizing…':'Summarize'}</button><button onClick={()=>plan(company,'logistics/procurement',{region:'US'})} className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs hover:bg-white/10">{loading?'Planning…':'Enrichment Plan'}</button></div></div>
      {(bullets||[]).length>0 && (<ul className="list-disc pl-5 text-sm text-slate-200 space-y-1">{bullets.map((b,i)=>(<li key={i}>{b}</li>))}</ul>)}
      {(tags||[]).length>0 && (<div className="flex flex-wrap gap-2">{tags.map((t:string,i:number)=>(<span key={i} className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-slate-200">{t}</span>))}</div>)}
      {(risk||[]).length>0 && (<div className="text-xs text-amber-300/90"><div className="mb-1 font-medium">Risks</div><ul className="list-disc pl-5 space-y-0.5">{risk.map((r:string,i:number)=>(<li key={i}>{r}</li>))}</ul></div>)}
      {enrich && (<div className="text-xs text-slate-300 space-y-1"><div className="font-medium">Search terms</div><div className="flex flex-wrap gap-2">{(enrich.search_terms||[]).map((t:string,i:number)=>(<span key={i} className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-slate-200">{t}</span>))}</div><div className="font-medium pt-2">Title patterns</div><div className="flex flex-wrap gap-2">{(enrich.linkedin_title_patterns||[]).map((t:string,i:number)=>(<span key={i} className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-slate-200">{t}</span>))}</div><div className="font-medium pt-2">Email guess</div><div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-slate-200">{enrich.email_guess_pattern}</div>{enrich.opener&&(<div className="pt-2 text-slate-200">Suggested opener: "{enrich.opener}"</div>)}</div>)}
    </div>
  );
}