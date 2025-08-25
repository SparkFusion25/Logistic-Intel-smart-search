export default function PlanManager(){
  return(
    <div className='surface p-4 space-y-2'>
      <h3 className='section-title'>Plan & Seats</h3>
      <div className='grid md:grid-cols-3 gap-2'>
        <div className='border rounded p-3'>Current plan: Pro</div>
        <div className='border rounded p-3'>Seats: 5</div>
        <button className='cta-secondary rounded-xl px-4 py-2'>Upgrade</button>
      </div>
    </div>
  )
}