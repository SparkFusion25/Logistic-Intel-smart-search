import React, { useEffect, useMemo, useState } from 'react';
import AutocompleteInput from '@/components/inputs/AutocompleteInput';
import type { Filters } from '@/types/search';
const field=(s:any)=>typeof s==='string'?s:(s==null?'':String(s));
export default function AdvancedFilters({ value, onChange, onApply, onClear }:{ value?:Filters; onChange?:(next:Filters)=>void; onApply?:()=>void; onClear?:()=>void; }){
  const [local,setLocal]=useState<Filters>({ date_from:value?.date_from??null, date_to:value?.date_to??null, hs_code:value?.hs_code??'', origin_country:value?.origin_country??'', destination_country:value?.destination_country??'', destination_city:value?.destination_city??'', carrier:value?.carrier??'' });
  useEffect(()=>{ setLocal({ date_from:value?.date_from??null, date_to:value?.date_to??null, hs_code:value?.hs_code??'', origin_country:value?.origin_country??'', destination_country:value?.destination_country??'', destination_city:value?.destination_city??'', carrier:value?.carrier??'' }); },[value?.date_from,value?.date_to,value?.hs_code,value?.origin_country,value?.destination_country,value?.destination_city,value?.carrier]);
  const applyDisabled=useMemo(()=>false,[local]);
  const push=(next:Partial<Filters>)=>{ const merged={...local,...next} as Filters; setLocal(merged); onChange?.(merged); };
  const clear=()=>{ const cleared:Filters={date_from:null,date_to:null,hs_code:'',origin_country:'',destination_country:'',destination_city:'',carrier:''}; setLocal(cleared); onChange?.(cleared); onClear?.(); };
  return (<div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div className="flex gap-2">
        <input type="date" value={field(local.date_from)} onChange={(e)=>push({date_from:e.target.value||null})} className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-blue-400" placeholder="From"/>
        <input type="date" value={field(local.date_to)} onChange={(e)=>push({date_to:e.target.value||null})} className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-blue-400" placeholder="To"/>
      </div>
      <input value={field(local.hs_code)} onChange={(e)=>push({hs_code:e.target.value})} className="w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-blue-400" placeholder="HS code" inputMode="numeric"/>
      <AutocompleteInput value={field(local.origin_country)} onChange={(v)=>push({origin_country:v})} options={["United States","China","Mexico","Germany","United Kingdom","India","Vietnam"].map(l=>({label:l}))} placeholder="Origin country"/>
      <AutocompleteInput value={field(local.destination_country)} onChange={(v)=>push({destination_country:v})} options={["United States","China","Mexico","Germany","United Kingdom","India","Vietnam"].map(l=>({label:l}))} placeholder="Destination country"/>
      <AutocompleteInput value={field(local.destination_city)} onChange={(v)=>push({destination_city:v})} options={["Los Angeles","New York","Chicago","Houston","Dallas","Miami"].map(l=>({label:l}))} placeholder="Destination city"/>
      <input value={field(local.carrier)} onChange={(e)=>push({carrier:e.target.value})} className="w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-blue-400" placeholder="Carrier"/>
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button className="px-3 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500" disabled={applyDisabled} onClick={onApply}>Apply filters</button>
      <button className="px-3 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10" onClick={clear}>Clear</button>
      <span className="text-xs opacity-70">Mobile‑ready.</span>
    </div>
  </div>);
}