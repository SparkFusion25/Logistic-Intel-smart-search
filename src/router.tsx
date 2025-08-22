import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layout components
import AppShell from './components/layout/AppShell';
import PublicLayout from './components/layout/PublicLayout';

// Routing components
import NotFound from './components/routing/NotFound';
import ErrorBoundary from './components/routing/ErrorBoundary';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/public/Landing'));
const Pricing = lazy(() => import('./pages/public/Pricing'));
const Contact = lazy(() => import('./pages/public/Contact'));
const RequestDemo = lazy(() => import('./pages/public/RequestDemo'));
const Privacy = lazy(() => import('./pages/public/legal/Privacy'));
const Terms = lazy(() => import('./pages/public/legal/Terms'));
const Security = lazy(() => import('./pages/public/legal/Security'));

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const AuthCallback = lazy(() => import('./pages/auth/AuthCallback'));

const Dashboard = lazy(() => import('./pages/app/Dashboard'));
const Search = lazy(() => import('./pages/app/Search'));
const CRM = lazy(() => import('./pages/app/CRM'));
const Email = lazy(() => import('./pages/app/Email'));
const Campaigns = lazy(() => import('./pages/app/Campaigns'));
const CampaignsAnalytics = lazy(() => import('./pages/app/CampaignsAnalytics'));
const FollowUps = lazy(() => import('./pages/app/FollowUps'));
const Quote = lazy(() => import('./pages/app/widgets/Quote'));
const Tariff = lazy(() => import('./pages/app/widgets/Tariff'));
const Benchmark = lazy(() => import('./pages/app/widgets/Benchmark'));
const Admin = lazy(() => import('./pages/app/Admin'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

// Wrapper for lazy components
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <LazyWrapper><Landing /></LazyWrapper>
      },
      {
        path: 'pricing',
        element: <LazyWrapper><Pricing /></LazyWrapper>
      },
      {
        path: 'contact',
        element: <LazyWrapper><Contact /></LazyWrapper>
      },
      {
        path: 'demo/request',
        element: <LazyWrapper><RequestDemo /></LazyWrapper>
      },
      {
        path: 'legal/privacy',
        element: <LazyWrapper><Privacy /></LazyWrapper>
      },
      {
        path: 'legal/terms',
        element: <LazyWrapper><Terms /></LazyWrapper>
      },
      {
        path: 'legal/security',
        element: <LazyWrapper><Security /></LazyWrapper>
      }
    ]
  },
  {
    path: '/auth',
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'login',
        element: <LazyWrapper><Login /></LazyWrapper>
      },
      {
        path: 'register',
        element: <LazyWrapper><Register /></LazyWrapper>
      },
      {
        path: 'callback',
        element: <LazyWrapper><AuthCallback /></LazyWrapper>
      }
    ]
  },
  {
    path: '/dashboard',
    element: <AppShell />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <LazyWrapper><Dashboard /></LazyWrapper>
      },
      {
        path: 'search',
        element: <LazyWrapper><Search /></LazyWrapper>
      },
      {
        path: 'crm',
        element: <LazyWrapper><CRM /></LazyWrapper>
      },
      {
        path: 'email',
        element: <LazyWrapper><Email /></LazyWrapper>
      },
      {
        path: 'campaigns',
        element: <LazyWrapper><Campaigns /></LazyWrapper>
      },
      {
        path: 'campaigns/analytics',
        element: <LazyWrapper><CampaignsAnalytics /></LazyWrapper>
      },
      {
        path: 'campaigns/follow-ups',
        element: <LazyWrapper><FollowUps /></LazyWrapper>
      },
      {
        path: 'widgets/quote',
        element: <LazyWrapper><Quote /></LazyWrapper>
      },
      {
        path: 'widgets/tariff',
        element: <LazyWrapper><Tariff /></LazyWrapper>
      },
      {
        path: 'widgets/benchmark',
        element: <LazyWrapper><Benchmark /></LazyWrapper>
      },
      {
        path: 'admin',
        element: <LazyWrapper><Admin /></LazyWrapper>
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);