import { supabaseServer } from '@/lib/supabase-server';

export type ListParams = { search?: string; company?: string; tags?: string[]; limit?: number; offset?: number };

export async function listContacts(params: ListParams = {}) {
  const sb = supabaseServer();
  const { search, company, tags, limit = 25, offset = 0 } = params;
  let q = sb.from('crm_contacts').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
  if (company) q = q.eq('company_name', company);
  if (search) q = q.ilike('full_name', `%${search}%`);
  if (tags && tags.length) q = q.contains('tags', tags);
  const { data, error, count } = await q;
  if (error) return { success: false, data: [], total: 0, error: error.message } as const;
  return { success: true, data: data ?? [], total: count ?? 0 } as const;
}

export type UpsertContactBody = {
  company_name: string;
  full_name?: string | null;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  country?: string | null;
  city?: string | null;
  panjiva_id?: string | null;
  source?: string | null;
  tags?: string[] | null;
  notes?: string | null;
};

export async function upsertContact(body: UpsertContactBody) {
  const sb = supabaseServer();
  // upsert by panjiva_id → email fallback if present
  const { data, error } = await sb
    .from('crm_contacts')
    .upsert(body, { onConflict: 'panjiva_id' })
    .select()
    .single();
  if (error) return { success: false, error: error.message } as const;
  return { success: true, contact: data } as const;
}

// If you have deals & stages tables, add these. If not, keep as placeholders.
export async function listDealsByPipeline({ pipeline_id, search, limit = 50, offset = 0 }: { pipeline_id: string; search?: string; limit?: number; offset?: number; }) {
  const sb = supabaseServer();
  let q = sb.from('crm_deals').select('*', { count: 'exact' }).eq('pipeline_id', pipeline_id).order('updated_at', { ascending: false }).range(offset, offset + limit - 1);
  if (search) q = q.ilike('title', `%${search}%`);
  const { data, error, count } = await q;
  if (error) return { success: false, data: [], total: 0, error: error.message } as const;
  return { success: true, data: data ?? [], total: count ?? 0 } as const;
}

export async function moveDealStage({ deal_id, stage_id }: { deal_id: string; stage_id: string }) {
  const sb = supabaseServer();
  const { data, error } = await sb.from('crm_deals').update({ stage_id }).eq('id', deal_id).select().single();
  if (error) return { success: false, error: error.message } as const;
  return { success: true, deal: data } as const;
}