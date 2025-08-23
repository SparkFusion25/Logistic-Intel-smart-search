import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Eye, EyeOff, BookmarkCheck, TrendingUp, MapPin } from 'lucide-react';
import { addToWatchlist, removeFromWatchlist, getWatchlistStatus } from '@/features/watchlist/api';
import { useToast } from '@/hooks/use-toast';
import { CTAPrimary, CTAGhost } from '@/ui/CTA';

interface Company {
  id: string;
  company_id: string;
  company_name: string;
  hs6_code: string;
  trade_volume: number;
  trade_value: number;
  country: string;
  confidence_score: number;
  last_seen: string;
}

interface SimilarCompanyRowProps {
  company: Company;
  className?: string;
}

export function SimilarCompanyRow({ company, className = '' }: SimilarCompanyRowProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [watched, setWatched] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [watchLoading, setWatchLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const loadStatus = async () => {
      try {
        const status = await getWatchlistStatus(company.company_name);
        if (mounted) {
          setSaved(status.saved);
          setWatched(status.watched);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading watchlist status:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadStatus();
    return () => { mounted = false };
  }, [company.company_name]);

  const handleCompanyClick = () => {
    navigate(`/dashboard/search?company=${encodeURIComponent(company.company_name)}`);
  };

  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaveLoading(true);
    
    try {
      if (saved) {
        await removeFromWatchlist(company.company_name, 'saved');
        setSaved(false);
        toast({
          title: "Removed",
          description: `${company.company_name} removed from saved companies`
        });
      } else {
        await addToWatchlist(company.company_name, 'saved');
        setSaved(true);
        toast({
          title: "Saved",
          description: `${company.company_name} saved to your watchlist`
        });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: "Error",
        description: "Failed to update saved status",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const toggleWatch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchLoading(true);
    
    try {
      if (watched) {
        await removeFromWatchlist(company.company_name, 'watch');
        setWatched(false);
        toast({
          title: "Unwatched",
          description: `No longer watching ${company.company_name}`
        });
      } else {
        await addToWatchlist(company.company_name, 'watch');
        setWatched(true);
        toast({
          title: "Watching",
          description: `Now watching ${company.company_name} for updates`
        });
      }
    } catch (error) {
      console.error('Error toggling watch:', error);
      toast({
        title: "Error",
        description: "Failed to update watch status",
        variant: "destructive"
      });
    } finally {
      setWatchLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div
      className={`card card-gloss p-6 cursor-pointer transition-all duration-200 hover:shadow-glossy hover:-translate-y-1 ${className}`}
      onClick={handleCompanyClick}
    >
      {/* Company Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {company.company_name}
          </h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {company.country}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              HS {company.hs6_code}
            </span>
          </div>
        </div>
        
        {/* Confidence Score */}
        <div className="ml-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {company.confidence_score}%
            </div>
            <div className="text-xs text-gray-500">confidence</div>
          </div>
        </div>
      </div>

      {/* Trade Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500">Trade Volume</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatNumber(company.trade_volume)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Trade Value</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(company.trade_value)}
          </div>
        </div>
      </div>

      {/* Actions - Stack on mobile */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <CTAGhost
          onClick={toggleSave}
          disabled={loading || saveLoading}
          className="flex-1 sm:flex-none"
          aria-busy={saveLoading}
        >
          {saveLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 mr-2" />
          ) : saved ? (
            <BookmarkCheck className="h-4 w-4 mr-2" />
          ) : (
            <Bookmark className="h-4 w-4 mr-2" />
          )}
          {saved ? 'Saved ✓' : 'Save'}
        </CTAGhost>

        <CTAPrimary
          onClick={toggleWatch}
          disabled={loading || watchLoading}
          className="flex-1 sm:flex-none"
          aria-busy={watchLoading}
        >
          {watchLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-gray-300 mr-2" />
          ) : watched ? (
            <EyeOff className="h-4 w-4 mr-2" />
          ) : (
            <Eye className="h-4 w-4 mr-2" />
          )}
          {watched ? 'Watching ✓' : 'Watch'}
        </CTAPrimary>
      </div>

      {/* Last Seen */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Last seen: {new Date(company.last_seen).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}