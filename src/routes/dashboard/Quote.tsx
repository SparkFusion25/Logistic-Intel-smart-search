import QuoteGenerator from '@/components/widgets/QuoteGenerator';

export default function Quote() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quote Generator</h1>
        <p className="text-muted-foreground">Generate professional shipping quotes</p>
      </div>
      <QuoteGenerator />
    </div>
  );
}