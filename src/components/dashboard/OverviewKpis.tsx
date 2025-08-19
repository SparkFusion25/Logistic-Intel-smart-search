import KPICard from './KPICard';
export default function OverviewKpis(){
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <KPICard label="Total Results (24h)" value="—" sub="live from search"/>
      <KPICard label="Companies" value="—"/>
      <KPICard label="Air Shippers" value="—"/>
      <KPICard label="Ocean TEUs" value="—"/>
      <KPICard label="Campaigns Running" value="0"/>
      <KPICard label="Quotes Today" value="0"/>
    </div>
  );
}