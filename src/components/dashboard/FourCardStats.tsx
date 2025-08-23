import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, Megaphone, Star } from 'lucide-react';
import { KpiCard } from './KpiCard';


export function FourCardStats() {
  const [stats, setStats] = useState({
    contacts: 0,
    companies: 0,
    campaigns: 0,
    watchlist: 0
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

        // Fetch watchlist count
        const { count: watchlistCount } = await supabase
          .from('company_watchlist')
          .select('*', { count: 'exact', head: true });

        setStats({
          contacts: contactsCount || 0,
          companies: uniqueCompanies,
          campaigns: campaignsCount,
          watchlist: watchlistCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <KpiCard label="Total Contacts" value={stats.contacts} icon={Users} iconColor="text-blue-600" />
      <KpiCard label="Companies Tracked" value={stats.companies} icon={Building2} iconColor="text-green-600" />
      <KpiCard label="Active Campaigns" value={stats.campaigns} icon={Megaphone} iconColor="text-purple-600" />
      <KpiCard label="Watchlist" value={stats.watchlist} icon={Star} iconColor="text-yellow-600" />
    </>
  );
}