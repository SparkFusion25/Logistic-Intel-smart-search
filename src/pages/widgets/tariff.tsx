import AppShell from '@/components/layout/AppShell';
import TariffCalculator from '@/components/widgets/TariffCalculator';
export default function TariffPage(){
  return (
    <AppShell>
      <h1 className="text-xl font-semibold mb-3">Tariff Calculator</h1>
      <TariffCalculator/>
    </AppShell>
  );
}