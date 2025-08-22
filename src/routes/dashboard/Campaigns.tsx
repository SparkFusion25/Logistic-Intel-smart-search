import CampaignBuilder from '@/components/campaigns/CampaignBuilder';

export default function Campaigns() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Campaign Manager</h1>
        <p className="text-muted-foreground">Create and manage outreach campaigns</p>
      </div>
      <CampaignBuilder onSave={(campaign) => console.log('Campaign saved:', campaign)} />
    </div>
  );
}