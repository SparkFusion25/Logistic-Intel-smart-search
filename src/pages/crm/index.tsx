import * as React from 'react';
import dynamic from 'next/dynamic';
const CRMPanel = dynamic(()=>import('@/components/crm/CRMPanel'),{ ssr:false });
export default function CRMPage(){
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">CRM</h1>
      </div>
      <CRMPanel/>
    </div>
  );
}