import { CRMDashboard } from '@/components/dashboard/CRMDashboard';

export default function CRM() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">CRM Dashboard</h1>
        <p className="text-muted-foreground">Manage contacts, deals, and relationships</p>
      </div>
      <CRMDashboard />
    </div>
  );
}