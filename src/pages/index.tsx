"use client";
import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import ClientOnly from '@/components/common/ClientOnly';

export default function HomePage() {
  return (
    <ClientOnly>
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Logistic Intel
              </h1>
              <p className="text-xl mb-8 text-slate-300">
                Smart Search & CRM for Global Trade Intelligence
              </p>
              <p className="text-lg mb-12 text-slate-400 max-w-2xl mx-auto">
                Discover trade opportunities, enrich contacts, and grow your business with AI-powered logistics intelligence.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">🔍 Smart Search</h3>
                  <p className="text-slate-400">
                    Search air and ocean shipments with AI-powered filters and confidence scoring.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">👥 CRM Integration</h3>
                  <p className="text-slate-400">
                    Enrich contacts with Apollo and PhantomBuster. Build campaigns and track engagement.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">📊 Widgets & Tools</h3>
                  <p className="text-slate-400">
                    Generate quotes, calculate tariffs, and export professional PDFs.
                  </p>
                </div>
              </div>
              
              <div className="space-x-4">
                <a 
                  href="/dashboard" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors"
                >
                  Get Started
                </a>
                <a 
                  href="/widgets" 
                  className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors border border-white/20"
                >
                  Try Widgets
                </a>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ClientOnly>
  );
}