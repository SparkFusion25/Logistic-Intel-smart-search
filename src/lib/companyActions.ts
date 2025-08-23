import { supabase } from './supabase';

// Add company to watchlist
export async function watchCompany(companyId: string) {
  const { data, error } = await supabase.rpc('add_company_to_watchlist', {
    p_company_id: companyId,
  });
  if (error) throw error;
  return data;
}

// Add company placeholder to CRM
export async function addCompanyToCRM(companyName: string) {
  const { data, error } = await supabase.rpc('add_company_to_crm_by_name', {
    p_company: companyName,
    p_source: 'company_page',
  });
  if (error) throw error;
  return data as string; // contact_id
}