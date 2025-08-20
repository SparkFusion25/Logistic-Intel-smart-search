'use client';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Search, Users, Mail, FileText, Calculator, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Home: NextPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Logistic Intel
          </h1>
          <p className="text-2xl mb-4 text-slate-300">
            Smart Search & CRM for Global Trade Intelligence
          </p>
          <p className="text-lg mb-12 text-slate-400 max-w-2xl mx-auto">
            Discover trade opportunities, enrich contacts, and grow your business with AI-powered logistics intelligence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <Search className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
              <p className="text-slate-400 mb-4">
                Search air and ocean shipments with AI-powered filters and confidence scoring.
              </p>
              <Link href="/api/search/unified?q=apple&limit=5" className="text-blue-400 hover:text-blue-300">
                Try Search API →
              </Link>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <Users className="w-12 h-12 text-green-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">CRM Integration</h3>
              <p className="text-slate-400 mb-4">
                Enrich contacts with Apollo and PhantomBuster. Build campaigns and track engagement.
              </p>
              <Link href="/api/crm/contacts" className="text-green-400 hover:text-green-300">
                View CRM API →
              </Link>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <Calculator className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">Widgets & Tools</h3>
              <p className="text-slate-400 mb-4">
                Generate quotes, calculate tariffs, and export professional PDFs.
              </p>
              <Link href="/api/widgets/quote" className="text-purple-400 hover:text-purple-300">
                Try Quote API →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Mail className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="text-lg font-semibold mb-2">Email Tracking</h4>
              <p className="text-slate-400 text-sm">Gmail OAuth integration with pixel tracking and campaign automation</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
              <h4 className="text-lg font-semibold mb-2">Plan Gating</h4>
              <p className="text-slate-400 text-sm">Free/Pro/Enterprise access control with usage limits</p>
            </div>
          </div>
          
          <div className="space-x-4">
            <Link 
              href="/api/health" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors"
            >
              API Health Check
            </Link>
            <Link 
              href="/AffiliatePortal" 
              className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors border border-white/20"
            >
              Affiliate Portal
            </Link>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-6">Available API Endpoints</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-3">
                <code className="text-blue-400">GET /api/search/unified</code>
                <p className="text-slate-400 mt-1">Search shipments</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <code className="text-green-400">POST /api/crm/contacts</code>
                <p className="text-slate-400 mt-1">Manage contacts</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <code className="text-purple-400">POST /api/widgets/quote</code>
                <p className="text-slate-400 mt-1">Generate quotes</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <code className="text-orange-400">POST /api/email/send</code>
                <p className="text-slate-400 mt-1">Send tracked emails</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <code className="text-red-400">POST /api/enrichment/apollo</code>
                <p className="text-slate-400 mt-1">Enrich contacts</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <code className="text-cyan-400">GET /api/health</code>
                <p className="text-slate-400 mt-1">System status</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;