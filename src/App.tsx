import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/BlogPage";
import SolutionsPage from "./pages/SolutionsPage";
import WhoWeServePage from "./pages/WhoWeServePage";
import ResourcesPage from "./pages/ResourcesPage";
import CompanyPage from "./pages/CompanyPage";
import LoginPage from "./pages/LoginPage";

// Dashboard Pages
import SearchIntelligencePage from "./pages/dashboard/SearchIntelligencePage";
import CRMPage from "./pages/dashboard/CRMPage";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/search" element={<SearchIntelligencePage />} />
            <Route path="/dashboard/crm" element={<CRMPage />} />
            <Route path="/dashboard/email" element={<EmailPage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="/dashboard/campaigns" element={<CampaignsPage />} />
            <Route path="/dashboard/campaigns/builder" element={<CampaignBuilderPage />} />
            <Route path="/dashboard/campaigns/templates" element={<CampaignTemplatesPage />} />
          <Route path="/dashboard/campaigns/analytics" element={<CampaignAnalyticsPage />} />
            <Route path="/dashboard/campaigns/follow-ups" element={<FollowUpsPage />} />
            <Route path="/dashboard/widgets" element={<WidgetsPage />} />
            <Route path="/dashboard/widgets/quote" element={<QuoteGeneratorPage />} />
            <Route path="/dashboard/widgets/tariff" element={<TariffCalculatorPage />} />
            <Route path="/dashboard/widgets/benchmark" element={<BenchmarkPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
