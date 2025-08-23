import { FourCardStats } from './FourCardStats';
import { RecentCompaniesCard } from './RecentCompaniesCard';
import { QuickSearchCard } from './QuickSearchCard';
import MarketBenchmark from '@/components/benchmark/MarketBenchmark';
import { BulkImporter } from './BulkImporter';
import GlossyCard from '@/ui/GlossyCard';
import PageHeader from '@/ui/PageHeader';
import { CTAPrimary, CTAGhost } from '@/ui/CTA';
import { ChartContainer } from '@/ui/ChartTheme';
import SimilarCompaniesList from '@/components/SimilarCompaniesList';

export function DashboardOverview() {
  return (
    <div className="px-6 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <PageHeader 
          title="Dashboard Intelligence™" 
          actions={
            <CTAPrimary>Export Report</CTAPrimary>
          }
        />
        
        {/* Welcome Message */}
        <header className="card-surface rounded-2xl p-5">
          <p className="text-slate-600">
            Welcome back! Here's what's happening with your trade operations.
          </p>
        </header>

        {/* Unified KPI Stats */}
        <section className="grid md:grid-cols-4 gap-4">
          <FourCardStats />
        </section>

      {/* Recent Companies - Full Width */}
      <RecentCompaniesCard />
      
      {/* Quick Search and Market Benchmark */}
      <div className="stack-2">
        <GlossyCard className="p-6">
          <div className="section-header">
            <h3 className="text-lg font-bold text-foreground">Quick Search</h3>
            <p className="text-sm text-muted-foreground">Search companies and shipments</p>
          </div>
          <QuickSearchCard />
        </GlossyCard>
        
        <GlossyCard className="p-6">
          <div className="section-header">
            <h3 className="text-lg font-bold text-foreground">Market Benchmark</h3>
            <p className="text-sm text-muted-foreground">Trade route intelligence</p>
          </div>
          <ChartContainer>
            <MarketBenchmark />
          </ChartContainer>
        </GlossyCard>
      </div>

      {/* Premium Quick Actions */}
      <GlossyCard className="p-6">
        <div className="section-header">
          <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
        </div>
        <div className="stack-3">
          <div className="p-4 rounded-xl bg-surfaceAlt">
            <h4 className="font-semibold mb-2">New Search</h4>
            <p className="text-sm text-muted-foreground mb-3">Find companies and shipments</p>
            <CTAPrimary className="w-full">Start Search</CTAPrimary>
          </div>
          <div className="p-4 rounded-xl bg-surfaceAlt">
            <h4 className="font-semibold mb-2">Import Data</h4>
            <p className="text-sm text-muted-foreground mb-3">Upload your data files</p>
            <CTAGhost className="w-full">Import</CTAGhost>
          </div>
          <div className="p-4 rounded-xl bg-surfaceAlt">
            <h4 className="font-semibold mb-2">Export Report</h4>
            <p className="text-sm text-muted-foreground mb-3">Generate comprehensive reports</p>
            <CTAGhost className="w-full">Export</CTAGhost>
          </div>
        </div>
      </GlossyCard>

      {/* Similar Companies - Simplified Version */}
      <GlossyCard className="p-6">
        <div className="section-header">
          <h3 className="text-lg font-bold text-foreground">Similar Companies</h3>
          <CTAPrimary>View All</CTAPrimary>
        </div>
        <SimilarCompaniesList limit={5} useSimplified={true} />
      </GlossyCard>

        {/* Bulk Import */}
        <BulkImporter />
      </div>
    </div>
  );
}