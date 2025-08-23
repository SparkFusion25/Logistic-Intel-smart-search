
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Home from "@/routes/Home";
import About from "@/routes/About";
import Pricing from "@/routes/Pricing";
import BlogIndex from "@/routes/BlogIndex";
import BlogArticle from "@/routes/BlogArticle";
import Login from "@/routes/auth/Login";
import Signup from "@/routes/auth/Signup";
import OAuthCallback from "@/routes/auth/OAuthCallback";
import Logout from "@/routes/auth/Logout";
import RequestDemo from "@/routes/RequestDemo";
import Help from "@/routes/Help";
import { supabase } from '@/lib/supabase-client';
import { AppShell } from '@/components/ui/AppShell';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { Toaster } from '@/components/ui/toaster';

// Dashboard pages
import Search from '@/routes/dashboard/Search';
import CRM from '@/routes/dashboard/CRM';
import Email from '@/routes/dashboard/Email';
import Campaigns from '@/routes/dashboard/Campaigns';
import CampaignAnalytics from '@/routes/dashboard/CampaignAnalytics';
import Quote from '@/routes/dashboard/Quote';
import Tariff from '@/routes/dashboard/Tariff';
import Benchmark from '@/routes/dashboard/Benchmark';
import Admin from '@/routes/dashboard/Admin';
import Settings from '@/routes/dashboard/Settings';
import CompanyPage from '@/pages/company/[id]';
import ImporterPage from '@/pages/Importer';

// Auth guard component
function RequireAuth({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      
      if (!data.session) {
        nav('/auth/login');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session && event === 'SIGNED_OUT') {
        nav('/auth/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [nav]);

  if (loading) {
    return (
      <div className='min-h-screen grid place-items-center bg-slate-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F4C81] mx-auto mb-4'></div>
          <div className='text-slate-600'>Loading…</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Public marketing routes with NavBar and Footer */}
          <Route path="/" element={
            <>
              <NavBar />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/about" element={
            <>
              <NavBar />
              <About />
              <Footer />
            </>
          } />
          <Route path="/pricing" element={
            <>
              <NavBar />
              <Pricing />
              <Footer />
            </>
          } />
          <Route path="/blog" element={
            <>
              <NavBar />
              <BlogIndex />
              <Footer />
            </>
          } />
          <Route path="/blog/:slug" element={
            <>
              <NavBar />
              <BlogArticle />
              <Footer />
            </>
          } />
          <Route path="/demo/request" element={
            <>
              <NavBar />
              <RequestDemo />
              <Footer />
            </>
          } />
          <Route path="/help" element={
            <>
              <NavBar />
              <Help />
              <Footer />
            </>
          } />
          
          {/* Auth routes without NavBar/Footer */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Protected dashboard routes with full app shell */}
          <Route path="/dashboard" element={
            <RequireAuth>
              <AppShell>
                <DashboardOverview />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/dashboard/search" element={
            <RequireAuth>
              <AppShell>
                <Search />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/dashboard/crm" element={
            <RequireAuth>
              <AppShell>
                <CRM />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/dashboard/email" element={
            <RequireAuth>
              <AppShell>
                <Email />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/dashboard/campaigns" element={
            <RequireAuth>
              <AppShell>
                <Campaigns />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/dashboard/campaigns/analytics" element={
            <RequireAuth>
              <AppShell>
                <CampaignAnalytics />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/dashboard/widgets/quote" element={
            <RequireAuth>
              <AppShell>
                <Quote />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/dashboard/widgets/tariff" element={
            <RequireAuth>
              <AppShell>
                <Tariff />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/dashboard/benchmark" element={
            <RequireAuth>
              <AppShell>
                <Benchmark />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/dashboard/admin" element={
            <RequireAuth>
              <AppShell>
                <Admin />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/dashboard/settings" element={
            <RequireAuth>
              <AppShell>
                <Settings />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/company/:id" element={
            <RequireAuth>
              <AppShell>
                <CompanyPage />
              </AppShell>
            </RequireAuth>
          } />
          <Route path="/importer" element={
            <RequireAuth>
              <AppShell>
                <ImporterPage />
              </AppShell>
            </RequireAuth>
          } />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </HelmetProvider>
  );
}
