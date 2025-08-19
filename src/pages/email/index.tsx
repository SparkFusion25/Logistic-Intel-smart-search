import AppShell from '@/components/layout/AppShell';
import EmailComposer from '@/components/email/EmailComposer';
export default function EmailPage(){
  return (
    <AppShell>
      <h1 className="text-xl font-semibold mb-3">Email</h1>
      <EmailComposer/>
    </AppShell>
  );
}