import { Helmet } from 'react-helmet-async';
import { useUser } from '@supabase/auth-helpers-react';

export default function Dashboard() {
  const user = useUser();

  return (
    <>
      <Helmet>
        <title>Dashboard - Logistic Intel</title>
      </Helmet>

      <div className="space-y-6">
        {/* Welcome header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-slate-600">
            Your logistics intelligence dashboard is ready.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Records Today', value: '1,247', change: '+12%' },
            { label: 'Companies Detected', value: '89', change: '+5%' },
            { label: 'Air Shippers', value: '34', change: '+8%' },
            { label: 'Active Campaigns', value: '3', change: 'stable' }
          ].map((kpi, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
              <div className="text-sm text-slate-600">{kpi.label}</div>
              <div className="text-xs text-green-600 mt-1">{kpi.change}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <div className="text-lg font-medium text-slate-900">New Search</div>
              <div className="text-sm text-slate-600">Find companies and shipments</div>
            </button>
            <button className="p-4 text-left rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <div className="text-lg font-medium text-slate-900">Add Contact</div>
              <div className="text-sm text-slate-600">Import to CRM</div>
            </button>
            <button className="p-4 text-left rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <div className="text-lg font-medium text-slate-900">New Campaign</div>
              <div className="text-sm text-slate-600">Start outreach sequence</div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}