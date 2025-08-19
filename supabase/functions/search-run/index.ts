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
      tab = 'companies', 
      filters = {}, 
      pagination = { limit: 20, offset: 0 }, 
      sort = { field: 'shipment_count', dir: 'desc' }
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
      // Query real data from unified_shipments table with search filtering
      let query = supabase
        .from('unified_shipments')
        .select(`
          unified_company_name,
          shipper_name,
          consignee_name,
          origin_country,
          destination_country,
          destination_city,
          destination_state,
          unified_date,
          unified_value,
          mode,
          bol_number,
          bill_of_lading_number,
          consignee_city,
          consignee_state_region,
          shipper_city,
          shipper_state_region
        `);

      // Apply search filter if query provided
      if (q && q.trim() !== '') {
        const searchTerm = q.trim();
        console.log(`Applying search filter for: ${searchTerm}`);
        
        query = query.or(`
          unified_company_name.ilike.%${searchTerm}%,
          shipper_name.ilike.%${searchTerm}%,
          consignee_name.ilike.%${searchTerm}%,
          bol_number.ilike.%${searchTerm}%,
          bill_of_lading_number.ilike.%${searchTerm}%,
          origin_country.ilike.%${searchTerm}%,
          destination_country.ilike.%${searchTerm}%,
          destination_city.ilike.%${searchTerm}%,
          destination_state.ilike.%${searchTerm}%,
          consignee_city.ilike.%${searchTerm}%,
          consignee_state_region.ilike.%${searchTerm}%,
          shipper_city.ilike.%${searchTerm}%,
          shipper_state_region.ilike.%${searchTerm}%
        `);
      }

      const { data: shipmentData, error: shipmentError } = await query
        .order('unified_date', { ascending: false })
        .limit(1000);

      if (shipmentError) {
        console.error('Error fetching shipment data:', shipmentError);
        // Fall back to empty results on error
        results = [];
      } else {
        // Group by company and aggregate data
        const companyMap = new Map();
        
        shipmentData?.forEach(shipment => {
          const companyName = shipment.unified_company_name;
          if (!companyMap.has(companyName)) {
            companyMap.set(companyName, {
              company_id: companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              name: companyName,
              location: shipment.origin_country || shipment.destination_country || null,
              industry: null,
              shipment_count: 0,
              last_shipment_at: shipment.unified_date,
              trade_volume_usd: 0,
              confidence: null,
              trend: null,
              logo_url: null
            });
          }
          
          const company = companyMap.get(companyName);
          company.shipment_count += 1;
          company.trade_volume_usd += shipment.unified_value || 0;
          
          // Update last shipment date if newer
          if (shipment.unified_date > company.last_shipment_at) {
            company.last_shipment_at = shipment.unified_date;
          }
        });

        // Convert to array and sort by trade volume
        results = Array.from(companyMap.values())
          .sort((a, b) => b.trade_volume_usd - a.trade_volume_usd)
          .slice(0, 50); // Limit to top 50 companies
      }

      // **REMOVED**: No default filtering applied

      // Apply sorting
      if (sort.field === 'trade_volume') {
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
      // Mock route results
      results = [
        {
          route: 'China → United States',
          volume: '$125.8B',
          count: 45720,
          share: '38%'
        },
        {
          route: 'Germany → United States', 
          volume: '$89.2B',
          count: 28150,
          share: '27%'
        }
      ];

    } else if (tab === 'contacts') {
      // Mock contact results (plan-gated)
      results = [
        {
          id: 1,
          company_name: 'Apple Inc',
          full_name: 'Sarah Chen',
          title: 'VP of Procurement',
          email: null, // Gated for pro/enterprise
          phone: null, // Gated for pro/enterprise
          linkedin: 'https://linkedin.com/in/sarah-chen',
          country: 'US',
          city: 'Cupertino',
          last_verified_at: new Date().toISOString(),
          confidence: 95
        }
      ];
    }

    // Apply pagination
    const total = results.length;
    const paginatedResults = results.slice(
      pagination.offset, 
      pagination.offset + pagination.limit
    );

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