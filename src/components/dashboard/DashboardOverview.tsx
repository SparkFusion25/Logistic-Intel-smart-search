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
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <div className="text-primary text-lg font-bold">⚡</div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Streamline your workflow with one-click tools</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="card-glass p-6 flex flex-col items-center gap-3 min-h-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <div className="text-white text-lg font-bold">📊</div>
            </div>
            <span className="text-sm font-semibold text-foreground">View Reports</span>
            <span className="text-xs text-muted-foreground text-center">Access analytics dashboard</span>
          </button>
          <button className="card-glass p-6 flex flex-col items-center gap-3 min-h-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <div className="text-white text-lg font-bold">🚀</div>
            </div>
            <span className="text-sm font-semibold text-foreground">Create Campaign</span>
            <span className="text-xs text-muted-foreground text-center">Launch marketing campaign</span>
          </button>
          <button className="card-glass p-6 flex flex-col items-center gap-3 min-h-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <div className="text-white text-lg font-bold">📈</div>
            </div>
            <span className="text-sm font-semibold text-foreground">Analytics</span>
            <span className="text-xs text-muted-foreground text-center">Performance insights</span>
          </button>
          <button className="card-glass p-6 flex flex-col items-center gap-3 min-h-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <div className="text-white text-lg font-bold">⚙️</div>
            </div>
            <span className="text-sm font-semibold text-foreground">Settings</span>
            <span className="text-xs text-muted-foreground text-center">Configure preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}