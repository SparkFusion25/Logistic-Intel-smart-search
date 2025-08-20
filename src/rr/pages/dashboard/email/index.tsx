import * as React from 'react';
import Shell from '@/components/layout/DashboardShell';

export default function EmailPage(){
  return (
    <Shell title="Email">
      <div className="li-card p-4 max-w-3xl">
        <div className="mb-3 text-sm text-slate-300">Compose</div>
        <form className="space-y-3">
          <input className="w-full bg-white/5 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400/60" placeholder="Subject" />
          <textarea rows={10} className="w-full bg-white/5 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400/60" placeholder="Write your message..." />
          <div className="flex gap-2">
            <button type="button" className="btn btn-primary">Send</button>
            <button type="button" className="btn btn-ghost">Save Draft</button>
          </div>
        </form>
      </div>
    </Shell>
  );
}