import { Link, useLocation } from 'react-router-dom';
const NavItem = ({ href, label }: { href: string; label: string }) => {
  const { pathname } = useLocation();
  const active = pathname === href || pathname.startsWith(href);
  return (
    <Link to={href} className={`block rounded-xl px-3 py-2 text-sm md:text-[13px] transition ${active ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800/60'}`}>{label}</Link>
  );
};
export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col gap-2 bg-slate-900/60 p-3 border-r border-slate-800 sticky top-0 h-[100dvh]">
      <div className="px-2 py-3 text-slate-200 font-semibold tracking-wide">Logistic Intel</div>
      <nav className="flex flex-col gap-1">
        <NavItem href="/dashboard" label="Overview" />
        <NavItem href="/search" label="Search" />
        <NavItem href="/crm" label="CRM" />
        <NavItem href="/email" label="Email" />
        <NavItem href="/campaigns" label="Campaigns" />
        <NavItem href="/widgets/quote" label="Quote" />
        <NavItem href="/widgets/tariff" label="Tariff" />
        <NavItem href="/admin" label="Admin" />
      </nav>
      <div className="mt-auto text-[11px] text-slate-500 px-2 pb-2">Live Data • Pro Trial</div>
    </aside>
  );
}