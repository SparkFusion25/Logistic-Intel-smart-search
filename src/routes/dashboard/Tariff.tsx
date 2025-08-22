import TariffCalculator from '@/components/widgets/TariffCalculator';

export default function Tariff() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Tariff Calculator</h1>
        <p className="text-muted-foreground">Calculate import duties and tariffs</p>
      </div>
      <TariffCalculator />
    </div>
  );
}