import AppShell from '@/components/layout/AppShell';
import CampaignBuilder from '@/components/campaigns/CampaignBuilder';
export default function CampaignsPage(){
  const handleSave = (campaign: any) => {
    console.log('Campaign saved:', campaign);
    // Handle campaign save logic here
  };

  return (
    <AppShell>
      <h1 className="text-xl font-semibold mb-3">Campaigns</h1>
      <CampaignBuilder onSave={handleSave}/>
    </AppShell>
  );
}