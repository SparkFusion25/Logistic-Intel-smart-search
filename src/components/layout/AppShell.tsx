import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Topbar />
          <div className="mx-auto max-w-7xl p-3 sm:p-4 pb-24 md:pb-10">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}