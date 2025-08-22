import React from 'react';
import { FourCardStats } from './FourCardStats';
import { RecentCompaniesCard } from './RecentCompaniesCard';
import { QuickSearchCard } from './QuickSearchCard';
import MarketBenchmark from '@/components/benchmark/MarketBenchmark';
import { BulkImportTest } from '../test/BulkImportTest';

export function DashboardOverviewEnhanced() {
  return (
    <div className="flex flex-col">
      {/* Premium Header - Mobile Optimized */}
      <div className="card-glass p-4 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Dashboard Intelligence<span className="text-base sm:text-lg">™</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Welcome back! Here's what's happening with your trade operations.
          </p>
        </div>
        
        {/* Four Card Stats - Mobile Responsive */}
        <div className="w-full">
          <FourCardStats />
        </div>
      </div>

      {/* Main Content - Mobile Optimized Spacing */}
      <div className="space-y-6 sm:space-y-8 p-3 sm:p-4 lg:p-6">

        {/* Recent Companies Added - Full Width Mobile Optimized */}
        <div className="w-full">
          <RecentCompaniesCard />
        </div>
        
        {/* Quick Search and Market Benchmark - Mobile Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="w-full">
            <div className="mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">Quick Search</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Search companies and shipments</p>
            </div>
            <div className="w-full">
              <QuickSearchCard />
            </div>
          </div>
          <div className="w-full">
            <div className="mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">Market Benchmark</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Trade route intelligence</p>
            </div>
            <div className="card-glass p-4 sm:p-6 w-full">
              <MarketBenchmark />
            </div>
          </div>
        </div>

        {/* Premium Quick Actions - Mobile Optimized Grid */}
        <div className="card-glass p-4 sm:p-6 lg:p-8 w-full">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <div className="text-primary text-base sm:text-lg font-bold">⚡</div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Quick Actions</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Streamline your workflow with one-click tools</p>
            </div>
          </div>
          
          {/* Mobile-optimized action grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <button className="card-glass p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 min-h-[100px] sm:min-h-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border-0 touch-manipulation">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <div className="text-white text-base sm:text-lg font-bold">📊</div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground text-center">View Reports</span>
              <span className="text-xs text-muted-foreground text-center leading-tight">Access analytics dashboard</span>
            </button>
            
            <button className="card-glass p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 min-h-[100px] sm:min-h-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border-0 touch-manipulation">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <div className="text-white text-base sm:text-lg font-bold">🚀</div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground text-center">Create Campaign</span>
              <span className="text-xs text-muted-foreground text-center leading-tight">Launch marketing campaign</span>
            </button>
            
            <button className="card-glass p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 min-h-[100px] sm:min-h-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border-0 touch-manipulation">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <div className="text-white text-base sm:text-lg font-bold">📈</div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground text-center">Analytics</span>
              <span className="text-xs text-muted-foreground text-center leading-tight">Performance insights</span>
            </button>
            
            <button className="card-glass p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 min-h-[100px] sm:min-h-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border-0 touch-manipulation">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <div className="text-white text-base sm:text-lg font-bold">⚙️</div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground text-center">Settings</span>
              <span className="text-xs text-muted-foreground text-center leading-tight">Configure preferences</span>
            </button>
          </div>
        </div>

        {/* Temporary Test Component for Bulk Import - Mobile Hidden on Small Screens */}
        <div className="card-glass p-4 sm:p-6 lg:p-8 w-full hidden sm:block">
          <BulkImportTest />
        </div>
      </div>
    </div>
  );
}