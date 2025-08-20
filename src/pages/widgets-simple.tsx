'use client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function WidgetsSimple() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Widgets & Tools</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">📄 Quote Generator</h2>
            <p className="text-white/70 mb-4">Generate professional PDF quotes with your branding</p>
            <div className="space-y-3">
              <input placeholder="Company Name" className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60" />
              <input placeholder="Product Description" className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60" />
              <input placeholder="Price" className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60" />
              <button className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">
                Generate PDF Quote
              </button>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">🧮 Tariff Calculator</h2>
            <p className="text-white/70 mb-4">Calculate import duties and taxes</p>
            <div className="space-y-3">
              <input placeholder="HS Code (e.g. 8517.12.00)" className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60" />
              <input placeholder="Value (USD)" className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60" />
              <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white">
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CN">China</option>
                <option value="DE">Germany</option>
              </select>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold">
                Calculate Tariff
              </button>
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