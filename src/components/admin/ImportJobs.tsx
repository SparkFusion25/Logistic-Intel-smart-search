export default function ImportJobs(){
  return(
    <div className='surface p-4'>
      <h3 className='section-title mb-3'>Import Jobs</h3>
      <table className='w-full text-sm'>
        <thead><tr className='text-left text-muted'><th>File</th><th>Status</th><th>OK</th><th>Errors</th><th>Finished</th></tr></thead>
        <tbody>
          <tr><td>example.csv</td><td>success</td><td>1200</td><td>3</td><td>2025-08-20</td></tr>
        </tbody>
      </table>
    </div>
  )
}