export default function TariffCalculator(){
  return(
    <div className='surface p-4 space-y-3'>
      <h2 className='section-title'>Tariff Calculator</h2>
      <div className='grid md:grid-cols-3 gap-2'>
        <input className='border rounded px-2 py-2' placeholder='Origin Country'/>
        <input className='border rounded px-2 py-2' placeholder='HS Code'/>
        <input className='border rounded px-2 py-2' placeholder='Destination'/>
      </div>
      <div className='flex gap-2'>
        <button className='cta-primary rounded-xl px-4 py-2'>Calculate</button>
        <button className='rounded-xl border px-4 py-2'>Insert into Email</button>
      </div>
    </div>
  )
}