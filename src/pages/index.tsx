'use client';
import type { NextPage } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Home: NextPage = () => {
  return (
    <main className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Logistic Intel
          </h1>
          <p className="text-xl mb-8 text-slate-300">
            Smart Search & CRM for Global Trade Intelligence
          </p>
          <div className="space-x-4">
            <a 
              href="/AffiliatePortal" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;