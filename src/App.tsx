
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

const SearchPage = () => (
  <div className="flex flex-col">
    <div className="card-glass p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Search Intelligence<span className="text-lg">™</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Discover global trade patterns and business opportunities
        </p>
      </div>
    </div>
    <div className="p-4 sm:p-6 lg:p-8 pt-0">
      <SearchPanel />
    </div>
  </div>
);

const CRMPage = () => (
  <div className="flex flex-col">
    <div className="card-glass p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          CRM Intelligence<span className="text-lg">™</span>
        </h1>
      </div>
      <CRMPanel />
    </div>
  </div>
);

const EmailPage = () => (
  <div className="flex flex-col">
    <div className="card-glass p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Email Intelligence<span className="text-lg">™</span>
        </h1>
      </div>
      <EmailComposer />
    </div>
  </div>
);

const CampaignsPage = () => (
  <div className="flex flex-col">
    <div className="card-glass p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Campaign Intelligence<span className="text-lg">™</span>
        </h1>
      </div>
      <CampaignBuilder onSave={(campaign) => console.log('Campaign saved:', campaign)} />
    </div>
  </div>
);

const CampaignAnalyticsPage = () => (
  <div className="flex flex-col">
    <div className="card-glass p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Analytics Intelligence<span className="text-lg">™</span>
        </h1>
      </div>
      <div className="bg-card rounded-lg p-6 shadow-card">
        <p className="text-muted-foreground">Campaign analytics and performance metrics coming soon.</p>
      </div>
    </div>
  </div>
);

const TariffPage = () => (
  <div className="flex flex-col">
    <div className="card-glass p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Tariff Intelligence<span className="text-lg">™</span>
        </h1>
      </div>
      <TariffCalculator />
    </div>
  </div>
);

const QuotePage = () => (
  <div className="flex flex-col">
    <div className="card-glass p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Quote Intelligence<span className="text-lg">™</span>
        </h1>
      </div>
      <QuoteGenerator />
    </div>
  </div>
);

const AdminPage = () => (
  <div className="flex flex-col">
    <div className="card-glass p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Admin Intelligence<span className="text-lg">™</span>
        </h1>
      </div>
      <AdminPageClient />
    </div>
  </div>
);

const BenchmarkPage = () => (
  <div className="flex flex-col">
    <div className="card-glass p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Market Intelligence<span className="text-lg">™</span>
        </h1>
      </div>
      <MarketBenchmark />
    </div>
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
