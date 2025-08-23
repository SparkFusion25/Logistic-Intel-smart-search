import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addToWatchlist, removeFromWatchlist, getMyWatchlist } from '../lib/watchlist';
import { useToast } from '@/hooks/use-toast';

type SimilarCompany = {
  company_id: string;
  company_name: string;
  score: number;
  country?: string;
  hs6_code?: string;
};

interface SimilarCompaniesToggleProps {
  items: SimilarCompany[];
  className?: string;
}

export function SimilarCompaniesToggle({ items, className = '' }: SimilarCompaniesToggleProps) {
  const [pending, setPending] = useState<string | null>(null);
  const [watchedCompanies, setWatchedCompanies] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load current watchlist on mount
  useEffect(() => {
    async function loadWatchlist() {
      try {
        const watchlist = await getMyWatchlist();
        const watchedIds = new Set(watchlist.map((item: any) => item.company_id));
        setWatchedCompanies(watchedIds);
      } catch (error) {
        console.error('Failed to load watchlist:', error);
      } finally {
        setLoading(false);
      }
    }
    loadWatchlist();
  }, []);

  async function toggleWatch(company: SimilarCompany) {
    const isWatched = watchedCompanies.has(company.company_id);
    
    try {
      setPending(company.company_id);
      
      if (isWatched) {
        // Remove from watchlist
        await removeFromWatchlist(company.company_id);
        setWatchedCompanies(prev => {
          const newSet = new Set(prev);
          newSet.delete(company.company_id);
          return newSet;
        });
        toast({
          title: "Removed from Watchlist",
          description: `${company.company_name} is no longer being watched`,
        });
      } else {
        // Add to watchlist
        await addToWatchlist(company.company_id);
        setWatchedCompanies(prev => new Set(prev).add(company.company_id));
        toast({
          title: "Added to Watchlist",
          description: `${company.company_name} is now being watched`,
        });
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message ?? 'Failed to update watchlist',
        variant: "destructive"
      });
    } finally {
      setPending(null);
    }
  }

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((company) => (
          <div key={company.company_id} className="flex items-center justify-between rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="min-w-0 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2 ml-4">
              <div className="h-8 w-12 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((company) => {
        const isWatched = watchedCompanies.has(company.company_id);
        const isPending = pending === company.company_id;
        
        return (
          <div key={company.company_id} className="flex items-center justify-between rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate text-gray-900">{company.company_name}</div>
              <div className="flex items-center gap-3 mt-1">
                <div className="text-xs text-gray-500">
                  Similarity: {Math.round(company.score * 100)}%
                </div>
                {company.country && (
                  <div className="text-xs text-gray-500">
                    {company.country}
                  </div>
                )}
                {company.hs6_code && (
                  <div className="text-xs text-gray-500">
                    HS {company.hs6_code}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <Link 
                to={`/company/${company.company_id}`}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Open
              </Link>
              <button
                onClick={() => toggleWatch(company)}
                disabled={isPending}
                className={`text-sm rounded-md px-3 py-1 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isWatched
                    ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-50'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                title={isWatched ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                {isPending ? (
                  'Loading…'
                ) : isWatched ? (
                  '✓ Watching'
                ) : (
                  'Watch'
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}