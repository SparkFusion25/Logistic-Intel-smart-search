// src/pages/search.tsx
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import SearchPanel from '@/components/search/SearchPanel';

export default function SearchPage() {
  return (
    <AppShell>
      <header className="mb-4 md:mb-6 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Search Intelligence</h1>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/20">Live Data</span>
      </header>
      <SearchPanel />
    </AppShell>
  );
}