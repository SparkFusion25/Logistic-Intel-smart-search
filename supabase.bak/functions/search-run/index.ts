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

    // Extract new filter fields
    const {
      origin_zip,
      dest_zip,
      destination_zip,
      commodity
    } = filters || {};

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
      // Query ALL shipment tables for comprehensive search
      let results_unified = [];
      let results_ocean = [];
      let results_air = [];
      let results_trade = [];

      const searchTerm = q && q.trim() !== '' ? q.trim() : null;
      console.log(`Applying comprehensive search across all shipment tables for: ${searchTerm || 'ALL DATA'}`);

      // 1. Query unified_shipments
      let query_unified = supabase
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

      if (searchTerm) {
        query_unified = query_unified.or(`unified_company_name.ilike.%${searchTerm}%,hs_code.ilike.%${searchTerm}%,commodity_description.ilike.%${searchTerm}%,origin_country.ilike.%${searchTerm}%,destination_country.ilike.%${searchTerm}%,destination_city.ilike.%${searchTerm}%,destination_state.ilike.%${searchTerm}%,destination_zip.ilike.%${searchTerm}%,port_of_loading.ilike.%${searchTerm}%,port_of_discharge.ilike.%${searchTerm}%,carrier_name.ilike.%${searchTerm}%,shipper_name.ilike.%${searchTerm}%,consignee_name.ilike.%${searchTerm}%`);
      }

      if (filters?.mode && filters.mode !== 'all') {
        query_unified = query_unified.eq('mode', filters.mode);
      }

      // Apply additional filters
      if (filters?.origin_country) {
        query_unified = query_unified.ilike('origin_country', `%${filters.origin_country}%`);
      }
      if (filters?.dest_country) {
        query_unified = query_unified.ilike('destination_country', `%${filters.dest_country}%`);
      }
      if (filters?.origin_zip) {
        query_unified = query_unified.ilike('origin_zip', `%${filters.origin_zip}%`);
      }
      if (filters?.dest_zip) {
        query_unified = query_unified.ilike('destination_zip', `%${filters.dest_zip}%`);
      }
      if (filters?.hs_codes) {
        query_unified = query_unified.ilike('hs_code', `%${filters.hs_codes}%`);
      }
      if (filters?.commodity) {
        query_unified = query_unified.ilike('commodity_description', `%${filters.commodity}%`);
      }
      // Revenue Vessel filters
      if (filters?.importer_name) {
        query_unified = query_unified.ilike('importer_name', `%${filters.importer_name}%`);
      }
      if (filters?.carrier_name) {
        query_unified = query_unified.ilike('carrier_name', `%${filters.carrier_name}%`);
      }
      if (filters?.forwarder_name) {
        query_unified = query_unified.ilike('forwarder_name', `%${filters.forwarder_name}%`);
      }
      if (filters?.notify_party) {
        query_unified = query_unified.ilike('notify_party', `%${filters.notify_party}%`);
      }
      if (filters?.container_number) {
        query_unified = query_unified.ilike('container_number', `%${filters.container_number}%`);
      }
      if (filters?.master_bol_number) {
        query_unified = query_unified.ilike('master_bol_number', `%${filters.master_bol_number}%`);
      }
      if (filters?.house_bol_number) {
        query_unified = query_unified.ilike('house_bol_number', `%${filters.house_bol_number}%`);
      }
      if (filters?.vessel_name) {
        query_unified = query_unified.ilike('vessel_name', `%${filters.vessel_name}%`);
      }
      if (filters?.voyage_number) {
        query_unified = query_unified.ilike('voyage_number', `%${filters.voyage_number}%`);
      }
      if (filters?.container_types) {
        query_unified = query_unified.ilike('container_types', `%${filters.container_types}%`);
      }
      if (filters?.is_lcl && filters.is_lcl !== '') {
        query_unified = query_unified.eq('is_lcl', filters.is_lcl === 'true');
      }
      // Date filters
      if (filters?.shipment_date_from) {
        query_unified = query_unified.gte('unified_date', filters.shipment_date_from);
      }
      if (filters?.shipment_date_to) {
        query_unified = query_unified.lte('unified_date', filters.shipment_date_to);
      }
      if (filters?.arrival_date_from) {
        query_unified = query_unified.gte('arrival_date', filters.arrival_date_from);
      }
      if (filters?.arrival_date_to) {
        query_unified = query_unified.lte('arrival_date', filters.arrival_date_to);
      }
      if (filters?.dest_country) {
        query_unified = query_unified.ilike('destination_country', `%${filters.dest_country}%`);
      }
      if (origin_zip) {
        query_unified = query_unified.ilike('origin_zip', `%${origin_zip}%`);
      }
      if (dest_zip || destination_zip) {
        query_unified = query_unified.ilike('destination_zip', `%${dest_zip || destination_zip}%`);
      }
      if (filters?.hs_codes) {
        query_unified = query_unified.ilike('hs_code', `%${filters.hs_codes}%`);
      }
      if (commodity) {
        query_unified = query_unified.ilike('commodity_description', `%${commodity}%`);
      }

      const { data: unifiedData } = await query_unified.order('unified_date', { ascending: false }).limit(200);

      // 2. Query ocean_shipments
      let query_ocean = supabase
        .from('ocean_shipments')
        .select(`
          id,
          company_name,
          shipper_name,
          consignee_name,
          origin_country,
          destination_country,
          destination_city,
          destination_state,
          destination_zip,
          port_of_lading,
          port_of_unlading,
          value_usd,
          weight_kg,
          shipment_date,
          hs_code,
          vessel_name,
          commodity_description
        `);

      if (searchTerm) {
        query_ocean = query_ocean.or(`company_name.ilike.%${searchTerm}%,shipper_name.ilike.%${searchTerm}%,consignee_name.ilike.%${searchTerm}%,hs_code.ilike.%${searchTerm}%,commodity_description.ilike.%${searchTerm}%,origin_country.ilike.%${searchTerm}%,destination_country.ilike.%${searchTerm}%,destination_city.ilike.%${searchTerm}%,destination_state.ilike.%${searchTerm}%,destination_zip.ilike.%${searchTerm}%,port_of_lading.ilike.%${searchTerm}%,port_of_unlading.ilike.%${searchTerm}%,vessel_name.ilike.%${searchTerm}%`);
      }

      // Apply additional filters to ocean
      if (filters?.origin_country) {
        query_ocean = query_ocean.ilike('origin_country', `%${filters.origin_country}%`);
      }
      if (filters?.dest_country) {
        query_ocean = query_ocean.ilike('destination_country', `%${filters.dest_country}%`);
      }
      if (origin_zip) {
        query_ocean = query_ocean.ilike('origin_zip', `%${origin_zip}%`);
      }
      if (dest_zip || destination_zip) {
        query_ocean = query_ocean.ilike('destination_zip', `%${dest_zip || destination_zip}%`);
      }
      if (filters?.hs_codes) {
        query_ocean = query_ocean.ilike('hs_code', `%${filters.hs_codes}%`);
      }
      if (commodity) {
        query_ocean = query_ocean.ilike('commodity_description', `%${commodity}%`);
      }

      if (!filters?.mode || filters.mode === 'all' || filters.mode === 'ocean') {
        const { data: oceanData } = await query_ocean.order('shipment_date', { ascending: false }).limit(200);
        results_ocean = oceanData || [];
      }

      // 3. Query airfreight_shipments
      let query_air = supabase
        .from('airfreight_shipments')
        .select(`
          id,
          shipper_name,
          consignee_name,
          shipper_country,
          consignee_country,
          consignee_city,
          consignee_state,
          consignee_zip,
          port_of_lading,
          port_of_unlading,
          value_usd,
          weight_kg,
          departure_date,
          hs_code,
          carrier_name,
          commodity_description
        `);

      if (searchTerm) {
        query_air = query_air.or(`shipper_name.ilike.%${searchTerm}%,consignee_name.ilike.%${searchTerm}%,hs_code.ilike.%${searchTerm}%,commodity_description.ilike.%${searchTerm}%,shipper_country.ilike.%${searchTerm}%,consignee_country.ilike.%${searchTerm}%,consignee_city.ilike.%${searchTerm}%,consignee_state.ilike.%${searchTerm}%,consignee_zip.ilike.%${searchTerm}%,port_of_lading.ilike.%${searchTerm}%,port_of_unlading.ilike.%${searchTerm}%,carrier_name.ilike.%${searchTerm}%`);
      }

      // Apply additional filters to air
      if (filters?.origin_country) {
        query_air = query_air.ilike('shipper_country', `%${filters.origin_country}%`);
      }
      if (filters?.dest_country) {
        query_air = query_air.ilike('consignee_country', `%${filters.dest_country}%`);
      }
      if (origin_zip) {
        query_air = query_air.ilike('shipper_zip', `%${origin_zip}%`);
      }
      if (dest_zip || destination_zip) {
        query_air = query_air.ilike('consignee_zip', `%${dest_zip || destination_zip}%`);
      }
      if (filters?.hs_codes) {
        query_air = query_air.ilike('hs_code', `%${filters.hs_codes}%`);
      }
      if (commodity) {
        query_air = query_air.ilike('commodity_description', `%${commodity}%`);
      }

      if (!filters?.mode || filters.mode === 'all' || filters.mode === 'air') {
        const { data: airData } = await query_air.order('departure_date', { ascending: false }).limit(200);
        results_air = airData || [];
      }

      // 4. Query trade_shipments
      let query_trade = supabase
        .from('trade_shipments')
        .select(`
          id,
          inferred_company_name,
          shipper_name,
          consignee_name,
          origin_country,
          destination_country,
          destination_city,
          destination_state,
          destination_zip,
          port_of_loading,
          port_of_discharge,
          value_usd,
          weight_kg,
          shipment_date,
          hs_code,
          vessel_name,
          commodity_description,
          shipment_type
        `);

      if (searchTerm) {
        query_trade = query_trade.or(`inferred_company_name.ilike.%${searchTerm}%,shipper_name.ilike.%${searchTerm}%,consignee_name.ilike.%${searchTerm}%,hs_code.ilike.%${searchTerm}%,commodity_description.ilike.%${searchTerm}%,origin_country.ilike.%${searchTerm}%,destination_country.ilike.%${searchTerm}%,destination_city.ilike.%${searchTerm}%,destination_state.ilike.%${searchTerm}%,destination_zip.ilike.%${searchTerm}%,port_of_loading.ilike.%${searchTerm}%,port_of_discharge.ilike.%${searchTerm}%,vessel_name.ilike.%${searchTerm}%`);
      }

      // Apply additional filters to trade
      if (filters?.origin_country) {
        query_trade = query_trade.ilike('origin_country', `%${filters.origin_country}%`);
      }
      if (filters?.dest_country) {
        query_trade = query_trade.ilike('destination_country', `%${filters.dest_country}%`);
      }
      if (origin_zip) {
        query_trade = query_trade.ilike('origin_zip', `%${origin_zip}%`);
      }
      if (dest_zip || destination_zip) {
        query_trade = query_trade.ilike('destination_zip', `%${dest_zip || destination_zip}%`);
      }
      if (filters?.hs_codes) {
        query_trade = query_trade.ilike('hs_code', `%${filters.hs_codes}%`);
      }
      if (commodity) {
        query_trade = query_trade.ilike('commodity_description', `%${commodity}%`);
      }

      if (filters?.mode && filters.mode !== 'all') {
        query_trade = query_trade.eq('shipment_type', filters.mode);
      }

      const { data: tradeData } = await query_trade.order('shipment_date', { ascending: false }).limit(200);
      results_trade = tradeData || [];

      // Combine and normalize all results
      results_unified = (unifiedData || []).map(shipment => ({
        id: `unified_${shipment.id}`,
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
        date: shipment.unified_date,
        hs_code: shipment.hs_code,
        carrier: shipment.carrier_name,
        description: shipment.commodity_description,
        shipper: shipment.shipper_name,
        consignee: shipment.consignee_name,
        source: 'unified'
      }));

      const ocean_results = results_ocean.map(shipment => ({
        id: `ocean_${shipment.id}`,
        company: shipment.company_name,
        mode: 'ocean',
        origin: shipment.origin_country,
        destination: shipment.destination_country,
        destination_city: shipment.destination_city,
        destination_state: shipment.destination_state,
        destination_zip: shipment.destination_zip,
        port_of_loading: shipment.port_of_lading,
        port_of_discharge: shipment.port_of_unlading,
        value: shipment.value_usd ? `$${shipment.value_usd.toLocaleString()}` : null,
        weight: shipment.weight_kg ? `${shipment.weight_kg.toLocaleString()} kg` : null,
        date: shipment.shipment_date,
        hs_code: shipment.hs_code,
        carrier: shipment.vessel_name,
        description: shipment.commodity_description,
        shipper: shipment.shipper_name,
        consignee: shipment.consignee_name,
        source: 'ocean'
      }));

      const air_results = results_air.map(shipment => ({
        id: `air_${shipment.id}`,
        company: shipment.consignee_name || shipment.shipper_name,
        mode: 'air',
        origin: shipment.shipper_country,
        destination: shipment.consignee_country,
        destination_city: shipment.consignee_city,
        destination_state: shipment.consignee_state,
        destination_zip: shipment.consignee_zip,
        port_of_loading: shipment.port_of_lading,
        port_of_discharge: shipment.port_of_unlading,
        value: shipment.value_usd ? `$${shipment.value_usd.toLocaleString()}` : null,
        weight: shipment.weight_kg ? `${shipment.weight_kg.toLocaleString()} kg` : null,
        date: shipment.departure_date,
        hs_code: shipment.hs_code,
        carrier: shipment.carrier_name,
        description: shipment.commodity_description,
        shipper: shipment.shipper_name,
        consignee: shipment.consignee_name,
        source: 'air'
      }));

      const trade_results = results_trade.map(shipment => ({
        id: `trade_${shipment.id}`,
        company: shipment.inferred_company_name,
        mode: shipment.shipment_type || 'ocean',
        origin: shipment.origin_country,
        destination: shipment.destination_country,
        destination_city: shipment.destination_city,
        destination_state: shipment.destination_state,
        destination_zip: shipment.destination_zip,
        port_of_loading: shipment.port_of_loading,
        port_of_discharge: shipment.port_of_discharge,
        value: shipment.value_usd ? `$${shipment.value_usd.toLocaleString()}` : null,
        weight: shipment.weight_kg ? `${shipment.weight_kg.toLocaleString()} kg` : null,
        date: shipment.shipment_date,
        hs_code: shipment.hs_code,
        carrier: shipment.vessel_name,
        description: shipment.commodity_description,
        shipper: shipment.shipper_name,
        consignee: shipment.consignee_name,
        source: 'trade'
      }));

      // Combine all results and sort by date
      results = [...results_unified, ...ocean_results, ...air_results, ...trade_results]
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

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