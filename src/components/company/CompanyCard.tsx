import { Plane, Ship } from 'lucide-react'
export type CompanyCardProps={name:string, location?:string, airPct?:number, oceanPct?:number, shipments12m?:number, lastSeen?:string, onAdd?:()=>void, onOutreach?:()=>void, onQuote?:()=>void}
export default function CompanyCard(p:CompanyCardProps){
  return(
    <div className='surface p-4 md:p-5 flex flex-col gap-3'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <div className='text-lg font-semibold'>{p.name}</div>
          <div className='text-sm text-muted'>{p.location||''}</div>
        </div>
        <div className='flex items-center gap-2'>
          <span className='inline-flex items-center text-sm bg-panel px-2 py-1 rounded-md'><Plane size={14} className='mr-1'/> {p.airPct??0}%</span>
          <span className='inline-flex items-center text-sm bg-panel px-2 py-1 rounded-md'><Ship size={14} className='mr-1'/> {p.oceanPct??0}%</span>
        </div>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        <div className='kpi'><div className='text-xs text-muted'>Shipments (12m)</div><div className='font-bold text-xl'>{p.shipments12m??0}</div></div>
        <div className='kpi'><div className='text-xs text-muted'>Last seen</div><div className='font-bold text-xl'>{p.lastSeen??'—'}</div></div>
      </div>
      <div className='flex gap-2 flex-wrap'>
        <button onClick={p.onAdd} className='rounded-xl border border-divider px-3 py-2'>Add to Company</button>
        <button onClick={p.onOutreach} className='cta-primary rounded-xl px-3 py-2'>Start Outreach</button>
        <button onClick={p.onQuote} className='cta-secondary rounded-xl px-3 py-2'>Quote</button>
      </div>
      <div className='text-xs text-muted border-t border-divider/60 pt-2'>🔒 Contacts hidden on Free. Upgrade to unlock verified emails & LinkedIn.</div>
    </div>
  )
}