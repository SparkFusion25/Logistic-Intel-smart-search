import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, Megaphone } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import { QuickSearchCard } from './QuickSearchCard';


export function FourCardStats() {
  const [stats, setStats] = useState({
    contacts: 0,
    companies: 0,
    campaigns: 0
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

        setStats({
          contacts: contactsCount || 0,
          companies: uniqueCompanies,
          campaigns: campaignsCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
      
      {/* Quick Search Card as the 4th stat */}
      <div className="xl:col-span-1">
        <QuickSearchCard />
      </div>
    </div>
  );
}