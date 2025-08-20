'use client';
import type { NextPage } from 'next';
import Head from 'next/head';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const AffiliatePortal: NextPage = () => {
  return (
    <>
      <Head><title>Affiliate Portal</title></Head>
      <main className="p-6 min-h-screen bg-slate-950 text-white">
        <h1 className="text-2xl font-bold mb-4">Affiliate Portal</h1>
        <p className="mb-4">Affiliate portal functionality will be available in the main app.</p>
        <a href="/" className="text-blue-500 hover:underline">Go to Homepage</a>
      </main>
    </>
  );
};

export default AffiliatePortal;