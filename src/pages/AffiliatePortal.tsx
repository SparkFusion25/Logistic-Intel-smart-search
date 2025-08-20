import type { NextPage } from 'next';
import Head from 'next/head';

const AffiliatePortal: NextPage & { isNextPage?: boolean } = () => {
  return (
    <>
      <Head><title>Affiliate Portal</title></Head>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Affiliate Portal</h1>
        <p>Affiliate portal functionality will be available in the main app.</p>
        <a href="/dashboard" className="text-blue-500 hover:underline">Go to Dashboard</a>
      </main>
    </>
  );
};
AffiliatePortal.isNextPage = true;
export default AffiliatePortal;