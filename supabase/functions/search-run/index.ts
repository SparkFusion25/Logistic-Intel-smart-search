import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the request body
    const body = await req.json();
    const { 
      q, 
      tab,
      filters,
      pagination,
      sort
    } = body;

    console.log('Search request received:', { q, tab, filters });

    // Log the search
    const { data: authUser } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
    );

    if (authUser.user) {
      await supabase.from('search_logs').insert({
        user_id: authUser.user.id,
        query: q,
        filters: filters,
        tab: tab,
        result_count: 0 // Will be updated after getting results
      });
    }

    let results = [];

    if (tab === 'companies') {
      // Query real data from companies table with search filtering
      let query = supabase
        .from('companies')
        .select(`
          id,
          company_name,
          country,
          industry,
          total_shipments,
          confidence_score,
          last_activity,
          website
        `);

      // Apply search filter if query provided
      if (q && q.trim() !== '') {
        const searchTerm = q.trim();
        console.log(`Applying search filter for: ${searchTerm}`);
        
        query = query.or(`
          company_name.ilike.%${searchTerm}%,
          industry.ilike.%${searchTerm}%,
          country.ilike.%${searchTerm}%
        `);
      }

      const { data: companyData, error: companyError } = await query
        .order('total_shipments', { ascending: false })
        .limit(50);

      if (companyError) {
        console.error('Error fetching company data:', companyError);
        results = [];
      } else {
        // Map company data to expected format
        results = companyData?.map(company => ({
          company_id: company.id,
          name: company.company_name,
          location: company.country || null,
          industry: company.industry || null,
          shipment_count: company.total_shipments || 0,
          last_shipment_at: company.last_activity,
          trade_volume_usd: 0, // Can be calculated from shipments if needed
          confidence: company.confidence_score || null,
          trend: null,
          logo_url: null
        })) || [];
      }

      // **REMOVED**: No default filtering applied

      // Apply sorting only if sort parameters are provided
      if (sort?.field === 'trade_volume') {
        results.sort((a, b) => sort.dir === 'desc' ? 
          b.trade_volume_usd - a.trade_volume_usd : 
          a.trade_volume_usd - b.trade_volume_usd
        );
      }

    } else if (tab === 'shipments') {
      // Query real shipment data
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('unified_shipments')
        .select(`
          id,
          unified_company_name,
          mode,
          origin_country,
          destination_country,
          unified_value,
          weight_kg,
          unified_date,
          hs_code,
          carrier_name,
          commodity_description
        `)
        .order('unified_date', { ascending: false })
        .limit(100);

      if (shipmentError) {
        console.error('Error fetching shipments:', shipmentError);
        results = [];
      } else {
        results = shipmentData?.map(shipment => ({
          id: shipment.id,
           company: shipment.unified_company_name,
           mode: shipment.mode,
           origin: shipment.origin_country,
           destination: shipment.destination_country,
          value: shipment.unified_value ? `$${shipment.unified_value.toLocaleString()}` : null,
          weight: shipment.weight_kg ? `${shipment.weight_kg.toLocaleString()} kg` : null,
          confidence: null,
          date: shipment.unified_date,
          hs_code: shipment.hs_code,
          carrier: shipment.carrier_name,
          description: shipment.commodity_description
        })) || [];
      }

    } else if (tab === 'routes') {
      // No default route results
      results = [];

    } else if (tab === 'contacts') {
      // No default contact results
      results = [];
    }

    // Apply pagination only if pagination parameters are provided
    const total = results.length;
    const paginatedResults = pagination ? results.slice(
      pagination.offset, 
      pagination.offset + pagination.limit
    ) : results;

    console.log(`Search completed: ${total} results found`);

    return new Response(JSON.stringify({
      total,
      items: paginatedResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-run function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});