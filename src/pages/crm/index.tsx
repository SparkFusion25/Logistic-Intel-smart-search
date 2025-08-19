import AppShell from '@/components/layout/AppShell';
import ContactsTable from '@/components/crm/ContactsTable';
export default function CRMPage(){
  return (
    <AppShell>
      <h1 className="text-xl font-semibold mb-3">CRM</h1>
      <ContactsTable/>
    </AppShell>
  );
}