export default function DataHealth(){
  return(
    <div className='surface p-4 space-y-2'>
      <h3 className='section-title'>Data Health</h3>
      <div className='grid md:grid-cols-4 gap-2'>
        <div className='border rounded p-3'>BTS last refresh: 2025-08-20</div>
        <div className='border rounded p-3'>Census last refresh: 2025-08-21</div>
        <div className='border rounded p-3'>Errors (24h): 0</div>
        <div className='border rounded p-3'>Queue depth: 1</div>
      </div>
    </div>
  )
}