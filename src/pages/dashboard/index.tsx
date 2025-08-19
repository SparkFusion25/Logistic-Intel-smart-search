import * as React from 'react';
import Shell from '../../components/layout/DashboardShell';
import KPICard from '../../components/dashboard/KPICard';
import TopRoutesChart from '../../components/dashboard/charts/TopRoutesChart';

export default function DashboardPage() {
  return (
    <Shell title="Overview">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPICard label="Records Today" value={"12,480"} delta={"+4.2% vs yesterday"} />
        <KPICard label="Companies Detected" value={"2,315"} />
        <KPICard label="Likely Air Shippers" value={"184"} delta={"BTS confirmed"} />
        <KPICard label="Active Campaigns" value={3} />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopRoutesChart items={[{ route: 'ICN → ORD', count: 84 }, { route: 'FRA → ATL', count: 62 }, { route: 'CNSHA → USLAX', count: 48 }]} />
        <div className="li-card p-4">
          <div className="mb-3 text-sm text-slate-300">Recent Activity</div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between"><span className="text-slate-300">Campaign "Q4 Prospecting" started</span><span className="text-slate-500">2h ago</span></li>
            <li className="flex items-center justify-between"><span className="text-slate-300">12 contacts enriched via Apollo</span><span className="text-slate-500">5h ago</span></li>
            <li className="flex items-center justify-between"><span className="text-slate-300">Tariff cache refreshed</span><span className="text-slate-500">1d ago</span></li>
          </ul>
        </div>
      </div>
    </Shell>
  );
}