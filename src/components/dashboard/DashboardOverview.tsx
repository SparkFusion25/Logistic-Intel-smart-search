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

      {/* Premium Quick Actions */}
      <div className="card-glass p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-circle-gradient">
            <div className="text-white">⚡</div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Streamline your workflow</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="glass p-6 flex flex-col items-center gap-3 h-24 hover:scale-105 transition-all duration-300 group">
            <div className="icon-circle-gradient group-hover:scale-110 transition-transform">
              <div className="text-white text-lg">📊</div>
            </div>
            <span className="text-sm font-medium">View Reports</span>
          </button>
          <button className="glass p-6 flex flex-col items-center gap-3 h-24 hover:scale-105 transition-all duration-300 group">
            <div className="icon-circle-gradient group-hover:scale-110 transition-transform">
              <div className="text-white text-lg">🚀</div>
            </div>
            <span className="text-sm font-medium">Create Campaign</span>
          </button>
          <button className="glass p-6 flex flex-col items-center gap-3 h-24 hover:scale-105 transition-all duration-300 group">
            <div className="icon-circle-gradient group-hover:scale-110 transition-transform">
              <div className="text-white text-lg">📈</div>
            </div>
            <span className="text-sm font-medium">Analytics</span>
          </button>
          <button className="glass p-6 flex flex-col items-center gap-3 h-24 hover:scale-105 transition-all duration-300 group">
            <div className="icon-circle-gradient group-hover:scale-110 transition-transform">
              <div className="text-white text-lg">⚙️</div>
            </div>
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}