// src/components/search/SearchPanel.tsx
import React from 'react';
import { useUnifiedSearch } from '@/hooks/useUnifiedSearch';
import type { Mode, Filters, UnifiedRow } from '@/types/search';
import AdvancedFilters from './AdvancedFilters';
import ConfidenceIndicator from './ConfidenceIndicator';
import { Highlight } from '@/lib/highlight';
import { upper } from '@/lib/strings';
import AIAssistBar from '@/components/search/AIAssistBar';

function ModeToggle({ mode, setMode }:{ mode:Mode; setMode:(m:Mode)=>void }){
  const Btn=(m:Mode,label:string)=>(
    <button
      onClick={()=>setMode(m)}
      className={`px-3 py-1.5 rounded-full border transition-all duration-200 ${
        mode===m
          ?'bg-primary text-primary-foreground border-primary shadow-sm' 
          :'bg-white border-border hover:bg-muted hover:border-border-hover'
      }`}
    >{label}</button>
  );
  return (
    <div className="flex items-center gap-2">
      {Btn('all','All')}
      {Btn('air','Air ✈')}
      {Btn('ocean','Ocean 🚢')}
    </div>
  );
}

function ResultRow({ r, q, onAddToCrm }:{ r:UnifiedRow; q:string; onAddToCrm:(row:UnifiedRow)=>void }){
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 shadow-card hover:shadow-medium transition-all duration-200 hover:scale-[1.01]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full border border-border bg-muted text-muted-foreground font-medium">
            {r.mode?upper(r.mode):'—'}
          </span>
          <div className="font-semibold text-sm md:text-base text-foreground">
            <Highlight text={r.unified_company_name} query={q}/>
          </div>
        </div>
        <ConfidenceIndicator score={r?.score!=null?Number(r.score)*100:null}/>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
        <div><span className="font-medium">HS:</span> {r.hs_code||'—'}</div>
        <div><span className="font-medium">Origin:</span> {r.origin_country||'—'}</div>
        <div><span className="font-medium">Dest:</span> {r.destination_city||r.destination_country||'—'}</div>
        <div><span className="font-medium">Date:</span> {r.unified_date||'—'}</div>
      </div>
      <div className="text-xs line-clamp-2 text-muted-foreground">{r.description||'No description'}</div>
      <div className="flex items-center gap-2 pt-1">
        <button 
          className="rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity shadow-sm" 
          onClick={()=>onAddToCrm(r)}
        >
          Add to CRM
        </button>
        <button className="rounded-lg bg-muted border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors">
          Export
        </button>
      </div>
    </div>
  );
}

export default function SearchPanel(){
  const { q,setQ,mode,setMode,filters,setFilters,items,total,loading,error,hasMore,run,loadMore }=useUnifiedSearch({ initialMode:'all', initialLimit:25 });

  // Add-to-CRM
  const onAddToCrm=async(row:UnifiedRow)=>{
    try{
      await fetch('/api/crm/contacts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        company_name:row.unified_company_name,
        mode:row.mode,
        hs_code:row.hs_code,
        origin_country:row.origin_country,
        destination_country:row.destination_country,
        destination_city:row.destination_city,
        carrier:row.unified_carrier,
        bol_number:row.bol_number,
        vessel_name:row.vessel_name,
        last_seen:row.unified_date,
        source:'search_unified'
      })});
    }catch{}
  };

  const onApplyFilters = () => run();
  const onClearFilters = () => run();

  return (
    <div className="flex flex-col gap-6">
      {/* Top controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-card">
        <ModeToggle mode={mode} setMode={setMode}/>
        <div className="flex-1"/>
        <div className="w-full md:w-96">
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            onKeyDown={(e)=>{if(e.key==='Enter') run();}}
            placeholder="Search companies, HS codes, carriers…"
            className="w-full rounded-lg bg-background border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <button 
          onClick={()=>run()} 
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 font-medium shadow-sm transition-opacity" 
          disabled={loading}
        >
          Search
        </button>
      </div>

      {/* AI Assist */}
      <AIAssistBar
        q={q}
        filters={filters}
        lastResults={items}
        onPickSuggestion={(s)=>{ setQ(s); run(); }}
        onApplyStructured={(f)=>{ setFilters((x)=>({ ...(x as Filters), ...(f||{}) })); run(); }}
      />

      {/* Filters */}
      <AdvancedFilters value={filters as Filters} onChange={setFilters as any} onApply={onApplyFilters} onClear={onClearFilters}/>

      {/* Summary / load more */}
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
        <div className="text-sm text-muted-foreground font-medium">
          {loading?'Loading…':(error?`Error: ${error}`:`${total} results found`)}
        </div>
        {hasMore&&(
          <button 
            onClick={loadMore} 
            disabled={loading} 
            className="px-3 py-1.5 rounded-lg bg-muted border border-border hover:bg-accent text-sm font-medium transition-colors"
          >
            Load more
          </button>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((r)=>(<ResultRow key={r.id} r={r} q={q} onAddToCrm={onAddToCrm}/>))}
      </div>
    </div>
  );
}