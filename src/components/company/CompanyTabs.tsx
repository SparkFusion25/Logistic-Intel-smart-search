const tabs=['Shipments','Contacts','Routes','Partners','Quotes & RFPs','Notes & Activity'] as const
export default function CompanyTabs({active,setActive}:{active:string;setActive:(t:string)=>void}){
  return(
    <div className='border-b border-divider/60'>
      <div className='max-w-screen-xl mx-auto px-3 flex gap-2 overflow-x-auto'>
        {tabs.map(t=> (
          <button key={t} onClick={()=>setActive(t)} className={`px-3 py-2 ${active===t?'border-b-2 border-primary text-ink':'text-muted'}`}>{t}</button>
        ))}
      </div>
    </div>
  )
}