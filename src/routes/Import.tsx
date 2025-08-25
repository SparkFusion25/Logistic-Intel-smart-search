import BulkImportForm from '@/components/bulk/BulkImportForm'
import BulkImportHistory from '@/components/bulk/BulkImportHistory'
export default function Import(){
  return(
    <div className='space-y-4'>
      <BulkImportForm/>
      <BulkImportHistory/>
    </div>
  )
}