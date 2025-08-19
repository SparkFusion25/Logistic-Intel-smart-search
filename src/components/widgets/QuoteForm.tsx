import { useState } from 'react';
export default function QuoteForm(){
  const [form,setForm]=useState({company_name:'',origin:'',destination:'',mode:'ocean',hs_code:'',commodity:''});
  const [resp,setResp]=useState<any>(null);
  const submit=async()=>{ const r=await fetch('/api/widgets/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setResp(await r.json()); };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['company_name','origin','destination','hs_code','commodity'].map(k=> (
          <input key={k} placeholder={k.replace('_',' ')} value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2"/>
        ))}
        <select value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})} className="rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2">
          <option value="ocean">Ocean</option>
          <option value="air">Air</option>
        </select>
      </div>
      <button onClick={submit} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500">Generate Quote</button>
      {resp && <pre className="text-xs text-slate-300 overflow-auto p-3 bg-slate-900/60 rounded-xl border border-slate-800">{JSON.stringify(resp,null,2)}</pre>}
    </div>
  );
}