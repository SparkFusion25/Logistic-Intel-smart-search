'use client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminSimple() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">📊 System Stats</h2>
            <div className="space-y-2">
              <p>Total Users: <span className="text-blue-400">1,234</span></p>
              <p>Active Sessions: <span className="text-green-400">89</span></p>
              <p>API Calls Today: <span className="text-purple-400">5,678</span></p>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">📁 Data Management</h2>
            <div className="space-y-2">
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">
                Bulk Import CSV
              </button>
              <button className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg">
                Export Data
              </button>
              <button className="w-full py-2 bg-red-600 hover:bg-red-500 rounded-lg">
                Clear Cache
              </button>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">🔧 API Status</h2>
            <div className="space-y-2">
              <p>Supabase: <span className="text-green-400">✅ Connected</span></p>
              <p>OpenAI: <span className="text-green-400">✅ Connected</span></p>
              <p>Apollo: <span className="text-green-400">✅ Connected</span></p>
              <p>PhantomBuster: <span className="text-green-400">✅ Connected</span></p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">📋 Recent Activity</h3>
          <div className="space-y-3">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p><span className="text-blue-400">User123</span> performed search for "electronics"</p>
              <p className="text-white/60 text-sm">2 minutes ago</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p><span className="text-green-400">Admin</span> imported 500 new contacts</p>
              <p className="text-white/60 text-sm">15 minutes ago</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p><span className="text-purple-400">System</span> generated quarterly report</p>
              <p className="text-white/60 text-sm">1 hour ago</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/dashboard-simple" className="text-blue-400 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}