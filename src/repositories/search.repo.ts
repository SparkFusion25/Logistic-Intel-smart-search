import { supabase } from '@/integrations/supabase/client';

export type SearchParams = {
  q?: string;
  mode?: 'all' | 'air' | 'ocean';
  origin_country?: string;
  destination_country?: string;
  hs_code?: string;
  carrier?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
};

export async function searchUnified(params: SearchParams = {}) {
  const { 
    q, 
    mode = 'all', 
    origin_country, 
    destination_country, 
    hs_code, 
    carrier, 
    date_from, 
    date_to, 
    limit = 25, 
    offset = 0 
  } = params;

  let query = supabase
    .from('unified_shipments_view')
    .select('*', { count: 'exact' })
    .order('unified_date', { ascending: false })
    .range(offset, offset + limit - 1);

  // Apply filters
  if (q) {
    query = query.ilike('unified_company_name', `%${q}%`);
  }
  if (mode !== 'all') {
    query = query.eq('mode', mode);
  }
  if (origin_country) {
    query = query.eq('origin_country', origin_country);
  }
  if (destination_country) {
    query = query.eq('destination_country', destination_country);
  }
  if (hs_code) {
    query = query.ilike('hs_code', `%${hs_code}%`);
  }
  if (carrier) {
    query = query.ilike('unified_carrier', `%${carrier}%`);
  }
  if (date_from) {
    query = query.gte('unified_date', date_from);
  }
  if (date_to) {
    query = query.lte('unified_date', date_to);
  }

  const { data, error, count } = await query;
  
  if (error) {
    return { 
      success: false, 
      error: error.message, 
      data: [], 
      total: 0 
    } as const;
  }
  
  const total = typeof count === 'number' ? count : (Array.isArray(data) ? data.length : 0);
  
  return { 
    success: true, 
    data: data ?? [], 
    total, 
    pagination: { hasMore: total > offset + limit } 
  } as const;
}

export async function searchCompanies(params: { q?: string; limit?: number; offset?: number } = {}) {
  const { q, limit = 25, offset = 0 } = params;

  let query = supabase
    .from('search_companies_view')
    .select('*', { count: 'exact' })
    .order('shipments_count', { ascending: false })
    .range(offset, offset + limit - 1);

  if (q) {
    query = query.ilike('company_name', `%${q}%`);
  }

  const { data, error, count } = await query;
  
  if (error) {
    return { 
      success: false, 
      error: error.message, 
      data: [], 
      total: 0 
    } as const;
  }
  
  const total = typeof count === 'number' ? count : (Array.isArray(data) ? data.length : 0);
  
  return { 
    success: true, 
    data: data ?? [], 
    total 
  } as const;
}

export async function insertCrmContacts(contacts: any[]) {
  const payload = contacts.map(contact => ({
    company_name: contact.company_name || 'Unknown Company',
    full_name: contact.full_name || null,
    title: contact.title || null,
    email: contact.email || null,
    phone: contact.phone || null,
    linkedin: contact.linkedin || null,
    country: contact.country || null,
    city: contact.city || null,
    panjiva_id: contact.panjiva_id || null,
    source: contact.source || 'import',
    tags: Array.isArray(contact.tags) ? contact.tags : 
          (contact.tags ? String(contact.tags).split(/[;,]/).map((s: string) => s.trim()) : null),
    notes: contact.notes || null,
    org_id: contact.org_id || null
  }));

  const { data, error } = await supabase
    .from('crm_contacts')
    .upsert(payload, { onConflict: 'email' })
    .select('*');

  if (error) {
    return { success: false, error: error.message, data: [] } as const;
  }

  return { success: true, data: data ?? [] } as const;
}

export async function insertUnifiedShipments(shipments: any[]) {
  const payload = shipments.map(shipment => ({
    mode: (String(shipment.mode || '').toLowerCase().includes('air') ? 'air' :
          String(shipment.mode || '').toLowerCase().includes('ocean') ? 'ocean' : 'ocean'),
    unified_company_name: shipment.unified_company_name || shipment.company_name || '',
    hs_code: shipment.hs_code || null,
    origin_country: shipment.origin_country || null,
    destination_country: shipment.destination_country || null,
    destination_city: shipment.destination_city || null,
    unified_carrier: shipment.unified_carrier || null,
    unified_date: shipment.unified_date ? new Date(shipment.unified_date).toISOString().slice(0, 10) : null,
    commodity_description: shipment.description || shipment.commodity_description || null,
    bol_number: shipment.bol_number || null,
    vessel_name: shipment.vessel_name || null,
    gross_weight_kg: shipment.weight_kg ? Number(shipment.weight_kg) : null,
    value_usd: shipment.value_usd ? Number(shipment.value_usd) : null,
    container_count: shipment.container_count ? Number(shipment.container_count) : null,
    org_id: shipment.org_id || null
  }));

  const { data, error } = await supabase
    .from('unified_shipments')
    .insert(payload)
    .select('*');

  if (error) {
    return { success: false, error: error.message, data: [] } as const;
  }

  return { success: true, data: data ?? [] } as const;
}