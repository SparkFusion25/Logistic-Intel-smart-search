import { supabase } from '@/lib/supabase';

export interface WatchlistEntry {
  id: string;
  company_id: string;
  status: 'saved' | 'watch';
  user_id: string;
  org_id: string;
  created_at: string;
}

// RPC function for watching a company - handles all business logic server-side
export async function watchCompany(companyId: string): Promise<{ id: string; status: string } | null> {
  const { data, error } = await supabase.rpc('watch_company', { p_company_id: companyId });
  if (error) throw error;
  return data as { id: string; status: string } | null;
}

// RPC function for saving a company to watchlist
export async function saveCompany(companyId: string): Promise<{ id: string; status: string } | null> {
  const { data, error } = await supabase.rpc('save_company', { p_company_id: companyId });
  if (error) throw error;
  return data as { id: string; status: string } | null;
}

// RPC function for unwatching a company
export async function unwatchCompany(companyId: string): Promise<void> {
  const { error } = await supabase.rpc('unwatch_company', { p_company_id: companyId });
  if (error) throw error;
}

// RPC function for unsaving a company
export async function unsaveCompany(companyId: string): Promise<void> {
  const { error } = await supabase.rpc('unsave_company', { p_company_id: companyId });
  if (error) throw error;
}

// Get watchlist status for a company
export async function getWatchlistStatus(companyId: string): Promise<{ saved: boolean; watched: boolean }> {
  const { data, error } = await supabase
    .from('company_watchlist')
    .select('status')
    .eq('company_id', companyId);
    
  if (error) throw error;
  
  const saved = data?.some(entry => entry.status === 'saved') || false;
  const watched = data?.some(entry => entry.status === 'watch') || false;
  
  return { saved, watched };
}

// Toggle watchlist status using RPC functions
export async function toggleWatchlist(companyId: string, status: 'saved' | 'watch'): Promise<boolean> {
  const currentStatus = await getWatchlistStatus(companyId);
  const isCurrentlyActive = status === 'saved' ? currentStatus.saved : currentStatus.watched;
  
  if (isCurrentlyActive) {
    // Remove from watchlist
    if (status === 'saved') {
      await unsaveCompany(companyId);
    } else {
      await unwatchCompany(companyId);
    }
    return false;
  } else {
    // Add to watchlist
    if (status === 'saved') {
      await saveCompany(companyId);
    } else {
      await watchCompany(companyId);
    }
    return true;
  }
}

// Backward compatibility - these functions work with company name by looking up the ID first
export async function getWatchlistStatusByName(companyName: string): Promise<{ saved: boolean; watched: boolean }> {
  // First, get the company_id from the companies table or v_company_hs6 view
  const { data: company, error } = await supabase
    .from('companies')
    .select('id')
    .ilike('name', companyName)
    .limit(1)
    .maybeSingle();
    
  if (error || !company) {
    return { saved: false, watched: false };
  }
  
  return getWatchlistStatus(company.id);
}