import * as React from 'react';
import Shell from '../../../components/layout/DashboardShell';

export default function TariffPage(){
  return (
    <Shell title="Tariff Calculator">
      <div className="li-card p-4 max-w-3xl">
        <div className="mb-3 text-sm text-slate-300">Quick Estimate</div>
        <form className="grid gap-3 sm:grid-cols-2">
          <input className="bg-white/5 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400/60" placeholder="HS Code" />
          <input className="bg-white/5 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400/60" placeholder="Country" />
          <button type="button" className="btn btn-primary sm:col-span-2">Calculate</button>
        </form>
      </div>
    </Shell>
  );
}