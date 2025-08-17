import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/BlogPage";
import SolutionsPage from "./pages/SolutionsPage";
import WhoWeServePage from "./pages/WhoWeServePage";
import ResourcesPage from "./pages/ResourcesPage";
import CompanyPage from "./pages/CompanyPage";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Dashboard Pages
import SearchIntelligencePage from "./pages/dashboard/SearchIntelligencePage";
import CRMPage from "./pages/dashboard/CRMPage";
import DealsPage from "./pages/dashboard/DealsPage";
import EmailPage from "./pages/dashboard/EmailPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import CampaignsPage from "./pages/dashboard/CampaignsPage"
import CampaignBuilderPage from "./pages/dashboard/CampaignBuilderPage"
import CampaignTemplatesPage from "./pages/dashboard/CampaignTemplatesPage"
import CampaignAnalyticsPage from "./pages/dashboard/CampaignAnalyticsPage";
import FollowUpsPage from "./pages/dashboard/FollowUpsPage";
import WidgetsPage from "./pages/dashboard/WidgetsPage";
import QuoteGeneratorPage from "./pages/dashboard/QuoteGeneratorPage";
import TariffCalculatorPage from "./pages/dashboard/TariffCalculatorPage";
import BenchmarkPage from "./pages/dashboard/BenchmarkPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import CompanyProfilePage from "./pages/dashboard/CompanyProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/who-we-serve" element={<WhoWeServePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/search" element={<ProtectedRoute><SearchIntelligencePage /></ProtectedRoute>} />
            <Route path="/dashboard/crm" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
            <Route path="/dashboard/deals" element={<ProtectedRoute><DealsPage /></ProtectedRoute>} />
            <Route path="/dashboard/email" element={<ProtectedRoute><EmailPage /></ProtectedRoute>} />
            <Route path="/dashboard/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/dashboard/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
            <Route path="/dashboard/campaigns/builder" element={<ProtectedRoute><CampaignBuilderPage /></ProtectedRoute>} />
            <Route path="/dashboard/campaigns/templates" element={<ProtectedRoute><CampaignTemplatesPage /></ProtectedRoute>} />
          <Route path="/dashboard/campaigns/analytics" element={<ProtectedRoute><CampaignAnalyticsPage /></ProtectedRoute>} />
            <Route path="/dashboard/campaigns/follow-ups" element={<ProtectedRoute><FollowUpsPage /></ProtectedRoute>} />
            <Route path="/dashboard/widgets" element={<ProtectedRoute><WidgetsPage /></ProtectedRoute>} />
            <Route path="/dashboard/widgets/quote" element={<ProtectedRoute><QuoteGeneratorPage /></ProtectedRoute>} />
            <Route path="/dashboard/widgets/tariff" element={<ProtectedRoute><TariffCalculatorPage /></ProtectedRoute>} />
            <Route path="/dashboard/widgets/benchmark" element={<ProtectedRoute><BenchmarkPage /></ProtectedRoute>} />
            <Route path="/dashboard/company/:companyId" element={<ProtectedRoute><CompanyProfilePage /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
