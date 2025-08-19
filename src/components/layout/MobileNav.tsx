import { Link, useLocation } from 'react-router-dom';
export default function MobileNav() {
  const { pathname } = useLocation();
  const Item = (p:{href:string;label:string})=>{
    const active = pathname===p.href || pathname.startsWith(p.href);
    return <Link to={p.href} className={`flex-1 text-center py-2 text-[11px] ${active?'text-white':'text-slate-400'}`}>{p.label}</Link>;
  };
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/80 backdrop-blur flex">
      <Item href="/dashboard" label="Overview"/>
      <Item href="/dashboard/search" label="Search"/>
      <Item href="/dashboard/crm" label="CRM"/>
      <Item href="/dashboard/email" label="Email"/>
    </nav>
  );
}