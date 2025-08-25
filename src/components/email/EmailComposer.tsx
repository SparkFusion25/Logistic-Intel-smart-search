export default function EmailComposer(){
  return(
    <div className='surface p-4 space-y-3'>
      <div className='flex gap-2'>
        <select className='border rounded px-2 py-2'><option>Gmail</option><option>Outlook</option></select>
        <input className='border rounded px-2 py-2 flex-1' placeholder='Subject'/>
      </div>
      <textarea className='border rounded w-full h-60 p-3' placeholder='Body (use {{first_name}} and {{company}})'></textarea>
      <div className='flex gap-2'>
        <button className='cta-primary rounded-xl px-4 py-2'>Send Test</button>
        <button className='rounded-xl border px-4 py-2'>Attach Quote</button>
        <button className='rounded-xl border px-4 py-2'>Insert Tariff</button>
      </div>
    </div>
  )
}