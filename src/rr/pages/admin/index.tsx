import AppShell from '@/components/layout/AppShell';
export default function AdminPage(){
  return (
    <AppShell>
      <h1 className="text-xl font-semibold mb-3">Admin</h1>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">Plan & seats • Import jobs • Feature flags (coming soon)</div>
    </AppShell>
  );
}