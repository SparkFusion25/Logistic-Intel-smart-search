import dynamic from 'next/dynamic';
import Head from 'next/head';

// IMPORTANT: React Router host is client-only to avoid SSR errors
const RouterHost = dynamic(() => import('@/react-router/RouterHost'), { ssr: false });

export default function AppIndex() {
  return (
    <>
      <Head><title>Logistic Intel – App</title></Head>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <RouterHost />
      </div>
    </>
  );
}