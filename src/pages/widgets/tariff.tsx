import dynamic from 'next/dynamic';
import SiteShell from '@/components/layout/SiteShell';
const TariffCalculator = dynamic(()=>import('@/components/widgets/TariffCalculator'),{ ssr:false });
export default function TariffPage(){
  return (
    <SiteShell>
      <h1 className='text-lg font-semibold mb-3'>Tariff Calculator</h1>
      <TariffCalculator/>
    </SiteShell>
  );
}