export default function BulkImportHistory(){
  return(
    <div className='surface p-4'>
      <h3 className='section-title mb-3'>History</h3>
      <table className='w-full text-sm'>
        <thead><tr className='text-left text-muted'><th>ID</th><th>File</th><th>Status</th><th>OK</th><th>Errors</th><th>Finished</th></tr></thead>
        <tbody>
          <tr><td>#1</td><td>suppliers.xlsx</td><td>success</td><td>980</td><td>12</td><td>2025-08-22</td></tr>
        </tbody>
      </table>
    </div>
  )
}