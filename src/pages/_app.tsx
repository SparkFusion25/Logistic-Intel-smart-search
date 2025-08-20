import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import '@/styles/globals.css';

const ClientShell = dynamic(() => import('@/rr/ClientShell'), { ssr: false });

export default function MyApp(props: AppProps) {
  return <ClientShell {...props} />;
}