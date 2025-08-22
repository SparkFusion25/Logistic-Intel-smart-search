import { CRMDashboard } from '@/components/dashboard/CRMDashboard';
import GlossyCard from '@/ui/GlossyCard';
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
      <GlossyCard className="p-0 min-h-[600px]">
        <CRMDashboard />
      </GlossyCard>
    </div>
  );
}