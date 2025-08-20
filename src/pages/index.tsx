import SiteShell from '@/components/layout/SiteShell';
import Link from 'next/link';
export default function Home(){
  return (
    <SiteShell>
      <section className='grid md:grid-cols-2 gap-6 items-center'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>Logistics Intelligence + CRM</h1>
          <p className='mt-3 text-slate-300'>Search companies & shipments, enrich contacts, and drive outreach. Premium UI, mobile‑first.</p>
          <div className='mt-5 flex gap-2'>
            <Link href='/search' className='px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500'>Try Search</Link>
            <Link href='/crm' className='px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10'>Open CRM</Link>
          </div>
        </div>
        <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
          <div className='text-sm mb-2 opacity-80'>What you can do</div>
          <ul className='grid sm:grid-cols-2 gap-2 text-sm'>
            <li className='rounded-xl border border-white/10 bg-white/5 p-3'>🔎 Unified shipment search</li>
            <li className='rounded-xl border border-white/10 bg-white/5 p-3'>🧠 AI query assist</li>
            <li className='rounded-xl border border-white/10 bg-white/5 p-3'>👤 Apollo enrichment</li>
            <li className='rounded-xl border border-white/10 bg-white/5 p-3'>💼 CRM + outreach</li>
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}