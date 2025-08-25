import { useParams } from 'react-router-dom'
import { useState } from 'react'
import CompanyHeader from '@/components/company/CompanyHeader'
import CompanyTabs from '@/components/company/CompanyTabs'
import KpiTiles from '@/components/ui/KpiTiles'
import ShipmentsTable from '@/components/company/ShipmentsTable'
import GateBanner from '@/components/ui/GateBanner'
export default function Company(){
  const { companyId } = useParams()
  const [tab,setTab] = useState('Shipments')
  return(
    <div className='space-y-4'>
      <CompanyHeader name={`Company ${companyId}`} location='Atlanta, GA' onOutreach={()=>{}} onQuote={()=>{}} onAdd={()=>{}} onFeedback={()=>{}}/>
      <GateBanner />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 space-y-3'>
          <KpiTiles items={[
            {label:'Total Shipments',value:'—'},{label:'Last Seen',value:'—'},
            {label:'Mode Mix',value:'—'},{label:'Top HS',value:'—'},{label:'Top Supplier',value:'—'}
          ]}/>
          <CompanyTabs active={tab} setActive={setTab}/>
          {tab==='Shipments' && <ShipmentsTable rows={[]}/>} 
          {tab==='Contacts' && <div className='surface p-4 text-muted'>🔒 Contacts hidden on Free. Upgrade to unlock verified emails & LinkedIn.</div>}
          {tab==='Routes' && <div className='surface p-4'>BTS route intelligence here.</div>}
          {tab==='Partners' && <div className='surface p-4'>Top suppliers/buyers here.</div>}
          {tab==='Quotes & RFPs' && <div className='surface p-4'>Saved quotes & tariff lookups.</div>}
          {tab==='Notes & Activity' && <div className='surface p-4'>Team notes & outreach log.</div>}
        </div>
        <aside className='space-y-3'>
          <div className='surface p-4'>Contacts & Enrichment (AI)</div>
          <div className='surface p-4'>Tariff quick-check</div>
          <div className='surface p-4'>Start Campaign</div>
          <div className='surface p-4'>Tags & Notes</div>
        </aside>
      </div>
    </div>
  )
}