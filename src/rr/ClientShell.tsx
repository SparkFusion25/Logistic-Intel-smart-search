'use client';
import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { BrowserRouter } from 'react-router-dom';
import RoutesRoot from '@/rr/RoutesRoot';

export default function ClientShell({ Component, pageProps }: AppProps) {
  // ensure client‑only render (guards SSR/localStorage/etc.)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // If a Next.js page (e.g., /api or any plain Next page) is rendered,
  // just render it. Otherwise, we show our React‑Router tree.
  const IsNextPage = (Component as any).isNextPage === true;
  return IsNextPage ? (
    <Component {...pageProps} />
  ) : (
    <BrowserRouter>
      <RoutesRoot />
    </BrowserRouter>
  );
}