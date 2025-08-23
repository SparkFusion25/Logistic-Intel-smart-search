import { useState } from 'react';
import { Link } from 'react-router-dom';
import { watchCompany } from '../lib/watchlist';
import { useToast } from '@/hooks/use-toast';

type SimilarCompany = {
  company_id: string;
  company_name: string;
  score: number;
  country?: string;
  hs6_code?: string;
};

interface SimilarCompaniesEnhancedProps {
  items: SimilarCompany[];
  className?: string;
}

export function SimilarCompaniesEnhanced({ items, className = '' }: SimilarCompaniesEnhancedProps) {
  const [pending, setPending] = useState<string | null>(null);
  const { toast } = useToast();

  async function onWatch(company: SimilarCompany) {
    try {
      setPending(company.company_id);
      await watchCompany(company.company_id);
      toast({
        title: "Added to Watchlist",
        description: `${company.company_name} is now being watched`,
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message ?? 'Failed to add to watchlist',
        variant: "destructive"
      });
    } finally {
      setPending(null);
    }
  }

  return (
    <div className={`grid gap-3 ${className}`}>
      {items.map((c) => (
        <div key={c.company_id} className="flex items-center justify-between rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate text-gray-900">{c.company_name}</div>
            <div className="flex items-center gap-3 mt-1">
              <div className="text-xs text-gray-500">
                Similarity: {Math.round(c.score * 100)}%
              </div>
              {c.country && (
                <div className="text-xs text-gray-500">
                  {c.country}
                </div>
              )}
              {c.hs6_code && (
                <div className="text-xs text-gray-500">
                  HS {c.hs6_code}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            <Link 
              to={`/company/${c.company_id}`}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Open
            </Link>
            <button
              onClick={() => onWatch(c)}
              disabled={pending === c.company_id}
              className="text-sm rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Add to Watchlist"
            >
              {pending === c.company_id ? 'Adding…' : 'Watch'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}