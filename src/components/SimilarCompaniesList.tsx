import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Eye, EyeOff, BookmarkCheck, Building2, TrendingUp, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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

interface WatchlistStatus {
  [companyId: string]: {
    saved: boolean;
    watched: boolean;
  };
}

interface SimilarCompaniesListProps {
  hsCode?: string;
  companyName?: string;
  limit?: number;
  className?: string;
}

export default function SimilarCompaniesList({ 
  hsCode, 
  companyName, 
  limit = 10, 
  className = '' 
}: SimilarCompaniesListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchlistStatus, setWatchlistStatus] = useState<WatchlistStatus>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  // Load companies from v_company_hs6 view
  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('v_company_hs6')
          .select('*')
          .order('trade_value', { ascending: false })
          .limit(limit);

        // Filter by HS code if provided
        if (hsCode) {
          query = query.eq('hs6_code', hsCode);
        }

        // Filter by company name if provided (similar companies)
        if (companyName) {
          query = query.ilike('company_name', `%${companyName}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error loading companies:', error);
          toast({
            title: "Error",
            description: "Failed to load similar companies",
            variant: "destructive"
          });
          setCompanies([]);
        } else {
          setCompanies(data || []);
        }
      } catch (error) {
        console.error('Error loading companies:', error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [hsCode, companyName, limit, toast]);

  // Load watchlist status for all companies
  useEffect(() => {
    const loadWatchlistStatus = async () => {
      if (!currentUser || companies.length === 0) return;

      try {
        const companyIds = companies.map(c => c.company_id);
        const { data, error } = await supabase
          .from('company_watchlist')
          .select('company_id, status')
          .eq('user_id', currentUser.id)
          .in('company_id', companyIds);

        if (error) {
          console.error('Error loading watchlist status:', error);
          return;
        }

        const statusMap: WatchlistStatus = {};
        companies.forEach(company => {
          const watchlistEntry = data?.find(w => w.company_id === company.company_id);
          statusMap[company.company_id] = {
            saved: watchlistEntry?.status === 'saved',
            watched: watchlistEntry?.status === 'watch'
          };
        });

        setWatchlistStatus(statusMap);
      } catch (error) {
        console.error('Error loading watchlist status:', error);
      }
    };

    loadWatchlistStatus();
  }, [currentUser, companies]);

  const handleCompanyClick = (company: Company) => {
    // Navigate to search page filtered by this company
    navigate(`/dashboard/search?company=${encodeURIComponent(company.company_name)}`);
  };

  const handleSave = async (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save companies",
        variant: "destructive"
      });
      return;
    }

    const actionKey = `save-${company.company_id}`;
    setActionLoading(prev => new Set(prev).add(actionKey));

    try {
      const isCurrentlySaved = watchlistStatus[company.company_id]?.saved;
      
      if (isCurrentlySaved) {
        // Remove from watchlist
        const { error } = await supabase
          .from('company_watchlist')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('company_id', company.company_id)
          .eq('status', 'saved');

        if (error) throw error;

        // Update local state
        setWatchlistStatus(prev => ({
          ...prev,
          [company.company_id]: {
            ...prev[company.company_id],
            saved: false
          }
        }));

        toast({
          title: "Removed",
          description: `${company.company_name} removed from saved companies`
        });
      } else {
        // Add to watchlist with 'saved' status
        const { error } = await supabase
          .from('company_watchlist')
          .upsert({
            user_id: currentUser.id,
            org_id: currentUser.user_metadata?.org_id || currentUser.id,
            company_id: company.company_id,
            status: 'saved',
            created_at: new Date().toISOString()
          });

        if (error) throw error;

        // Update local state
        setWatchlistStatus(prev => ({
          ...prev,
          [company.company_id]: {
            ...prev[company.company_id],
            saved: true
          }
        }));

        toast({
          title: "Saved",
          description: `${company.company_name} saved to your watchlist`
        });
      }
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: "Error",
        description: "Failed to save company",
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  };

  const handleWatch = async (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to watch companies",
        variant: "destructive"
      });
      return;
    }

    const actionKey = `watch-${company.company_id}`;
    setActionLoading(prev => new Set(prev).add(actionKey));

    try {
      const isCurrentlyWatched = watchlistStatus[company.company_id]?.watched;
      
      if (isCurrentlyWatched) {
        // Remove from watch list
        const { error } = await supabase
          .from('company_watchlist')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('company_id', company.company_id)
          .eq('status', 'watch');

        if (error) throw error;

        // Update local state
        setWatchlistStatus(prev => ({
          ...prev,
          [company.company_id]: {
            ...prev[company.company_id],
            watched: false
          }
        }));

        toast({
          title: "Unwatched",
          description: `No longer watching ${company.company_name}`
        });
      } else {
        // Add to watch list
        const { error } = await supabase
          .from('company_watchlist')
          .upsert({
            user_id: currentUser.id,
            org_id: currentUser.user_metadata?.org_id || currentUser.id,
            company_id: company.company_id,
            status: 'watch',
            created_at: new Date().toISOString()
          });

        if (error) throw error;

        // Update local state
        setWatchlistStatus(prev => ({
          ...prev,
          [company.company_id]: {
            ...prev[company.company_id],
            watched: true
          }
        }));

        toast({
          title: "Watching",
          description: `Now watching ${company.company_name} for updates`
        });
      }
    } catch (error) {
      console.error('Error watching company:', error);
      toast({
        title: "Error",
        description: "Failed to update watch status",
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
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

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="card p-8 text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No similar companies found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {companies.map((company) => {
        const isSaved = watchlistStatus[company.company_id]?.saved || false;
        const isWatched = watchlistStatus[company.company_id]?.watched || false;
        const saveLoading = actionLoading.has(`save-${company.company_id}`);
        const watchLoading = actionLoading.has(`watch-${company.company_id}`);

        return (
          <div
            key={company.id}
            className="card card-gloss p-6 cursor-pointer transition-all duration-200 hover:shadow-glossy hover:-translate-y-1"
            onClick={() => handleCompanyClick(company)}
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
                onClick={(e) => handleSave(company, e)}
                disabled={saveLoading}
                className="flex-1 sm:flex-none"
              >
                {saveLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 mr-2" />
                ) : isSaved ? (
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                ) : (
                  <Bookmark className="h-4 w-4 mr-2" />
                )}
                {isSaved ? 'Saved' : 'Save'}
              </CTAGhost>

              <CTAPrimary
                onClick={(e) => handleWatch(company, e)}
                disabled={watchLoading}
                className="flex-1 sm:flex-none"
              >
                {watchLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-gray-300 mr-2" />
                ) : isWatched ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {isWatched ? 'Unwatch' : 'Watch'}
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
      })}
    </div>
  );
}