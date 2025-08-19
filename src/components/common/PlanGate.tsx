import React from 'react';
export default function PlanGate({ allowed, children, message }: { allowed: boolean; children: React.ReactNode; message?: string; }) {
  if (allowed) return <>{children}</>;
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
      <div className="font-semibold mb-1">🔒 Contact Details Protected</div>
      <div>{message || 'Upgrade to Pro to unlock premium contact intelligence and outreach automations.'}</div>
    </div>
  );
}