import * as React from 'react';
import dynamic from 'next/dynamic';
import SiteShell from '@/components/layout/SiteShell';
const CRMPanel = dynamic(()=>import('@/components/crm/CRMPanel'),{ ssr:false });
export default function CRMPage(){
  return (
    <SiteShell>
      <div className='flex items-center justify-between mb-3'>
        <h1 className='text-lg font-semibold'>CRM</h1>
      </div>
      <CRMPanel/>
    </SiteShell>
  );
}