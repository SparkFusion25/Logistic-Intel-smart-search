import { supabase } from '@/lib/supabase';

export interface WatchlistEntry {
  id: string;
  company_name: string;
  company_id?: string;
  status: 'saved' | 'watch';
  user_id: string;
  org_id: string;
  created_at: string;
}

export async function addToWatchlist(companyName: string, status: 'saved' | 'watch' = 'saved'): Promise<WatchlistEntry> {
  const { data, error } = await supabase
    .from('company_watchlist')
    .insert({ 
      company_name: companyName,
      status: status
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function removeFromWatchlist(companyName: string, status?: 'saved' | 'watch'): Promise<void> {
  // RLS: deletes only your own row (user_id = auth.uid())
  let query = supabase
    .from('company_watchlist')
    .delete()
    .eq('company_name', companyName);
    
  if (status) {
    query = query.eq('status', status);
  }
  
  const { error } = await query;
  if (error) throw error;
}

export async function isWatched(companyName: string, status: 'saved' | 'watch' = 'saved'): Promise<boolean> {
  const { data, error } = await supabase
    .from('company_watchlist')
    .select('id')
    .eq('company_name', companyName)
    .eq('status', status)
    .limit(1)
    .maybeSingle();
    
  if (error) throw error;
  return !!data;
}

export async function getWatchlistStatus(companyName: string): Promise<{ saved: boolean; watched: boolean }> {
  const { data, error } = await supabase
    .from('company_watchlist')
    .select('status')
    .eq('company_name', companyName);
    
  if (error) throw error;
  
  const saved = data?.some(entry => entry.status === 'saved') || false;
  const watched = data?.some(entry => entry.status === 'watch') || false;
  
  return { saved, watched };
}

export async function toggleWatchlist(companyName: string, status: 'saved' | 'watch'): Promise<boolean> {
  const isCurrentlyWatched = await isWatched(companyName, status);
  
  if (isCurrentlyWatched) {
    await removeFromWatchlist(companyName, status);
    return false;
  } else {
    await addToWatchlist(companyName, status);
    return true;
  }
}