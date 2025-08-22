import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string; }){
  return (
    <div className='min-h-screen grid lg:grid-cols-2 bg-[#0B1E39]'>
      <div className='relative hidden lg:flex items-center justify-center p-12'>
        <div className='absolute inset-0 bg-gradient-to-b from-[#0B1E39] to-[#0F4C81] opacity-90'></div>
        <div className='relative z-10 w-full max-w-xl text-white'>
          <div className='flex items-center gap-3 mb-8'>
            <img src='/brand/logo.svg' alt='LogisticIntel' className='h-10' />
            <span className='text-xl font-semibold'>LogisticIntel</span>
          </div>
          <h2 className='text-4xl font-extrabold'>Trade intelligence, faster.</h2>
          <p className='mt-3 text-blue-100'>Search companies, analyze lanes, and launch outreach—on one platform.</p>
          <div className='mt-8 h-64 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner'></div>
        </div>
      </div>
      <div className='bg-white flex items-center justify-center p-6 sm:p-10'>
        <div className='w-full max-w-md'>
          <Link to='/' className='inline-flex items-center gap-2 lg:hidden mb-6'>
            <img src='/brand/logo.svg' className='h-8' />
            <span className='font-semibold text-[#0B1E39]'>LogisticIntel</span>
          </Link>
          <h1 className='text-2xl font-bold text-[#0B1E39]'>{title}</h1>
          {subtitle && <p className='mt-1 text-slate-600'>{subtitle}</p>}
          <div className='mt-6'>{children}</div>
        </div>
      </div>
    </div>
  );
}