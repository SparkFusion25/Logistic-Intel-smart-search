import PlanGrid from '@/components/pricing/PlanGrid'
export default function Pricing(){
  return(
    <div className='space-y-4'>
      <div className='surface p-6 text-center'>
        <h1 className='text-3xl font-bold'>Pricing</h1>
        <p className='text-muted mt-2'>Choose the plan that turns shipments into meetings.</p>
      </div>
      <div className='max-w-screen-xl mx-auto p-3'>
        <PlanGrid/>
      </div>
    </div>
  )
}