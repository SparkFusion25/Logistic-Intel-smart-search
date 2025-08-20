import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../Logo';
import { BarChart3, Search, Users, Mail, Rocket, Target, Calculator, FileText } from 'lucide-react';

const NavItem: React.FC<{ href: string; label: string; icon: React.ReactNode }> = ({ href, label, icon }) => {
  const { pathname } = useLocation();
  const active = pathname.startsWith(href);
  return (
    <Link to={href} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="h-full w-[280px] p-4 bg-slate-950/60 backdrop-blur">
      <div className="flex items-center gap-2 mb-6 px-1">
        <Logo className="text-slate-100" />
      </div>
      <nav className="flex flex-col gap-1">
        <NavItem href="/dashboard" label="Overview" icon={<BarChart3 size={18} />} />
        <NavItem href="/dashboard/search" label="Search" icon={<Search size={18} />} />
        <NavItem href="/dashboard/crm" label="CRM" icon={<Users size={18} />} />
        <NavItem href="/dashboard/email" label="Email" icon={<Mail size={18} />} />
        <NavItem href="/dashboard/campaigns" label="Campaigns" icon={<Rocket size={18} />} />
        <NavItem href="/dashboard/campaigns/analytics" label="Campaign Analytics" icon={<Target size={18} />} />
        <NavItem href="/dashboard/widgets/tariff" label="Tariff Calculator" icon={<Calculator size={18} />} />
        <NavItem href="/dashboard/widgets/quote" label="Quote Generator" icon={<FileText size={18} />} />
      </nav>
      <div className="mt-6 text-xs text-slate-400 px-1">
        <div className="badge">Live Data</div>
      </div>
    </div>
  );
};

export default Sidebar;