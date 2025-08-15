export function HeroContactChip({ name, title, company }: { name: string; title: string; company: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur ring-1 ring-white/15 shadow-md">
      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-400 to-sky-400" />
      <div className="min-w-0">
        <div className="truncate text-[13px] font-medium text-white">{name}</div>
        <div className="truncate text-[11px] text-white/70">{title} • {company}</div>
      </div>
    </div>
  );
}