import { supabase } from '@/lib/supabase';

export interface CRMContact {
  id: string;
  company_name: string;
  full_name?: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  country?: string;
  city?: string;
  source: string;
  tags?: string[];
  notes?: string;
  created_at: string;
}

/**
 * Add a company to CRM using the database RPC function
 * This handles all the business logic on the database side including:
 * - Duplicate detection and prevention
 * - User/org scoping with RLS
 * - Automatic timestamping
 */
export async function addCompanyPlaceholder(companyName: string): Promise<string> {
  const { data, error } = await supabase
    .rpc('add_company_to_crm_by_name', { 
      p_company: companyName, 
      p_source: 'search_card' 
    });
    
  if (error) throw error;
  return data as string; // contact_id (uuid)
}

/**
 * Add a company to CRM with additional context (fallback to manual insert)
 */
export async function addCompanyToCRM(params: {
  companyName: string;
  source?: string;
  notes?: string;
  tags?: string[];
}): Promise<string> {
  const { companyName, source = 'manual', notes, tags = [] } = params;
  
  try {
    // Try RPC function first (preferred method)
    return await addCompanyPlaceholder(companyName);
  } catch (rpcError) {
    console.warn('RPC function failed, falling back to manual insert:', rpcError);
    
    // Fallback to manual insert
    const { data, error } = await supabase
      .from('crm_contacts')
      .insert({
        company_name: companyName,
        source,
        notes,
        tags
      })
      .select('id')
      .single();
      
    if (error) throw error;
    return data.id;
  }
}

/**
 * Get contact by ID
 */
export async function getContact(contactId: string): Promise<CRMContact | null> {
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('id', contactId)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  
  return data;
}

/**
 * Update contact
 */
export async function updateContact(contactId: string, updates: Partial<CRMContact>): Promise<CRMContact> {
  const { data, error } = await supabase
    .from('crm_contacts')
    .update(updates)
    .eq('id', contactId)
    .select('*')
    .single();
    
  if (error) throw error;
  return data;
}

/**
 * Search contacts by company name
 */
export async function searchContacts(query: string, limit = 10): Promise<CRMContact[]> {
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .or(`company_name.ilike.%${query}%,full_name.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) throw error;
  return data || [];
}

/**
 * Check if company already exists in CRM
 */
export async function isCompanyInCRM(companyName: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('id')
    .ilike('company_name', companyName)
    .limit(1)
    .maybeSingle();
    
  if (error) throw error;
  return !!data;
}