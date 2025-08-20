import SiteShell from '@/components/layout/SiteShell';
import Link from 'next/link';
export default function Widgets(){
  const Card=({href,label,desc}:{href:string;label:string;desc:string})=> (
    <Link href={href} className='rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition block'>
      <div className='font-semibold'>{label}</div>
      <div className='text-sm text-slate-300'>{desc}</div>
    </Link>
  );
  return (
    <SiteShell>
      <h1 className='text-lg font-semibold mb-3'>Widgets</h1>
      <div className='grid sm:grid-cols-2 gap-3'>
        <Card href='/widgets/tariff' label='Tariff Calculator' desc='Estimate duty & taxes by HS code' />
        <Card href='/widgets/quote' label='Quote Generator' desc='Build and export a customer quote' />
      </div>
    </SiteShell>
  );
}