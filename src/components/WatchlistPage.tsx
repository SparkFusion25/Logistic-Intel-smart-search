import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyWatchlist, removeFromWatchlist } from '../lib/watchlist';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ExternalLink, Eye, Building2 } from 'lucide-react';

interface WatchlistItem {
  id: string;
  company_id: string;
  company_name: string;
  created_at: string;
  // Additional fields that might be in the view
  country?: string;
  hs6_code?: string;
  trade_value?: number;
  last_seen?: string;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const { toast } = useToast();

  // Load watchlist on mount
  useEffect(() => {
    loadWatchlist();
  }, []);

  async function loadWatchlist() {
    try {
      setLoading(true);
      const data = await getMyWatchlist();
      setWatchlist(data || []);
    } catch (error) {
      console.error('Failed to load watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to load your watchlist",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(item: WatchlistItem) {
    try {
      setRemoving(item.id);
      await removeFromWatchlist(item.company_id);
      
      // Remove from local state
      setWatchlist(prev => prev.filter(w => w.id !== item.id));
      
      toast({
        title: "Removed",
        description: `${item.company_name} removed from watchlist`,
      });
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive"
      });
    } finally {
      setRemoving(null);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Eye className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">My Watchlist</h1>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Eye className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">My Watchlist</h1>
        </div>
        
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies in your watchlist</h3>
          <p className="text-gray-500 mb-6">Start watching companies to track their trade activity and get updates.</p>
          <Link 
            to="/dashboard/search"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">My Watchlist</h1>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {watchlist.length} {watchlist.length === 1 ? 'company' : 'companies'}
          </span>
        </div>
        
        <button
          onClick={loadWatchlist}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Watchlist Items */}
      <div className="space-y-4">
        {watchlist.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.company_name}</h3>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Added {formatDate(item.created_at)}</span>
                  
                  {item.country && (
                    <span>📍 {item.country}</span>
                  )}
                  
                  {item.hs6_code && (
                    <span>📦 HS {item.hs6_code}</span>
                  )}
                  
                  {item.trade_value && (
                    <span>💰 {formatCurrency(item.trade_value)}</span>
                  )}
                  
                  {item.last_seen && (
                    <span>👁️ Last seen {formatDate(item.last_seen)}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Link
                  to={`/dashboard/search?company=${encodeURIComponent(item.company_name)}`}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  View
                </Link>
                
                <button
                  onClick={() => handleRemove(item)}
                  disabled={removing === item.id}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                  title="Remove from watchlist"
                >
                  <Trash2 className="h-3 w-3" />
                  {removing === item.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t pt-6">
        <p className="text-sm text-gray-500 text-center">
          Companies in your watchlist will be monitored for trade activity updates.
        </p>
      </div>
    </div>
  );
}