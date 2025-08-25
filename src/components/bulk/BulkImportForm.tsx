export default function BulkImportForm(){
  return(
    <div className='surface p-4 space-y-3'>
      <h2 className='section-title'>Bulk Import</h2>
      <input type='file' className='border rounded p-2 w-full'/>
      <div className='text-sm text-muted'>CSV/XLSX/XML supported. We map headers to a canonical schema.</div>
      <button className='cta-primary rounded-xl px-4 py-2'>Upload & Process</button>
    </div>
  )
}