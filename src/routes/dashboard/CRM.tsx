import { CRMContactsList } from '@/components/dashboard/CRMContactsList';
import PageHeader from '@/ui/PageHeader';
import { CTAPrimary, CTAGhost } from '@/ui/CTA';

export default function CRM() {
  return (
    <div className="px-6 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader 
          title="CRM Dashboard" 
          actions={
            <div className="flex gap-2">
              <CTAGhost>Import Contacts</CTAGhost>
              <CTAPrimary>New Contact</CTAPrimary>
            </div>
          } 
        />
        
        {/* CRM Contacts List */}
        <CRMContactsList />
      </div>
    </div>
  );
}