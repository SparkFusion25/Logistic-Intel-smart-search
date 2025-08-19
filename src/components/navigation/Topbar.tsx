import * as React from 'react';
import MobileNav from './MobileNav';
import { Logo } from '../Logo';

const Topbar: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5">
        <div className="flex items-center gap-3 md:hidden">
          <Logo className="text-slate-100" />
        </div>
        <div className="hidden md:block text-sm text-slate-300">
          <span className="badge">{title ?? 'Dashboard'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge">Pro</span>
          <button className="btn btn-ghost">Account</button>
        </div>
      </div>
      <MobileNav />
    </header>
  );
};

export default Topbar;