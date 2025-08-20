import * as React from 'react';
import Shell from '@/components/layout/DashboardShell';

export default function CampaignsPage(){
  return (
    <Shell title="Campaigns">
      <div className="li-card p-4">
        <div className="mb-3 text-sm text-slate-300">Your Campaigns</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="li-card p-4">
              <div className="text-slate-200 font-medium">Q{i} Outreach</div>
              <div className="mt-2 text-xs text-slate-400">status: draft</div>
              <button className="mt-3 btn btn-ghost w-full">Open</button>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}