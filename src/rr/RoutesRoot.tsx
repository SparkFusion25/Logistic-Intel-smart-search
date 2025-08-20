import { Routes, Route } from 'react-router-dom';
// import the existing pages that currently live under src/pages/*
// Move the React‑Router pages into src/rr/pages/* to avoid Next.js picking them up for SSR.
import DashboardPage from '@/rr/pages/DashboardPage';
import LoginPage from '@/rr/pages/LoginPage';
import SearchPage from '@/rr/pages/SearchPage';
import CRMPage from '@/rr/pages/CRMPage';
import NotFound from '@/rr/pages/NotFound';
// ...import the rest as needed

export default function RoutesRoot() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard/search" element={<SearchPage />} />
      <Route path="/dashboard/crm" element={<CRMPage />} />
      {/* add the remaining app routes here */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}