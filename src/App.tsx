import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Import updated Index component
import Index from "@/components/pages/Index";

// Auth pages
import AuthPage from "@/pages/AuthPage";

// App Shell for dashboard
import { AppShell } from "@/components/ui/AppShell";

// Dashboard pages
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

// Simple placeholder components for missing pages
const ComingSoonPage = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">This page is coming soon.</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

// Dashboard Page Wrappers with proper styling
const DashboardPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <DashboardOverview />
  </div>
);

const SearchPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <div className="bg-white border-b border-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Search Intelligence<span className="text-lg text-blue-600">™</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Discover global trade patterns and business opportunities
        </p>
      </div>
    </div>
    <div className="flex-1 p-6 bg-gray-50">
      <SearchPanel />
    </div>
  </div>
);

// Updated Company page (formerly CRM)
const CompanyPageWrapper = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <div className="bg-white border-b border-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Company Intelligence<span className="text-lg text-blue-600">™</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Manage and track your saved companies
        </p>
      </div>
    </div>
    <div className="flex-1 p-6 bg-gray-50">
      <CRMPanel />
    </div>
  </div>
);

const EmailPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <div className="bg-white border-b border-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Email Intelligence<span className="text-lg text-blue-600">™</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Create and manage email campaigns
        </p>
      </div>
    </div>
    <div className="flex-1 p-6 bg-gray-50">
      <EmailComposer />
    </div>
  </div>
);

const CampaignsPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <div className="bg-white border-b border-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Campaign Intelligence<span className="text-lg text-blue-600">™</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Build and track outreach campaigns
        </p>
      </div>
    </div>
    <div className="flex-1 p-6 bg-gray-50">
      <CampaignBuilder onSave={(campaign) => console.log('Campaign saved:', campaign)} />
    </div>
  </div>
);

const CampaignAnalyticsPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <div className="bg-white border-b border-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics Intelligence<span className="text-lg text-blue-600">™</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Track campaign performance and metrics
        </p>
      </div>
    </div>
    <div className="flex-1 p-6 bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <p className="text-gray-600">Campaign analytics and performance metrics coming soon.</p>
      </div>
    </div>
  </div>
);

const TariffPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <div className="bg-white border-b border-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Tariff Intelligence<span className="text-lg text-blue-600">™</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Calculate duties and tariffs for international trade
        </p>
      </div>
    </div>
    <div className="flex-1 p-6 bg-gray-50">
      <TariffCalculator />
    </div>
  </div>
);

const QuotePage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <div className="bg-white border-b border-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Quote Intelligence<span className="text-lg text-blue-600">™</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Generate professional quotes and proposals
        </p>
      </div>
    </div>
    <div className="flex-1 p-6 bg-gray-50">
      <QuoteGenerator />
    </div>
  </div>
);

const AdminPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <div className="bg-white border-b border-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Intelligence<span className="text-lg text-blue-600">™</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Manage system settings and content
        </p>
      </div>
    </div>
    <div className="flex-1 p-6 bg-gray-50">
      <AdminPageClient />
    </div>
  </div>
);

const BenchmarkPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <div className="bg-white border-b border-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Market Intelligence<span className="text-lg text-blue-600">™</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Benchmark performance and analyze market trends
        </p>
      </div>
    </div>
    <div className="flex-1 p-6 bg-gray-50">
      <MarketBenchmark />
    </div>
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public marketing routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<ComingSoonPage title="About Us" />} />
                <Route path="/pricing" element={<ComingSoonPage title="Pricing" />} />
                <Route path="/blog" element={<ComingSoonPage title="Blog" />} />
                <Route path="/blog/:slug" element={<ComingSoonPage title="Blog Article" />} />
                <Route path="/demo/request" element={<ComingSoonPage title="Request Demo" />} />
                <Route path="/help" element={<ComingSoonPage title="Help Center" />} />
                
                {/* Auth routes */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/login" element={<AuthPage />} />
                <Route path="/auth/signup" element={<AuthPage />} />
                
                {/* Protected dashboard routes */}
                <Route path="/dashboard" element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>} />
                <Route path="/dashboard/search" element={<ProtectedRoute><AppShell><SearchPage /></AppShell></ProtectedRoute>} />
                <Route path="/dashboard/companies" element={<ProtectedRoute><AppShell><CompanyPageWrapper /></AppShell></ProtectedRoute>} />
                <Route path="/dashboard/crm" element={<ProtectedRoute><AppShell><CompanyPageWrapper /></AppShell></ProtectedRoute>} />
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
  </HelmetProvider>
);

export default App;
