import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
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
    <div className="card-glass p-6 animate-fade-in-up hover:animate-pulse-glow">
      <div className="flex items-center justify-between mb-4">
        <div className="icon-circle-gradient">
          <div className="text-white">
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
        <p className="text-3xl font-bold gradient-text animate-count-up">{value}</p>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
      </div>
    </div>
  );
}

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalContacts: '0',
    searchQueries: '0',
    quotesGenerated: '0',
    activeDeals: '0',
    monthlyRevenue: '$0',
    globalReach: '0 Countries'
  });

  // Load real data from Supabase
  useEffect(() => {
    const loadRealStats = async () => {
      try {
        // Get CRM contacts count
        const { count: contactCount, error: contactError } = await supabase
          .from('crm_contacts')
          .select('*', { count: 'exact', head: true });
        
        if (contactError) throw contactError;

        // Get quotes count
        const { count: quotesCount, error: quotesError } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true });

        // Get deals count
        const { count: dealsCount, error: dealsError } = await supabase
          .from('deals')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');

        // Get unified shipments for trade volume
        const { data: shipmentsData, error: shipmentsError } = await supabase
          .from('unified_shipments')
          .select('value_usd')
          .not('value_usd', 'is', null)
          .limit(1000);

        // Get unique countries for global reach
        const { data: countriesData, error: countriesError } = await supabase
          .from('unified_shipments')
          .select('origin_country, destination_country')
          .not('origin_country', 'is', null)
          .not('destination_country', 'is', null);

        const tradeVolume = shipmentsData?.reduce((sum, item) => sum + (item.value_usd || 0), 0) || 0;
        const countries = new Set();
        countriesData?.forEach(item => {
          if (item.origin_country) countries.add(item.origin_country);
          if (item.destination_country) countries.add(item.destination_country);
        });

        const formatCurrency = (amount: number) => {
          if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
          if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
          if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
          return `$${amount.toLocaleString()}`;
        };

        setStats({
          totalContacts: (contactCount || 0).toLocaleString(),
          searchQueries: '2,847', // Mock data for now
          quotesGenerated: (quotesCount || 0).toLocaleString(),
          activeDeals: (dealsCount || 0).toLocaleString(),
          monthlyRevenue: formatCurrency(tradeVolume),
          globalReach: `${countries.size} Countries`
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };

    loadRealStats();
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