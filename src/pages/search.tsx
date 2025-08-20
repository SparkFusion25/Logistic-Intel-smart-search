'use client';
import { useState } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import SearchPanel from "@/components/search/SearchPanel";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SearchPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-slate-950 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Smart Search</h1>
            <SearchPanel />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}