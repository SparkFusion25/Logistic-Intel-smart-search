import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, Megaphone } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import { EmailMiniCard } from './EmailMiniCard';


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
    <>
      {/* KPI Cards using glossy design */}
      <div className="kpi">
        <div className="flex items-center justify-between mb-2">
          <div className="label">Total Contacts</div>
          <Users className="h-4 w-4 text-accent" />
        </div>
        <div className="value">{stats.contacts.toLocaleString()}</div>
      </div>

      <div className="kpi">
        <div className="flex items-center justify-between mb-2">
          <div className="label">Companies Tracked</div>
          <Building2 className="h-4 w-4 text-accent2" />
        </div>
        <div className="value">{stats.companies.toLocaleString()}</div>
      </div>

      <div className="kpi">
        <div className="flex items-center justify-between mb-2">
          <div className="label">Active Campaigns</div>
          <Megaphone className="h-4 w-4 text-success" />
        </div>
        <div className="value">{stats.campaigns}</div>
      </div>

      {/* Email Mini Card - using existing component but will be wrapped in kpi styling */}
      <div className="kpi">
        <EmailMiniCard />
      </div>
    </>
  );
}