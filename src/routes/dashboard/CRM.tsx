import { CRMDashboardSimple } from '@/components/dashboard/CRMDashboardSimple';
import PageHeader from '@/ui/PageHeader';
import { CTAPrimary, CTAGhost } from '@/ui/CTA';

export default function CRM() {
  return (
    <div className="stack-gap">
      <PageHeader 
        title="CRM Dashboard" 
        actions={
          <div className="flex gap-2">
            <CTAGhost>Import Contacts</CTAGhost>
            <CTAPrimary>New Contact</CTAPrimary>
          </div>
        } 
      />
      
      {/* CRM Interface */}
      <div className="min-h-[600px]">
        <CRMDashboardSimple />
      </div>
    </div>
  );
}