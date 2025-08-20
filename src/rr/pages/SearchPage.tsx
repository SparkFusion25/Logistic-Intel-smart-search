// src/pages/Search.tsx
import React from "react";
import SearchPanel from "@/components/search/SearchPanel";

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      {/* Optional: top header area you can style or remove */}
      <header className="sticky top-0 z-20 bg-ink-900/70 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <h1 className="text-lg md:text-xl font-semibold">
            Search <span className="text-brand-300">Intelligence</span>
          </h1>
          <p className="text-ink-300 text-sm">
            Companies • Shipments • Lanes • HS • B/L • Vessel
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-2 sm:px-4 py-4">
        <SearchPanel />
      </main>
    </div>
  );
}
