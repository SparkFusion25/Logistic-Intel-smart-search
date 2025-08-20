"use client";
import * as React from 'react';
import ClientOnly from '@/components/common/ClientOnly';
import { safeStorage } from '@/lib/safeStorage';

// NOTE: This page used to access localStorage during SSR which crashes Vercel builds.
// We mark it as a client component and only read/write storage inside useEffect.
export default function AffiliatePortal() {
  const [token, setToken] = React.useState<string | null>(null);
  React.useEffect(() => {
    setToken(safeStorage.getItem('affiliate_token'));
  }, []);

  const handleLogin = (t: string) => {
    safeStorage.setItem('affiliate_token', t);
    setToken(t);
  };

  const handleLogout = () => {
    safeStorage.removeItem('affiliate_token');
    setToken(null);
  };

  return (
    <ClientOnly>
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Affiliate Portal</h1>
        {token ? (
          <div className="space-y-3">
            <div className="text-sm">Logged in with token: <span className="font-mono break-all">{token}</span></div>
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10">Logout</button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm opacity-80">Enter your affiliate token to continue.</p>
            <form onSubmit={(e)=>{ e.preventDefault(); const data=new FormData(e.currentTarget as HTMLFormElement); const t=String(data.get('token')||'').trim(); if(t) handleLogin(t); }}>
              <input name="token" placeholder="Token" className="px-3 py-2 rounded-md bg-black/40 border border-white/10 w-full max-w-md" />
              <div className="h-3"></div>
              <button type="submit" className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500">Login</button>
            </form>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}