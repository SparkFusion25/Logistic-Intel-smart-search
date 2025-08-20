import AppShell from '@/components/layout/AppShell';
import CampaignBuilder from '@/components/campaigns/CampaignBuilder';
export default function CampaignsPage(){
  return (
    <AppShell>
      <h1 className="text-xl font-semibold mb-3">Campaigns</h1>
      <CampaignBuilder/>
    </AppShell>
  );
}