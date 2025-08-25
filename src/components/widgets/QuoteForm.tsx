export default function QuoteForm(){
  return(
    <div className='surface p-4 space-y-3'>
      <h2 className='section-title'>Build RFP / Quote</h2>
      <div className='grid md:grid-cols-2 gap-2'>
        <input className='border rounded px-2 py-2' placeholder='Origin'/>
        <input className='border rounded px-2 py-2' placeholder='Destination'/>
        <select className='border rounded px-2 py-2'><option>Ocean</option><option>Air</option></select>
        <input className='border rounded px-2 py-2' placeholder='HS (optional)'/>
      </div>
      <div className='flex gap-2'>
        <button className='cta-secondary rounded-xl px-4 py-2'>Export PDF/HTML</button>
        <button className='rounded-xl border px-4 py-2'>Send Quote</button>
      </div>
    </div>
  )
}