import { useState } from 'react';
export default function TariffCalculator(){
  const [hs,setHs]=useState('');
  const [country,setCountry]=useState('United States');
  const [result,setResult]=useState<any>(null);
  const run=async()=>{ const r=await fetch(`/api/widgets/tariff`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hs_code:hs,country})}); setResult(await r.json()); };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input value={hs} onChange={e=>setHs(e.target.value)} placeholder="HS Code" className="rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2"/>
        <input value={country} onChange={e=>setCountry(e.target.value)} placeholder="Country" className="rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2"/>
        <button onClick={run} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500">Calculate</button>
      </div>
      {result && <pre className="text-xs text-slate-300 overflow-auto p-3 bg-slate-900/60 rounded-xl border border-slate-800">{JSON.stringify(result,null,2)}</pre>}
    </div>
  );
}