import { DashboardStats } from './DashboardStats';
import { QuickSearchCard } from './QuickSearchCard';
import { MiniCRMList } from './MiniCRMList';
import { ManualQuoteCard } from './ManualQuoteCard';
import { TariffCalculatorCard } from './TariffCalculatorCard';

export function DashboardOverview() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your trade operations.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <DashboardStats />

      {/* Main Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Quick Search */}
        <QuickSearchCard />
        
        {/* Mini CRM */}
        <MiniCRMList />
        
        {/* Manual Quote */}
        <ManualQuoteCard />
        
        {/* Tariff Calculator */}
        <div className="xl:col-span-2">
          <TariffCalculatorCard />
        </div>
      </div>

      {/* Additional Quick Actions */}
      <div className="card-glass p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-secondary flex flex-col items-center gap-2 h-20">
            <div className="text-primary">📊</div>
            <span className="text-sm">View Reports</span>
          </button>
          <button className="btn-secondary flex flex-col items-center gap-2 h-20">
            <div className="text-primary">📧</div>
            <span className="text-sm">Send Campaign</span>
          </button>
          <button className="btn-secondary flex flex-col items-center gap-2 h-20">
            <div className="text-primary">📈</div>
            <span className="text-sm">Analytics</span>
          </button>
          <button className="btn-secondary flex flex-col items-center gap-2 h-20">
            <div className="text-primary">⚙️</div>
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}