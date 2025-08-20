import Link from 'next/link';
import { useRouter } from 'next/router';
export default function TopNav(){
  const r = useRouter();
  const tab = (href:string, label:string)=> (
    <Link href={href} className={`px-3 py-1.5 rounded-xl border text-sm hover:bg-white/10 ${r.pathname===href?'bg-white/10 border-white/20':'bg-white/5 border-white/10'}`}>{label}</Link>
  );
  return (
    <header className='sticky top-0 z-30 backdrop-blur bg-slate-950/70 border-b border-white/10'>
      <div className='mx-auto max-w-7xl px-4 py-3 flex items-center gap-3'>
        <Link href='/' className='flex items-center gap-2'>
          <img src='/logo-icon.svg' alt='Valesco' className='h-7 w-7' />
          <span className='font-semibold'>Valesco</span>
        </Link>
        <div className='flex-1' />
        <nav className='flex items-center gap-2'>
          {tab('/dashboard','Dashboard')}
          {tab('/search','Search')}
          {tab('/crm','CRM')}
          {tab('/widgets','Widgets')}
        </nav>
      </div>
    </header>
  );
}