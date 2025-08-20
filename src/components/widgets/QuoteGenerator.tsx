import * as React from 'react';
import { usd } from '@/lib/format';

type QuoteForm={ company:string; contact?:string; email?:string; origin:string; destination:string; mode:'air'|'ocean'; incoterm:'EXW'|'FOB'|'CIF'|'DAP'|'DDP'; commodity?:string; weight_kg?:number; volume_cbm?:number; containers?:number; price_usd:number; surcharges_usd:number; validity_days:number };

export default function QuoteGenerator(){
  const [f,setF]=React.useState<QuoteForm>({ company:'', origin:'Shanghai, CN', destination:'Los Angeles, US', mode:'ocean', incoterm:'FOB', price_usd:1200, surcharges_usd:150, validity_days:14 });
  const [total,setTotal]=React.useState(0);
  const [loading,setLoading]=React.useState(false);

  React.useEffect(()=>{ setTotal(Number(f.price_usd||0)+Number(f.surcharges_usd||0)); },[f.price_usd,f.surcharges_usd]);
  const on=(k:keyof QuoteForm, v:any)=> setF(s=>({...s,[k]:v}))

  const preview = async()=>{
    setLoading(true);
    try{
      const r=await fetch('/api/widgets/quote/preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)});
      const j=await r.json();
      const html=j?.html||'<p>Preview error</p>';
      const w=window.open('about:blank','_blank'); if(!w) return;
      w.document.open(); w.document.write(html); w.document.close();
    } finally{ setLoading(false); }
  }

  return (
    <div className='rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4'>
      <div className='flex items-center justify-between'><div className='text-sm text-slate-300'>Quote Generator</div><button onClick={preview} className='px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm' disabled={loading}>{loading?'Building…':'Preview / Export'}</button></div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
        <input placeholder='Company' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.company} onChange={e=>on('company',e.target.value)}/>
        <input placeholder='Contact (optional)' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.contact||''} onChange={e=>on('contact',e.target.value)}/>
        <input placeholder='Email (optional)' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.email||''} onChange={e=>on('email',e.target.value)}/>
        <input placeholder='Origin' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.origin} onChange={e=>on('origin',e.target.value)}/>
        <input placeholder='Destination' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.destination} onChange={e=>on('destination',e.target.value)}/>
        <select className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.mode} onChange={e=>on('mode',e.target.value as any)}>
          <option value='ocean'>Ocean</option>
          <option value='air'>Air</option>
        </select>
        <select className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.incoterm} onChange={e=>on('incoterm',e.target.value as any)}>
          {['EXW','FOB','CIF','DAP','DDP'].map(i=>(<option key={i} value={i as any}>{i}</option>))}
        </select>
        <input placeholder='Commodity (optional)' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.commodity||''} onChange={e=>on('commodity',e.target.value)}/>
        <input type='number' placeholder='Weight (kg)' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.weight_kg||0} onChange={e=>on('weight_kg',Number(e.target.value))}/>
        <input type='number' placeholder='Volume (cbm)' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.volume_cbm||0} onChange={e=>on('volume_cbm',Number(e.target.value))}/>
        <input type='number' placeholder='Containers (if any)' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.containers||0} onChange={e=>on('containers',Number(e.target.value))}/>
        <input type='number' placeholder='Base Price (USD)' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.price_usd} onChange={e=>on('price_usd',Number(e.target.value))}/>
        <input type='number' placeholder='Surcharges (USD)' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.surcharges_usd} onChange={e=>on('surcharges_usd',Number(e.target.value))}/>
        <input type='number' placeholder='Validity (days)' className='rounded-2xl bg-white/5 border border-white/10 px-3 py-2' value={f.validity_days} onChange={e=>on('validity_days',Number(e.target.value))}/>
      </div>
      <div className='rounded-xl border border-white/10 bg-white/5 p-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm'>
        <div className='rounded-lg bg-white/5 border border-white/10 p-3'><div className='text-xs opacity-70'>Base</div><div className='font-semibold'>{usd(Number(f.price_usd||0))}</div></div>
        <div className='rounded-lg bg-white/5 border border-white/10 p-3'><div className='text-xs opacity-70'>Surcharges</div><div className='font-semibold'>{usd(Number(f.surcharges_usd||0))}</div></div>
        <div className='rounded-lg bg-white/5 border border-white/10 p-3'><div className='text-xs opacity-70'>Total</div><div className='font-semibold'>{usd(total)}</div></div>
        <div className='rounded-lg bg-white/5 border border-white/10 p-3'><div className='text-xs opacity-70'>Incoterm</div><div className='font-semibold'>{f.incoterm}</div></div>
      </div>
    </div>
  );
}