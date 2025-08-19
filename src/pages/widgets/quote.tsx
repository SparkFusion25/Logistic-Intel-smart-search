import AppShell from '@/components/layout/AppShell';
import QuoteForm from '@/components/widgets/QuoteForm';
import QuotePreview from '@/components/widgets/QuotePreview';
export default function QuotePage(){
  return (
    <AppShell>
      <h1 className="text-xl font-semibold mb-3">Quote Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <QuoteForm/>
        <QuotePreview/>
      </div>
    </AppShell>
  );
}