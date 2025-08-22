
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./components/pages/Index";
import AuthPage from "@/pages/AuthPage";
import Home from "@/routes/Home";
import About from "@/routes/About";
import Pricing from "@/routes/Pricing";
import BlogIndex from "@/routes/BlogIndex";
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
  <div className="flex flex-col min-h-screen">
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
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pt-0">
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
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Marketing Site Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<BlogIndex />} />
              
              {/* Legacy route for existing users */}
              <Route path="/app" element={<Index />} />
              
              {/* Authentication */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/search" element={<ProtectedRoute><AppShell><SearchPage /></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/crm" element={<ProtectedRoute><AppShell><CRMPage /></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/email" element={<ProtectedRoute><AppShell><EmailPage /></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/campaigns" element={<ProtectedRoute><AppShell><CampaignsPage /></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/campaigns/analytics" element={<ProtectedRoute><AppShell><CampaignAnalyticsPage /></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/widgets/tariff" element={<ProtectedRoute><AppShell><TariffPage /></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/widgets/quote" element={<ProtectedRoute><AppShell><QuotePage /></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/admin" element={<ProtectedRoute><AppShell><AdminPage /></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/benchmark" element={<ProtectedRoute><AppShell><BenchmarkPage /></AppShell></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
