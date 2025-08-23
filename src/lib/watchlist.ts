import { supabase } from './supabaseClient';

// Add company to watchlist
export async function addToWatchlist(companyId: string) {
  const { data, error } = await supabase.rpc('fn_watch_company', { p_company_id: companyId });
  if (error) throw error;
  return data; // { id: uuid }
}

// Remove company from watchlist
export async function removeFromWatchlist(companyId: string) {
  const { data, error } = await supabase.rpc('fn_unwatch_company', { p_company_id: companyId });
  if (error) throw error;
  return data; // { ok: true }
}

// Get my watchlist (for the current user/org via RLS)
export async function getMyWatchlist() {
  const { data, error } = await supabase
    .from('company_watchlist_view') // or company_watchlist if you didn't create a view
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Backward compatibility
export const watchCompany = addToWatchlist;