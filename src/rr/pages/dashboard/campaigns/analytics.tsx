import * as React from 'react';
import Shell from '@/components/layout/DashboardShell';

export default function CampaignAnalyticsPage(){
  return (
    <Shell title="Campaign Analytics">
      <div className="li-card p-4">
        <div className="text-sm text-slate-300 mb-3">Performance</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="kpi"><div className="text-xs text-slate-400">Open Rate</div><div className="text-2xl font-semibold">48%</div></div>
          <div className="kpi"><div className="text-xs text-slate-400">Click Rate</div><div className="text-2xl font-semibold">9.2%</div></div>
          <div className="kpi"><div className="text-xs text-slate-400">Reply Rate</div><div className="text-2xl font-semibold">4.1%</div></div>
          <div className="kpi"><div className="text-xs text-slate-400">Bounces</div><div className="text-2xl font-semibold">0.7%</div></div>
        </div>
      </div>
    </Shell>
  );
}