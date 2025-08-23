import { useState } from 'react';
import { watchCompany } from '@/features/watchlist/api';

interface SimpleWatchButtonProps {
  company: { id: string; name: string };
  className?: string;
}

export default function SimpleWatchButton({ company, className = '' }: SimpleWatchButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onWatch = async () => {
    setErr(null);
    setSaving(true);
    try {
      await watchCompany(company.id);
      setSaved(true);
    } catch (e: any) {
      setErr(e.message ?? 'Failed to watch');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`similar-row ${className}`}>
      <span className="name font-medium">{company.name}</span>
      <button 
        disabled={saving || saved} 
        onClick={onWatch}
        className="px-3 py-1 text-sm rounded border disabled:opacity-50"
      >
        {saved ? 'Watching' : saving ? 'Adding…' : 'Watch'}
      </button>
      {err && <span className="error text-red-500 text-sm">{err}</span>}
    </div>
  );
}