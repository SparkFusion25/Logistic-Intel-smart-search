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

export async function searchCompaniesAggregated(params: SearchParams = {}) {
  try {
    const { 
      q = '', 
      limit = 50, 
      offset = 0,
      mode = 'all',
      date_from,
      date_to,
      origin_country,
      destination_country,
      hs_code,
      carrier
    } = params;

    // Use the company_trade_profiles table for enhanced aggregated data
    let query = supabase
      .from('company_trade_profiles')
      .select(`
        *,
        id as company_id
      `, { count: 'exact' })
      .order('total_shipments', { ascending: false });

    // Apply filters
    if (q && q.trim()) {
      query = query.ilike('company_name', `%${q.trim()}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Company trade profiles query error:', error);
      return { success: false, error: error.message, data: [], total: 0 };
    }

    // Transform data to match SearchCompanyView format with enhanced fields
    const transformedData = (data ?? []).map(company => ({
      company_name: company.company_name,
      company_id: company.id,
      contacts_count: 0, // Would need to be calculated from CRM contacts
      shipments_count: company.total_shipments || 0,
      last_shipment_date: company.last_shipment_date,
      modes: [
        ...(company.total_ocean_shipments > 0 ? ['ocean'] : []),
        ...(company.total_air_shipments > 0 ? ['air'] : [])
      ],
      dest_countries: company.top_destination_countries || [],
      top_commodities: company.top_commodities || [],
      website: null, // Would need enrichment from companies table
      country: company.top_origin_countries?.[0] || null,
      industry: null, // Would need enrichment
      // Enhanced fields from company_trade_profiles
      total_ocean_shipments: company.total_ocean_shipments,
      total_air_shipments: company.total_air_shipments,
      total_trade_value_usd: company.total_trade_value_usd,
      avg_shipment_value_usd: company.avg_shipment_value_usd,
      top_origin_countries: company.top_origin_countries,
      top_destination_countries: company.top_destination_countries,
    }));

    const total = typeof count === 'number' ? count : (Array.isArray(data) ? data.length : 0);

    return {
      success: true,
      data: transformedData,
      total: total
    };
  } catch (error) {
    console.error('Search companies aggregated error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
      total: 0
    };
  }
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
    // CRITICAL FIX: Ensure org_id is always set to prevent RLS violations
    org_id: contact.org_id || 'bb997b6b-fa1a-46c8-9957-fabe835eee55'
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
  const payload = shipments.map(shipment => {
    // Helper function to safely convert numbers
    const safeNumber = (val: any) => {
      if (val === null || val === undefined || val === '') return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

    // Helper function to safely convert dates
    const safeDate = (val: any) => {
      if (!val) return null;
      try {
        const date = new Date(val);
        return isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
      } catch {
        return null;
      }
    };

    // Helper function to safely extract text
    const safeText = (val: any) => {
      if (val === null || val === undefined) return null;
      const text = String(val).trim();
      return text === '' ? null : text;
    };

    return {
      // Core identifiers - ensure org_id is set
      org_id: shipment.org_id || 'bb997b6b-fa1a-46c8-9957-fabe835eee55',
      unified_id: safeText(shipment.unified_id),
      unified_company_name: safeText(shipment.unified_company_name || shipment.company_name || shipment.shipper_name || shipment.consignee_name),
      
      // Transport details
      mode: (() => {
        const mode = String(shipment.mode || shipment.shipment_type || shipment.transport_mode || '').toLowerCase();
        if (mode.includes('air') || mode.includes('aircraft') || mode.includes('flight')) return 'air';
        if (mode.includes('ocean') || mode.includes('sea') || mode.includes('vessel') || mode.includes('ship')) return 'ocean';
        return 'ocean'; // Default fallback
      })(),
      shipment_type: safeText(shipment.shipment_type),
      transport_mode: safeText(shipment.transport_mode),
      shipment_mode: safeText(shipment.shipment_mode),
      transport_method: safeText(shipment.transport_method),
      
      // Company information
      shipper_name: safeText(shipment.shipper_name || shipment.shipper),
      consignee_name: safeText(shipment.consignee_name || shipment.consignee),
      shipper: safeText(shipment.shipper),
      consignee: safeText(shipment.consignee),
      
      // Commodity information
      hs_code: safeText(shipment.hs_code),
      description: safeText(shipment.description || shipment.commodity_description),
      hs_description: safeText(shipment.hs_description),
      commodity_description: safeText(shipment.commodity_description || shipment.description),
      
      // Geographic information
      origin_country: safeText(shipment.origin_country || shipment.shipper_country),
      destination_country: safeText(shipment.destination_country || shipment.consignee_country),
      destination_city: safeText(shipment.destination_city || shipment.consignee_city),
      destination_state: safeText(shipment.destination_state || shipment.consignee_state_region),
      shipment_origin: safeText(shipment.shipment_origin),
      shipment_destination: safeText(shipment.shipment_destination),
      shipment_destination_region: safeText(shipment.shipment_destination_region),
      
      // Port information
      port_of_loading: safeText(shipment.port_of_loading || shipment.port_of_lading),
      port_of_discharge: safeText(shipment.port_of_discharge || shipment.port_of_unlading),
      port_of_unlading: safeText(shipment.port_of_unlading),
      port_of_lading: safeText(shipment.port_of_lading),
      port_of_lading_country: safeText(shipment.port_of_lading_country),
      port_of_lading_region: safeText(shipment.port_of_lading_region),
      port_of_unlading_region: safeText(shipment.port_of_unlading_region),
      
      // Carrier and vessel
      unified_carrier: safeText(shipment.unified_carrier || shipment.carrier_name || shipment.carrier),
      carrier_name: safeText(shipment.carrier_name || shipment.unified_carrier),
      vessel_name: safeText(shipment.vessel_name || shipment.vessel),
      vessel: safeText(shipment.vessel),
      vessel_voyage_id: safeText(shipment.vessel_voyage_id),
      
      // BOL information
      bol_number: safeText(shipment.bol_number || shipment.bill_of_lading_number),
      bill_of_lading_number: safeText(shipment.bill_of_lading_number || shipment.bol_number),
      
      // Dates
      unified_date: safeDate(shipment.unified_date || shipment.shipment_date || shipment.arrival_date || shipment.departure_date),
      shipment_date: safeDate(shipment.shipment_date),
      arrival_date: safeDate(shipment.arrival_date),
      departure_date: safeDate(shipment.departure_date),
      
      // Values and measurements
      unified_value: safeNumber(shipment.unified_value || shipment.value_usd),
      unified_weight: safeNumber(shipment.unified_weight || shipment.gross_weight_kg || shipment.weight_kg),
      value_usd: safeNumber(shipment.value_usd || shipment.unified_value),
      gross_weight_kg: safeNumber(shipment.gross_weight_kg || shipment.weight_kg || shipment.unified_weight),
      weight_kg: safeNumber(shipment.weight_kg || shipment.gross_weight_kg),
      container_count: safeNumber(shipment.container_count),
      quantity: safeNumber(shipment.quantity),
      
      // Address information
      shipper_address: safeText(shipment.shipper_address),
      shipper_city: safeText(shipment.shipper_city),
      shipper_state_region: safeText(shipment.shipper_state_region),
      shipper_postal_code: safeText(shipment.shipper_postal_code),
      shipper_full_address: safeText(shipment.shipper_full_address),
      consignee_address: safeText(shipment.consignee_address),
      consignee_city: safeText(shipment.consignee_city),
      consignee_state_region: safeText(shipment.consignee_state_region),
      consignee_postal_code: safeText(shipment.consignee_postal_code),
      consignee_full_address: safeText(shipment.consignee_full_address),
      
      // Contact information
      shipper_email_1: safeText(shipment.shipper_email_1),
      shipper_phone_1: safeText(shipment.shipper_phone_1),
      consignee_email_1: safeText(shipment.consignee_email_1),
      consignee_phone_1: safeText(shipment.consignee_phone_1),
      consignee_website_1: safeText(shipment.consignee_website_1),
      
      // Company metadata
      shipper_industry: safeText(shipment.shipper_industry),
      shipper_revenue: safeText(shipment.shipper_revenue),
      shipper_employees: safeText(shipment.shipper_employees),
      shipper_trade_roles: safeText(shipment.shipper_trade_roles),
      consignee_industry: safeText(shipment.consignee_industry),
      consignee_revenue: safeText(shipment.consignee_revenue),
      consignee_employees: safeText(shipment.consignee_employees),
      consignee_trade_roles: safeText(shipment.consignee_trade_roles),
      
      // Additional fields
      matching_fields: safeText(shipment.matching_fields),
      is_likely_air_shipper: shipment.is_likely_air_shipper === true || shipment.is_likely_air_shipper === 'true' ? true : null,
      air_confidence_score: safeNumber(shipment.air_confidence_score)
    };
  });

  const { data, error } = await supabase
    .from('unified_shipments')
    .insert(payload)
    .select('*');

  if (error) {
    return { success: false, error: error.message, data: [] } as const;
  }

  return { success: true, data: data ?? [] } as const;
}