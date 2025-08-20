'use client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CRMSimple() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">CRM</h1>
        
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact Management</h2>
          <div className="space-y-4">
            <button className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">
              + Add New Contact
            </button>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold">
              📧 Send Email Campaign
            </button>
            <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold">
              🔍 Enrich with Apollo
            </button>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Recent Contacts</h3>
          <div className="space-y-3">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h4 className="font-medium">John Smith</h4>
              <p className="text-white/70">Apple Inc. • john@apple.com • Last contacted: 2 days ago</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h4 className="font-medium">Sarah Johnson</h4>
              <p className="text-white/70">Samsung • sarah@samsung.com • Last contacted: 1 week ago</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-blue-400 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}