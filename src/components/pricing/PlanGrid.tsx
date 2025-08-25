const plans=[{name:'Free',price:'$0',features:['Search shipments','Company pages (limited)','No contacts']},{name:'Pro',price:'$199',features:['Verified contacts','Outreach & Campaigns','Quote/Tariff tools']},{name:'Enterprise',price:'Custom',features:['SSO','Seats & roles','Custom data feeds']}]
export default function PlanGrid(){
  return(
    <div className='grid md:grid-cols-3 gap-4'>
      {plans.map(p=> (
        <div key={p.name} className='surface p-5 flex flex-col justify-between'>
          <div>
            <div className='text-xl font-semibold'>{p.name}</div>
            <div className='text-3xl font-bold mt-2'>{p.price}</div>
            <ul className='mt-4 space-y-1 text-sm text-muted'>
              {p.features.map(f=> <li key={f}>• {f}</li>)}
            </ul>
          </div>
          <a href='/app/search' className='cta-primary mt-6 text-center rounded-xl px-4 py-2'>Choose {p.name}</a>
        </div>
      ))}
    </div>
  )
}