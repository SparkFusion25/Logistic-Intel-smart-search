import { useCallback, useMemo, useRef, useState } from 'react';
import type { Filters, Mode, UnifiedRow } from '@/types/search';
export type UseUnifiedSearchOptions={ initialMode?:Mode; initialLimit?:number };
export function useUnifiedSearch(opts:UseUnifiedSearchOptions={}){
  const initialMode=opts.initialMode??'all'; const limit=opts.initialLimit??25;
  const [mode,setMode]=useState<Mode>(initialMode); const [q,setQ]=useState('');
  const [filters,setFilters]=useState<Filters>({}); const [items,setItems]=useState<UnifiedRow[]>([]);
  const [total,setTotal]=useState(0); const [loading,setLoading]=useState(false); const [error,setError]=useState<string|null>(null);
  const [offset,setOffset]=useState(0); const abortRef=useRef<AbortController|null>(null);
  const hasMore=useMemo(()=>offset+items.length<total,[offset,items,total]);
  const run=useCallback(async(reset:boolean=true)=>{ setLoading(true); setError(null);
    if(abortRef.current) abortRef.current.abort(); const ac=new AbortController(); abortRef.current=ac;
    const nextOffset=reset?0:offset+items.length; try{
      const params=new URLSearchParams(); if(q.trim()) params.set('q',q.trim()); params.set('mode',mode);
      const f=filters; if(f.date_from) params.set('date_from',f.date_from); if(f.date_to) params.set('date_to',f.date_to); if(f.hs_code) params.set('hs_code',f.hs_code);
      if(f.origin_country) params.set('origin_country',f.origin_country); if(f.destination_country) params.set('destination_country',f.destination_country);
      if(f.destination_city) params.set('destination_city',f.destination_city); if(f.carrier) params.set('carrier',f.carrier);
      params.set('limit',String(limit)); params.set('offset',String(nextOffset));
      const r=await fetch(`/api/search/unified?${params.toString()}`,{signal:ac.signal}); if(!r.ok) throw new Error(`HTTP ${r.status}`);
      const j=await r.json(); const list=(j?.data||[]) as UnifiedRow[]; const merged=reset?list:[...items,...list];
      setItems(merged); setTotal(Number(j?.total ?? (merged[0]?.total_count ?? merged.length))); if(reset) setOffset(0);
    }catch(e:any){ if(e?.name!=='AbortError') setError(e?.message||'Search failed'); } finally{ setLoading(false); }
  },[q,mode,filters,limit,offset,items]);
  const loadMore=useCallback(async()=>{ if(!hasMore||loading) return; await run(false); },[hasMore,loading,run]);
  const resetAndRun=useCallback(()=>run(true),[run]);
  return { q,setQ,mode,setMode,filters,setFilters,items,total,loading,error,hasMore,run:resetAndRun,loadMore } as const;
}
export default useUnifiedSearch;