'use client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DashboardSimple() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Simple Sidebar */}
      <div className="flex">
        <div className="w-64 bg-slate-900 border-r border-white/10 min-h-screen p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white">Logistic Intel</h1>
          </div>
          
          <nav className="space-y-2">
            <Link href="/dashboard-simple" className="block p-3 bg-blue-600 rounded-lg font-medium">
              📊 Dashboard
            </Link>
            <Link href="/search-simple" className="block p-3 hover:bg-white/10 rounded-lg">
              🔍 Search
            </Link>
            <Link href="/crm-simple" className="block p-3 hover:bg-white/10 rounded-lg">
              👥 CRM
            </Link>
            <Link href="/widgets-simple" className="block p-3 hover:bg-white/10 rounded-lg">
              🛠️ Widgets
            </Link>
            <Link href="/admin" className="block p-3 hover:bg-white/10 rounded-lg">
              ⚙️ Admin
            </Link>
            <Link href="/test" className="block p-3 hover:bg-white/10 rounded-lg">
              🧪 Test
            </Link>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-8">Dashboard Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Total Searches</h3>
              <p className="text-3xl font-bold text-blue-400">1,234</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">CRM Contacts</h3>
              <p className="text-3xl font-bold text-green-400">567</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Quotes Generated</h3>
              <p className="text-3xl font-bold text-purple-400">89</p>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/search-simple" className="p-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-center font-medium">
                🔍 New Search
              </Link>
              <Link href="/crm-simple" className="p-4 bg-green-600 hover:bg-green-500 rounded-lg text-center font-medium">
                👥 Add Contact
              </Link>
              <Link href="/widgets-simple" className="p-4 bg-purple-600 hover:bg-purple-500 rounded-lg text-center font-medium">
                📄 Generate Quote
              </Link>
              <Link href="/admin" className="p-4 bg-orange-600 hover:bg-orange-500 rounded-lg text-center font-medium">
                ⚙️ Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}