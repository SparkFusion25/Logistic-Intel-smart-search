import KpiCard from '@/components/dashboard/KpiCard'
import { MiniBar, MiniLine } from '@/components/dashboard/MiniCharts'
export default function Dashboard(){
  return(
    <div className='space-y-4'>
      <div className='surface p-6'>
        <h1 className='text-2xl md:text-3xl font-bold'>Dashboard</h1>
        <div className='text-muted'>Search usage, enrichment success, and outreach performance.</div>
      </div>
      <div className='grid md:grid-cols-4 gap-3'>
        <KpiCard title='Searches (7d)' value={412} delta='+8%'/>
        <KpiCard title='Companies added (7d)' value={86} delta='+11%'/>
        <KpiCard title='Enrichment success' value='72%' delta='+3%'/>
        <KpiCard title='Reply rate' value='12.4%' delta='+0.7%'/>
      </div>
      <div className='grid md:grid-cols-2 gap-3'>
        <MiniBar/>
        <MiniLine/>
      </div>
    </div>
  )
}