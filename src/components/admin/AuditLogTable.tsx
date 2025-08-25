export default function AuditLogTable(){
  return(
    <div className='surface p-4'>
      <h3 className='section-title mb-3'>Audit Logs</h3>
      <table className='w-full text-sm'>
        <thead><tr className='text-left text-muted'><th>Time</th><th>User</th><th>Action</th><th>Target</th></tr></thead>
        <tbody>
          <tr><td>2025-08-25 09:12</td><td>alex@acme.com</td><td>enrichment.started</td><td>Hwashin Georgia</td></tr>
        </tbody>
      </table>
    </div>
  )
}