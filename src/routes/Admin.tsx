import PlanManager from '@/components/admin/PlanManager'
import ImportJobs from '@/components/admin/ImportJobs'
import FeatureFlags from '@/components/admin/FeatureFlags'
import DataHealth from '@/components/admin/DataHealth'
import AuditLogTable from '@/components/admin/AuditLogTable'
export default function Admin(){
  return(
    <div className='space-y-4'>
      <div className='surface p-6'><h1 className='text-2xl md:text-3xl font-bold'>Admin</h1><div className='text-muted'>Plans, imports, feature flags, data health, and audit logs.</div></div>
      <PlanManager/>
      <FeatureFlags/>
      <DataHealth/>
      <ImportJobs/>
      <AuditLogTable/>
    </div>
  )
}