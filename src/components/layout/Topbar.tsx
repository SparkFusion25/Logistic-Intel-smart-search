export default function Topbar() {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-2 flex items-center justify-between">
        <div className="text-slate-200 text-sm font-medium">Dashboard</div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-slate-400">Plan:</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-700/40 px-2 py-1 text-[11px]">PRO</span>
        </div>
      </div>
    </div>
  );
}