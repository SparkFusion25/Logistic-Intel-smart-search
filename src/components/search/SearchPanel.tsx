// src/components/search/SearchPanel.tsx
import React from 'react';
import { supabase } from "@/integrations/supabase/client";
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
      className={`pill-glossy font-medium text-sm ${
        mode===m ? 'active' : ''
      }`}
    >{label}</button>
  );
  return (
    <div className="flex items-center gap-3 p-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/30">
      {Btn('all','All')}
      {Btn('air','Air ✈')}
      {Btn('ocean','Ocean 🚢')}
    </div>
  );
}

function ResultRow({ r, q, onAddToCrm }:{ r:UnifiedRow; q:string; onAddToCrm:(row:UnifiedRow)=>void }){
  const companyInitial = r.unified_company_name?.charAt(0).toUpperCase() || '?';
  
  return (
    <div className="card-glass p-6 flex flex-col gap-4 hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-glow">
            {companyInitial}
          </div>
          <div className="pill-glossy text-xs font-medium px-3 py-1">
            {r.mode?upper(r.mode):'—'}
          </div>
          <div className="font-bold text-base text-foreground">
            <Highlight text={r.unified_company_name} query={q}/>
          </div>
        </div>
        <ConfidenceIndicator score={r?.score!=null?Number(r.score)*100:null}/>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HS Code</span>
          <span className="font-semibold">{r.hs_code||'—'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Origin</span>
          <span className="font-semibold">{r.origin_country||'—'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Destination</span>
          <span className="font-semibold">{r.destination_city||r.destination_country||'—'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</span>
          <span className="font-semibold">{r.unified_date||'—'}</span>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground line-clamp-2 bg-muted/50 p-3 rounded-lg">
        {r.description||'No description available'}
      </div>
      
      <div className="flex items-center gap-3 pt-2">
        <button 
          className="btn-gradient px-4 py-2 text-sm font-medium rounded-lg group-hover:scale-105 transition-transform" 
          onClick={()=>onAddToCrm(r)}
        >
          + Add to CRM
        </button>
        <button className="pill-glossy px-4 py-2 text-sm font-medium hover:scale-105 transition-transform">
          View Trade
        </button>
        <button className="pill-glossy px-4 py-2 text-sm font-medium hover:scale-105 transition-transform">
          Quote
        </button>
      </div>
    </div>
  );
}

export default function SearchPanel(){
  const { q,setQ,mode,setMode,filters,setFilters,items,total,loading,error,hasMore,run,loadMore }=useUnifiedSearch({ initialMode:'all', initialLimit:25 });

  // Add-to-CRM using Supabase
  const onAddToCrm=async(row:UnifiedRow)=>{
    try{
      const { error } = await supabase.from('crm_contacts').insert({
        org_id: (await supabase.auth.getUser()).data.user?.id,
        company_name: row.unified_company_name || 'Unknown Company',
        source: 'search_unified',
        notes: `Added from search - ${row.mode?.toUpperCase()} shipment`,
        tags: [row.mode || 'unknown', 'prospect'].filter(Boolean)
      });
      if (error) throw error;
    }catch(e){
      console.error('Failed to add to CRM:', e);
    }
  };

  const onApplyFilters = () => run();
  const onClearFilters = () => run();

  return (
    <div className="flex flex-col gap-6">
      {/* Premium Search Header */}
      <div className="glass p-6 flex flex-col md:flex-row md:items-center gap-6">
        <ModeToggle mode={mode} setMode={setMode}/>
        <div className="flex-1"/>
        <div className="relative w-full md:w-96">
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            onKeyDown={(e)=>{if(e.key==='Enter') run();}}
            placeholder="Search companies, HS codes, carriers…"
            className="w-full h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white/30 px-6 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-glow transition-all duration-300 shadow-premium"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            🔍
          </div>
        </div>
        <button 
          onClick={()=>run()} 
          className="btn-primary px-6 py-3 h-12 disabled:opacity-60" 
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
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

      {/* Premium Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((r)=>(<ResultRow key={r.id} r={r} q={q} onAddToCrm={onAddToCrm}/>))}
      </div>
    </div>
  );
}