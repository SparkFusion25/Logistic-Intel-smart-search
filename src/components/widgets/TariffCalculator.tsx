import * as React from 'react';
import { usd } from '@/lib/format';

type CalcInput = { hs_code:string; origin_country:string; destination_country:string; mode:'air'|'ocean'; incoterm:'EXW'|'FOB'|'CIF'|'DAP'|'DDP'; customs_value:number };

type CalcResult = { duty_rate:number; est_duty:number; est_tax:number; est_total:number; notes:string[] };

const COUNTRIES=['United States','China','Mexico','Germany','United Kingdom','India','Vietnam','Canada','Brazil','France','Italy','Spain','Japan','Korea'];

export default function TariffCalculator(){
  const [form,setForm]=React.useState<CalcInput>({ hs_code:'', origin_country:'China', destination_country:'United States', mode:'ocean', incoterm:'FOB', customs_value:10000 });
  const [res,setRes]=React.useState<CalcResult|null>(null);
  const [loading,setLoading]=React.useState(false);
  const [error,setError]=React.useState<string|null>(null);

  const onChange = (k:keyof CalcInput, v:any)=> setForm(f=>({...f,[k]:v}))

  const estimate = async()=>{
    setLoading(true); setError(null);
    try{
      const r = await fetch('/api/widgets/tariff/calc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setRes(j);
    }catch(e:any){ setError(e?.message||'Failed to estimate'); }
    finally{ setLoading(false); }
  }

  return (
    <div className='rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4'>
      <div className='flex items-center justify-between'><div className='text-sm text-slate-300'>Tariff Calculator</div><button onClick={estimate} className='px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm' disabled={loading}>{loading?'Estimating…':'Estimate'}</button></div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
        <input className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2 outline-none' placeholder='HS Code (e.g. 850440)' value={form.hs_code} onChange={e=>onChange('hs_code',e.target.value)}/>
        <select className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={form.mode} onChange={e=>onChange('mode',e.target.value as any)}>
          <option value='ocean'>Ocean</option>
          <option value='air'>Air</option>
        </select>
        <select className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={form.incoterm} onChange={e=>onChange('incoterm',e.target.value as any)}>
          {['EXW','FOB','CIF','DAP','DDP'].map(i=>(<option key={i} value={i as any}>{i}</option>))}
        </select>
        <select className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={form.origin_country} onChange={e=>onChange('origin_country',e.target.value)}>
          {COUNTRIES.map(c=>(<option key={c} value={c}>{c}</option>))}
        </select>
        <select className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={form.destination_country} onChange={e=>onChange('destination_country',e.target.value)}>
          {COUNTRIES.map(c=>(<option key={c} value={c}>{c}</option>))}
        </select>
        <input type='number' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2 outline-none' placeholder='Customs Value (USD)' value={form.customs_value} onChange={e=>onChange('customs_value',Number(e.target.value))}/>
      </div>
      {error && <div className='text-sm text-rose-300'>{error}</div>}
      {res && (
        <div className='rounded-xl border border-white/10 bg-white/5 p-3 space-y-2'>
          <div className='text-sm'>Estimated duty rate: <span className='font-semibold'>{(res.duty_rate*100).toFixed(2)}%</span></div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm'>
            <div className='rounded-lg bg-white/5 border border-white/10 p-3'><div className='text-xs opacity-70'>Duty</div><div className='font-semibold'>{usd(res.est_duty)}</div></div>
            <div className='rounded-lg bg-white/5 border border-white/10 p-3'><div className='text-xs opacity-70'>Taxes (est)</div><div className='font-semibold'>{usd(res.est_tax)}</div></div>
            <div className='rounded-lg bg-white/5 border border-white/10 p-3'><div className='text-xs opacity-70'>Total</div><div className='font-semibold'>{usd(res.est_total)}</div></div>
            <div className='rounded-lg bg-white/5 border border-white/10 p-3'><div className='text-xs opacity-70'>Incoterm</div><div className='font-semibold'>{form.incoterm}</div></div>
          </div>
          {res.notes?.length>0 && (
            <ul className='list-disc pl-5 text-xs text-slate-300'>
              {res.notes.map((n,i)=>(<li key={i}>{n}</li>))}
            </ul>
          )}
        </div>
      )}
      <div className='text-[11px] text-slate-400'>Informational estimate only. For binding classification/duty, consult a licensed customs broker.</div>
    </div>
  );
}