import MarketBenchmark from '@/components/benchmark/MarketBenchmark';

export default function Benchmark() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Market Benchmark</h1>
        <p className="text-muted-foreground">Analyze market rates and trends</p>
      </div>
      <MarketBenchmark />
    </div>
  );
}