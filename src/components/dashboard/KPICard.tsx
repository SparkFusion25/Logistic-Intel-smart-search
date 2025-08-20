import * as React from 'react';

type Props = { label: string; value: string | number; delta?: string; icon?: React.ReactNode };
const KPICard: React.FC<Props> = ({ label, value, delta, icon }) => (
  <div className="kpi">
    <div className="flex items-center justify-between mb-2 text-slate-400">
      <span className="text-xs">{label}</span>
      {icon}
    </div>
    <div className="text-2xl font-semibold tracking-tight">{value}</div>
    {delta && <div className="mt-1 text-xs text-slate-400">{delta}</div>}
  </div>
);
export default KPICard;