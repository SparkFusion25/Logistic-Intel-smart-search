import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
}

export function KpiCard({ label, value, icon: Icon, iconColor = "text-accent" }: KpiCardProps) {
  return (
    <div className="card-surface rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-slate-600 font-medium">{label}</div>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="text-2xl font-bold text-slate-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
}