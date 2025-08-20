'use client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SearchSimple() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Smart Search</h1>
        
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Shipments</h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Search companies, products, or HS codes..."
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60"
            />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">All</button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">Air ✈</button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">Ocean 🚢</button>
            </div>
            <button className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">
              Search Shipments
            </button>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Sample Results</h3>
          <div className="space-y-3">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h4 className="font-medium">Apple Inc.</h4>
              <p className="text-white/70">Electronics • Air Shipment • Confidence: 95%</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h4 className="font-medium">Samsung Electronics</h4>
              <p className="text-white/70">Electronics • Ocean Shipment • Confidence: 88%</p>
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