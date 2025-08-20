import TopNav from './TopNav';
import React from 'react';
export default function SiteShell({children}:{children:React.ReactNode}){
  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <TopNav/>
      <main className='mx-auto max-w-7xl px-4 py-5 md:py-8'>{children}</main>
    </div>
  );
}