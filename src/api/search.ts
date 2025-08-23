import { supabaseServer } from '@/lib/supabase-server';
import { norm, type Unified } from '@/lib/normalize';

export interface SearchFilters {
  query?: string;
  mode?: 'all' | 'air' | 'ocean';
  origin_country?: string;
  destination_country?: string;
  destination_city?: string;
  hs_code?: string;
  carrier?: string;
  date_from?: string;
  date_to?: string;
  min_value?: number;
  max_value?: number;
  air_shipper_only?: boolean;
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  success: boolean;
  data: Unified[];
  total: number;
  summary: {
    air_count: number;
    ocean_count: number;
    total_value: number;
  };
  pagination: {
    hasMore: boolean;
    limit: number;
    offset: number;
  };
}

export async function searchUnified(filters: SearchFilters): Promise<SearchResponse> {
  const supabase = supabaseServer();
  const limit = filters.limit || 25;
  const offset = filters.offset || 0;

  try {
    // Build dynamic query
    let query = supabase
      .from('unified_shipments')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.query) {
      query = query.or(`unified_company_name.ilike.%${filters.query}%,description.ilike.%${filters.query}%,commodity_description.ilike.%${filters.query}%`);
    }

    if (filters.mode && filters.mode !== 'all') {
      query = query.eq('mode', filters.mode);
    }

    if (filters.origin_country) {
      query = query.eq('origin_country', filters.origin_country);
    }

    if (filters.destination_country) {
      query = query.eq('destination_country', filters.destination_country);
    }

    if (filters.destination_city) {
      query = query.ilike('destination_city', `%${filters.destination_city}%`);
    }

    if (filters.hs_code) {
      query = query.ilike('hs_code', `${filters.hs_code}%`);
    }

    if (filters.carrier) {
      query = query.ilike('unified_carrier', `%${filters.carrier}%`);
    }

    if (filters.date_from) {
      query = query.gte('unified_date', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('unified_date', filters.date_to);
    }

    if (filters.min_value) {
      query = query.gte('unified_value', filters.min_value);
    }

    if (filters.max_value) {
      query = query.lte('unified_value', filters.max_value);
    }

    if (filters.air_shipper_only) {
      query = query.eq('is_likely_air_shipper', true);
    }

    // Apply pagination and ordering
    query = query
      .order('unified_date', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Search error:', error);
      return {
        success: false,
        data: [],
        total: 0,
        summary: { air_count: 0, ocean_count: 0, total_value: 0 },
        pagination: { hasMore: false, limit, offset }
      };
    }

    // Get summary data
    const summaryQuery = supabase
      .from('unified_shipments')
      .select('mode, unified_value');

    // Apply same filters for summary
    if (filters.query) {
      summaryQuery.or(`unified_company_name.ilike.%${filters.query}%,description.ilike.%${filters.query}%,commodity_description.ilike.%${filters.query}%`);
    }

    const { data: summaryData } = await summaryQuery;
    
    const summary = {
      air_count: summaryData?.filter(row => row.mode === 'air').length || 0,
      ocean_count: summaryData?.filter(row => row.mode === 'ocean').length || 0,
      total_value: summaryData?.reduce((sum, row) => sum + (row.unified_value || 0), 0) || 0
    };

    const normalizedData = (data || []).map(norm);
    const total = count || 0;

    return {
      success: true,
      data: normalizedData,
      total,
      summary,
      pagination: {
        hasMore: total > offset + normalizedData.length,
        limit,
        offset
      }
    };

  } catch (error) {
    console.error('Search unified error:', error);
    return {
      success: false,
      data: [],
      total: 0,
      summary: { air_count: 0, ocean_count: 0, total_value: 0 },
      pagination: { hasMore: false, limit, offset }
    };
  }
}

export async function searchCompanies(query: string, limit = 25): Promise<{ success: boolean; data: any[] }> {
  const supabase = supabaseServer();

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Company search error:', error);
      return { success: false, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Company search error:', error);
    return { success: false, data: [] };
  }
}

export async function searchCountries(): Promise<{ success: boolean; data: string[] }> {
  const supabase = supabaseServer();

  try {
    const { data, error } = await supabase
      .from('unified_shipments')
      .select('origin_country, destination_country')
      .not('origin_country', 'is', null)
      .not('destination_country', 'is', null);

    if (error) {
      console.error('Countries search error:', error);
      return { success: false, data: [] };
    }

    const countries = new Set<string>();
    data?.forEach(row => {
      if (row.origin_country) countries.add(row.origin_country);
      if (row.destination_country) countries.add(row.destination_country);
    });

    return {
      success: true,
      data: Array.from(countries).sort()
    };
  } catch (error) {
    console.error('Countries search error:', error);
    return { success: false, data: [] };
  }
}