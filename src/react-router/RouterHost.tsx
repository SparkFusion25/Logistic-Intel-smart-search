"use client";
import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Your existing React Router pages/components. If you already have src/App.tsx with routes,
// you can import and render it instead. This host keeps routing entirely client-side.
// Option A: mount your existing App component
// import App from '@/App';
// export default function RouterHost(){ return <App/> }

// Option B (fallback): basic shell mapping to your existing pages under src/pages as components
// If you already have these React components somewhere else, update the imports accordingly.
import Dashboard from '@/pages/DashboardPage';
import NotFound from '@/pages/NotFound';
import SearchPage from '@/pages/Search';
import CRM from '@/pages/crm';
import Campaigns from '@/pages/campaigns';
import Email from '@/pages/email';

export default function RouterHost(){
  // Guards against SSR env access – but this file is already client-only via dynamic
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<Navigate to="/app/dashboard" replace/>} />
        <Route path="/app/dashboard" element={<Dashboard/>} />
        <Route path="/app/search" element={<SearchPage/>} />
        <Route path="/app/crm" element={<CRM/>} />
        <Route path="/app/campaigns" element={<Campaigns/>} />
        <Route path="/app/email" element={<Email/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}