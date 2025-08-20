import { supabaseServer } from '@/lib/supabase-server';

type SearchParams = {
  mode?: 'all' | 'air' | 'ocean';
  company?: string;
  commodity?: string;
  origin_country?: string;
  destination_country?: string;
  destination_city?: string;
  hs_code?: string;
  carrier?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
};

export async function searchUnified(params: SearchParams = {}) {
  const sb = supabaseServer();
  const {
    mode = 'all', company, commodity, origin_country, destination_country,
    destination_city, hs_code, carrier, date_from, date_to,
    limit = 25, offset = 0
  } = params;

  let q = sb
    .from('unified_shipments')
    .select('*', { count: 'exact' })
    .order('unified_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (mode !== 'all') q = q.eq('mode', mode);
  if (company) q = q.ilike('unified_company_name', `%${company}%`);
  if (commodity) q = q.ilike('commodity_description', `%${commodity}%`);
  if (origin_country) q = q.eq('origin_country', origin_country);
  if (destination_country) q = q.eq('destination_country', destination_country);
  if (destination_city) q = q.eq('destination_city', destination_city);
  if (hs_code) q = q.eq('hs_code', hs_code);
  if (carrier) q = q.ilike('unified_carrier', `%${carrier}%`);
  if (date_from) q = q.gte('unified_date', date_from);
  if (date_to) q = q.lte('unified_date', date_to);

  const { data, error, count } = await q;
  if (error) return { success: false, data: [], total: 0, error: error.message } as const;
  return { success: true, data: data ?? [], total: count ?? 0, summary: null, pagination: { hasMore: typeof count === 'number' ? offset + limit < count : false } } as const;
}