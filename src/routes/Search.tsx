import CompanyCard from '@/components/company/CompanyCard'
import FilterChips from '@/components/search/FilterChips'
export default function Search(){
  return(
    <div className='space-y-4'>
      <FilterChips>
        <button className='rounded-full border px-3 py-1'>All</button>
        <button className='rounded-full border px-3 py-1'>✈ Air</button>
        <button className='rounded-full border px-3 py-1'>🚢 Ocean</button>
        <button className='rounded-full border px-3 py-1'>HS: 8708</button>
        <button className='rounded-full border px-3 py-1'>Origin: CN</button>
      </FilterChips>
      <div className='max-w-screen-xl mx-auto grid gap-3 p-3'>
        {[1,2,3].map(i=>(
          <CompanyCard key={i} name={`Sample Importer ${i}`} location='Atlanta, GA' airPct={35} oceanPct={65} shipments12m={128} lastSeen='2025‑07‑14' onAdd={()=>{}} onOutreach={()=>{}} onQuote={()=>{}}/>
        ))}
      </div>
    </div>
  )
}