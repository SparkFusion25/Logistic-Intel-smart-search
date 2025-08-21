import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, Megaphone, Route } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';


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
        icon={Users}
        change="+12%"
        changeType="increase"
        color="from-blue-400 to-blue-500"
      />
      <StatCard
        title="Companies"
        value={stats.companies.toLocaleString()}
        icon={Building2}
        change="+8%"
        changeType="increase"
        color="from-green-400 to-green-500"
      />
      <StatCard
        title="Campaigns"
        value={stats.campaigns.toString()}
        icon={Megaphone}
        change="+25%"
        changeType="increase"
        color="from-purple-400 to-purple-500"
      />
      <StatCard
        title="Top Tradelane"
        value={stats.topTradelane}
        icon={Route}
        color="from-orange-400 to-orange-500"
      />
    </div>
  );
}