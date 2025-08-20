'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TestPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Navigation Test Page</h1>
      
      <div className="mb-6">
        <p>Current route: <code className="bg-slate-800 px-2 py-1 rounded">{router.pathname}</code></p>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Test Links:</h2>
        <div className="grid gap-2">
          <Link href="/" className="text-blue-400 hover:underline">→ Home</Link>
          <Link href="/dashboard" className="text-blue-400 hover:underline">→ Dashboard</Link>
          <Link href="/search" className="text-blue-400 hover:underline">→ Search</Link>
          <Link href="/crm" className="text-blue-400 hover:underline">→ CRM</Link>
          <Link href="/widgets" className="text-blue-400 hover:underline">→ Widgets</Link>
          <Link href="/admin" className="text-blue-400 hover:underline">→ Admin</Link>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Manual Navigation Test:</h2>
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded mr-2"
        >
          Go to Dashboard (programmatic)
        </button>
        <button 
          onClick={() => router.back()}
          className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}