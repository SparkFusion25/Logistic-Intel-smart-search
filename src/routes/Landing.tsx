import StickyCTABar from '@/components/ui/StickyCTABar'
export default function Landing(){
  return(
    <div className='space-y-10'>
      <section className='surface p-8 md:p-12 text-center'>
        <h1 className='text-3xl md:text-5xl font-bold text-ink'>Search shipments. Start conversations. Win freight.</h1>
        <p className='mt-4 text-muted'>Real air & ocean data with AI contact enrichment, quotes/RFPs, and tracked outreach.</p>
        <div className='mt-6 flex justify-center gap-3'>
          <a className='cta-primary rounded-xl px-5 py-3' href='/app/search'>Start Free</a>
          <a className='cta-secondary rounded-xl px-5 py-3' href='/pricing'>See Demo</a>
        </div>
      </section>
      <section className='surface p-6'>Feature rows (Search → Company → Outreach → Quote/Tariff → Pricing)</section>
      <StickyCTABar label='Start Free' onClick={()=>location.assign('/app/search')} />
    </div>
  )
}