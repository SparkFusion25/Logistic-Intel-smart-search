import SiteShell from '@/components/layout/SiteShell';
import Link from 'next/link';
export default function Dashboard(){
  const Tile=({href,label,desc}:{href:string;label:string;desc:string})=> (
    <Link href={href} className='rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition'>
      <div className='font-semibold'>{label}</div>
      <div className='text-sm text-slate-300'>{desc}</div>
    </Link>
  );
  return (
    <SiteShell>
      <h1 className='text-xl font-semibold mb-4'>Dashboard</h1>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
        <Tile href='/search' label='Search' desc='Company & shipment intelligence' />
        <Tile href='/crm' label='CRM' desc='Contacts, enrichment, outreach' />
      </div>
    </SiteShell>
  );
}