export default function CampaignBuilder(){
  return(
    <div className='surface p-4 space-y-3'>
      <h2 className='section-title'>New Campaign</h2>
      <div className='grid md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <input className='border rounded w-full px-2 py-2' placeholder='Campaign Name'/>
          <div className='border rounded p-3'>Recipients list (select contacts)</div>
          <button className='rounded border px-3 py-2'>Add Step</button>
        </div>
        <div className='border rounded p-3'>Live preview</div>
      </div>
      <div className='flex gap-2'>
        <button className='rounded border px-4 py-2'>Save Draft</button>
        <button className='cta-primary rounded-xl px-4 py-2'>Start</button>
      </div>
    </div>
  )
}