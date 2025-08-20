import dynamic from 'next/dynamic';
import Head from 'next/head';

// Ensure this page never SSRs code that touches window/localStorage
const AffiliateApp = dynamic(() => import('@/react-router/RouterHost'), { ssr: false });

export default function AffiliatePortal() {
  return (
    <>
      <Head><title>Affiliate Portal</title></Head>
      <AffiliateApp />
    </>
  );
}