
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./components/pages/Index";
import { AppShell } from "@/components/ui/AppShell";
import SearchPanel from "@/components/search/SearchPanel";
import CRMPanel from "@/components/crm/CRMPanel";
import { CRMDashboard } from "@/components/dashboard/CRMDashboard";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import EmailComposer from "@/components/email/EmailComposer";
import CampaignBuilder from "@/components/campaigns/CampaignBuilder";
import TariffCalculator from "@/components/widgets/TariffCalculator";
import QuoteGenerator from "@/components/widgets/QuoteGenerator";
import AdminPageClient from "@/components/admin/AdminPageClient";
import MarketBenchmark from "@/components/benchmark/MarketBenchmark";

const queryClient = new QueryClient();

// Dashboard Page Wrappers
const DashboardPage = () => <DashboardOverview />;

const SearchPage = () => <SearchPanel />;

const CRMPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">CRM</h1>
    </div>
    <CRMPanel />
  </div>
);

const EmailPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Email</h1>
    </div>
    <EmailComposer />
  </div>
);

const CampaignsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Campaigns</h1>
    </div>
    <CampaignBuilder onSave={(campaign) => console.log('Campaign saved:', campaign)} />
  </div>
);

const CampaignAnalyticsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Campaign Analytics</h1>
    </div>
    <div className="bg-card rounded-lg p-6 shadow-card">
      <p className="text-muted-foreground">Campaign analytics and performance metrics coming soon.</p>
    </div>
  </div>
);

const TariffPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Tariff Calculator</h1>
    </div>
    <TariffCalculator />
  </div>
);

const QuotePage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Quote Generator</h1>
    </div>
    <QuoteGenerator />
  </div>
);

const AdminPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Admin</h1>
    </div>
    <AdminPageClient />
  </div>
);

const BenchmarkPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Market Benchmark</h1>
    </div>
    <MarketBenchmark />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
            <Route path="/dashboard/search" element={<AppShell><SearchPage /></AppShell>} />
            <Route path="/dashboard/crm" element={<AppShell><CRMPage /></AppShell>} />
            <Route path="/dashboard/email" element={<AppShell><EmailPage /></AppShell>} />
            <Route path="/dashboard/campaigns" element={<AppShell><CampaignsPage /></AppShell>} />
            <Route path="/dashboard/campaigns/analytics" element={<AppShell><CampaignAnalyticsPage /></AppShell>} />
            <Route path="/dashboard/widgets/tariff" element={<AppShell><TariffPage /></AppShell>} />
            <Route path="/dashboard/widgets/quote" element={<AppShell><QuotePage /></AppShell>} />
            <Route path="/dashboard/admin" element={<AppShell><AdminPage /></AppShell>} />
            <Route path="/dashboard/benchmark" element={<AppShell><BenchmarkPage /></AppShell>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
