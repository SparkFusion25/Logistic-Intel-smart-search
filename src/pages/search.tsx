// src/pages/search.tsx
import React from 'react';
import SearchPanel from '@/components/search/SearchPanel';

export default function SearchPage() {
  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8 bg-gradient-to-b from-[#0b1220] to-[#0b1220] text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 md:mb-6 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Search Intelligence</h1>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/20">Live Data</span>
        </header>
        <SearchPanel />
      </div>
    </main>
  );
}