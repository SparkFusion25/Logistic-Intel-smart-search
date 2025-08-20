import dynamic from 'next/dynamic';
import SiteShell from '@/components/layout/SiteShell';
const QuoteGenerator = dynamic(()=>import('@/components/widgets/QuoteGenerator'),{ ssr:false });
export default function QuotePage(){
  return (
    <SiteShell>
      <h1 className='text-lg font-semibold mb-3'>Quote Generator</h1>
      <QuoteGenerator/>
    </SiteShell>
  );
}