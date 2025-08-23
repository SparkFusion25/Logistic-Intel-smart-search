import { supabase } from './supabaseClient';

export async function watchCompany(companyId: string) {
  const { data, error } = await supabase.rpc('add_company_to_watchlist', {
    p_company_id: companyId
  });
  if (error) throw error;
  return data; // { watchlist_id }
}