import { supabase } from '@/lib/supabase-client';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const nav = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    nav('/auth/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#0B1E39]">Dashboard</h1>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-[#0F4C81] hover:text-[#0B1E39] border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Logout
            </button>
          </div>
          
          <p className="text-slate-600 mb-6">
            Welcome to your Logistic Intel dashboard! Authentication is working correctly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow">
              <h3 className="font-semibold text-[#0B1E39] mb-2">Search Intelligence</h3>
              <p className="text-sm text-slate-600">Find companies and analyze trade data</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow">
              <h3 className="font-semibold text-[#0B1E39] mb-2">CRM Integration</h3>
              <p className="text-sm text-slate-600">Manage contacts and relationships</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow">
              <h3 className="font-semibold text-[#0B1E39] mb-2">Campaign Tools</h3>
              <p className="text-sm text-slate-600">Launch outreach campaigns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}