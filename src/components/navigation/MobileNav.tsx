import * as React from 'react';
import { Link, useRouter } from 'next/router';
import { Search, Users, Mail, Rocket } from 'lucide-react';

const Tab: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => {
  const { pathname } = useRouter();
  const active = pathname.startsWith(href);
  return (
    <Link href={href} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs ${active ? 'text-white' : 'text-slate-400'}`}>
      {icon}
      {label}
    </Link>
  );
};

const MobileNav: React.FC = () => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/90 backdrop-blur z-40">
    <div className="flex">
      <Tab href="/dashboard/search" icon={<Search size={18} />} label="Search" />
      <Tab href="/dashboard/crm" icon={<Users size={18} />} label="CRM" />
      <Tab href="/dashboard/email" icon={<Mail size={18} />} label="Email" />
      <Tab href="/dashboard/campaigns" icon={<Rocket size={18} />} label="Campaigns" />
    </div>
  </nav>
);

export default MobileNav;