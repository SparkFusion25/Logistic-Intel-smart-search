
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Home from "@/routes/Home";
import About from "@/routes/About";
import Pricing from "@/routes/Pricing";
import BlogIndex from "@/routes/BlogIndex";
import Login from "@/routes/auth/Login";
import Signup from "@/routes/auth/Signup";
import OAuthCallback from "@/routes/auth/OAuthCallback";
import Logout from "@/routes/auth/Logout";
import Dashboard from "@/routes/Dashboard";
import RequestDemo from "@/routes/RequestDemo";
import { supabase } from '@/lib/supabase-client';

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
          <Route path="/demo/request" element={
            <>
              <NavBar />
              <RequestDemo />
              <Footer />
            </>
          } />
          
          {/* Auth routes without NavBar/Footer */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Protected dashboard route */}
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
