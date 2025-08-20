import { useState, useEffect } from 'react';
import { TrendingUp, Users, Search, FileText, DollarSign, Globe } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="card-glass p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <div className="text-primary">
            {icon}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.positive ? 'text-emerald-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`h-4 w-4 ${trend.positive ? '' : 'rotate-180'}`} />
            {trend.value}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalContacts: '2,847',
    searchQueries: '1,234',
    quotesGenerated: '89',
    activeDeals: '12',
    monthlyRevenue: '$45.2K',
    globalReach: '47 Countries'
  });

  // Mock data - replace with real API calls
  useEffect(() => {
    // This would fetch real KPIs from your API
    // fetchDashboardStats().then(setStats);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <StatCard
        title="Total Contacts"
        value={stats.totalContacts}
        icon={<Users className="h-5 w-5" />}
        trend={{ value: "+12%", positive: true }}
      />
      <StatCard
        title="Search Queries"
        value={stats.searchQueries}
        icon={<Search className="h-5 w-5" />}
        trend={{ value: "+8%", positive: true }}
      />
      <StatCard
        title="Quotes Generated"
        value={stats.quotesGenerated}
        icon={<FileText className="h-5 w-5" />}
        trend={{ value: "+24%", positive: true }}
      />
      <StatCard
        title="Active Deals"
        value={stats.activeDeals}
        icon={<TrendingUp className="h-5 w-5" />}
        trend={{ value: "-2%", positive: false }}
      />
      <StatCard
        title="Monthly Revenue"
        value={stats.monthlyRevenue}
        icon={<DollarSign className="h-5 w-5" />}
        trend={{ value: "+18%", positive: true }}
      />
      <StatCard
        title="Global Reach"
        value={stats.globalReach}
        icon={<Globe className="h-5 w-5" />}
      />
    </div>
  );
}