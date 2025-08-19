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
      // Query real data from companies table with comprehensive search
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

      // Apply comprehensive search filter - supports empty queries to show all data
      if (q && q.trim() !== '') {
        const searchTerm = q.trim();
        console.log(`Applying comprehensive company search for: ${searchTerm}`);
        
        // Search across all relevant company fields
        query = query.or(`company_name.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%`);
      }

      const { data: companyData, error: companyError } = await query
        .order('total_shipments', { ascending: false })
        .limit(200);

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

    } else if (tab === 'shipments') {
      // Query unified_shipments with comprehensive search across all sources
      let query = supabase
        .from('unified_shipments')
        .select(`
          id,
          unified_company_name,
          mode,
          origin_country,
          destination_country,
          destination_city,
          destination_state,
          destination_zip,
          port_of_loading,
          port_of_discharge,
          unified_value,
          weight_kg,
          unified_date,
          hs_code,
          carrier_name,
          commodity_description,
          shipper_name,
          consignee_name
        `);

      // Apply comprehensive search - supports empty queries to show all data
      if (q && q.trim() !== '') {
        const searchTerm = q.trim();
        console.log(`Applying comprehensive shipments search for: ${searchTerm}`);
        
        // Search across all shipment fields including origin, destination, commodity, HS codes, zip codes
        query = query.or(`unified_company_name.ilike.%${searchTerm}%,hs_code.ilike.%${searchTerm}%,commodity_description.ilike.%${searchTerm}%,origin_country.ilike.%${searchTerm}%,destination_country.ilike.%${searchTerm}%,destination_city.ilike.%${searchTerm}%,destination_state.ilike.%${searchTerm}%,destination_zip.ilike.%${searchTerm}%,port_of_loading.ilike.%${searchTerm}%,port_of_discharge.ilike.%${searchTerm}%,carrier_name.ilike.%${searchTerm}%,shipper_name.ilike.%${searchTerm}%,consignee_name.ilike.%${searchTerm}%`);
      }

      // Apply mode filter if specified (ocean/air)
      if (filters?.mode && filters.mode !== 'all') {
        query = query.eq('mode', filters.mode);
      }

      const { data: shipmentData, error: shipmentError } = await query
        .order('unified_date', { ascending: false })
        .limit(500);

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
          destination_city: shipment.destination_city,
          destination_state: shipment.destination_state,
          destination_zip: shipment.destination_zip,
          port_of_loading: shipment.port_of_loading,
          port_of_discharge: shipment.port_of_discharge,
          value: shipment.unified_value ? `$${shipment.unified_value.toLocaleString()}` : null,
          weight: shipment.weight_kg ? `${shipment.weight_kg.toLocaleString()} kg` : null,
          confidence: null,
          date: shipment.unified_date,
          hs_code: shipment.hs_code,
          carrier: shipment.carrier_name,
          description: shipment.commodity_description,
          shipper: shipment.shipper_name,
          consignee: shipment.consignee_name
        })) || [];
      }

    } else if (tab === 'routes') {
      // Query route data from unified_shipments with comprehensive search
      let query = supabase
        .from('unified_shipments')
        .select(`
          origin_country,
          destination_country,
          destination_city,
          destination_state,
          mode,
          carrier_name,
          port_of_loading,
          port_of_discharge
        `);

      // Support comprehensive route search including cities, states, ports
      if (q && q.trim() !== '') {
        const searchTerm = q.trim();
        query = query.or(`origin_country.ilike.%${searchTerm}%,destination_country.ilike.%${searchTerm}%,destination_city.ilike.%${searchTerm}%,destination_state.ilike.%${searchTerm}%,port_of_loading.ilike.%${searchTerm}%,port_of_discharge.ilike.%${searchTerm}%,carrier_name.ilike.%${searchTerm}%`);
      }

      // Apply mode filter for routes
      if (filters?.mode && filters.mode !== 'all') {
        query = query.eq('mode', filters.mode);
      }

      const { data: routeData, error: routeError } = await query.limit(300);

      if (routeError) {
        console.error('Error fetching routes:', routeError);
        results = [];
      } else {
        // Group by route and create route summaries
        const routeGroups = routeData?.reduce((acc, item) => {
          const key = `${item.origin_country}-${item.destination_country}-${item.mode}`;
          if (!acc[key]) {
            acc[key] = {
              origin: item.origin_country,
              destination: item.destination_country,
              mode: item.mode,
              carrier: item.carrier_name,
              count: 0
            };
          }
          acc[key].count++;
          return acc;
        }, {} as any) || {};

        results = Object.values(routeGroups).map((route: any) => ({
          id: `${route.origin}-${route.destination}-${route.mode}`,
          origin: route.origin,
          destination: route.destination,
          mode: route.mode,
          carrier: route.carrier,
          shipment_count: route.count,
          trade_volume: null,
          frequency: route.count > 10 ? 'High' : route.count > 5 ? 'Medium' : 'Low'
        }));
      }

    } else if (tab === 'contacts') {
      // Query contacts from CRM system with comprehensive search
      let query = supabase
        .from('crm_contacts')
        .select(`
          id,
          company_name,
          full_name,
          email,
          title,
          country,
          city,
          linkedin,
          phone,
          industry,
          source
        `);

      // Support comprehensive contact search across all fields
      if (q && q.trim() !== '') {
        const searchTerm = q.trim();
        query = query.or(`company_name.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      const { data: contactData, error: contactError } = await query
        .order('created_at', { ascending: false })
        .limit(200);

      if (contactError) {
        console.error('Error fetching contacts:', contactError);
        results = [];
      } else {
        results = contactData?.map(contact => ({
          id: contact.id,
          name: contact.full_name,
          company: contact.company_name,
          email: contact.email,
          title: contact.title,
          location: contact.city && contact.country ? `${contact.city}, ${contact.country}` : contact.country,
          linkedin: contact.linkedin,
          phone: contact.phone
        })) || [];
      }
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