import * as React from 'react';
import Shell from '@/components/layout/DashboardShell';

export default function QuoteWidgetPage(){
  return (
    <Shell title="Quote Generator">
      <div className="li-card p-4 max-w-4xl">
        <div className="mb-3 text-sm text-slate-300">Create Quote</div>
        <form className="grid gap-3 sm:grid-cols-2">
          <input className="bg-white/5 rounded-xl px-3 py-2" placeholder="Company" />
          <input className="bg-white/5 rounded-xl px-3 py-2" placeholder="Contact Email" />
          <input className="bg-white/5 rounded-xl px-3 py-2" placeholder="Origin" />
          <input className="bg-white/5 rounded-xl px-3 py-2" placeholder="Destination" />
          <input className="bg-white/5 rounded-xl px-3 py-2" placeholder="Mode (air/ocean)" />
          <input className="bg-white/5 rounded-xl px-3 py-2" placeholder="HS Code (optional)" />
          <textarea className="bg-white/5 rounded-xl px-3 py-2 sm:col-span-2" rows={6} placeholder="Line items / Notes" />
          <div className="sm:col-span-2 flex gap-2">
            <button type="button" className="btn btn-primary">Generate PDF</button>
            <button type="button" className="btn btn-ghost">Save Draft</button>
          </div>
        </form>
      </div>
    </Shell>
  );
}