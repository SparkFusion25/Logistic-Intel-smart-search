import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, Megaphone, Route } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="card-glass p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          {icon}
        </div>
        {trend && (
          <div className={`text-xs font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}

export function FourCardStats() {
  const [stats, setStats] = useState({
    contacts: 0,
    companies: 0,
    campaigns: 0,
    topTradelane: 'Loading...'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch contacts count
        const { count: contactsCount } = await supabase
          .from('crm_contacts')
          .select('*', { count: 'exact', head: true });

        // Fetch companies count from unified_shipments
        const { data: companiesData } = await supabase
          .from('unified_shipments')
          .select('unified_company_name')
          .not('unified_company_name', 'is', null);
        
        const uniqueCompanies = new Set(companiesData?.map(c => c.unified_company_name)).size;

        // Mock campaigns for now
        const campaignsCount = 3;

        // Get top tradelane
        const { data: tradeData } = await supabase
          .from('unified_shipments')
          .select('origin_country, destination_country')
          .not('origin_country', 'is', null)
          .not('destination_country', 'is', null)
          .limit(100);

        const routes: Record<string, number> = {};
        tradeData?.forEach(row => {
          const route = `${row.origin_country} → ${row.destination_country}`;
          routes[route] = (routes[route] || 0) + 1;
        });

        const topRoute = Object.entries(routes)
          .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'No data';

        setStats({
          contacts: contactsCount || 0,
          companies: uniqueCompanies,
          campaigns: campaignsCount,
          topTradelane: topRoute
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Contacts"
        value={stats.contacts.toLocaleString()}
        icon={<Users className="h-6 w-6 text-white" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Companies"
        value={stats.companies.toLocaleString()}
        icon={<Building2 className="h-6 w-6 text-white" />}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        title="Campaigns"
        value={stats.campaigns}
        icon={<Megaphone className="h-6 w-6 text-white" />}
        trend={{ value: 25, isPositive: true }}
      />
      <StatCard
        title="Top Tradelane"
        value={stats.topTradelane}
        icon={<Route className="h-6 w-6 text-white" />}
      />
    </div>
  );
}