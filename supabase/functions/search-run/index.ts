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
      // Mock company search results based on Phase 11 spec
      results = [
        {
          company_id: '1',
          name: 'Samsung Electronics Co Ltd',
          location: 'Seoul, KR',
          industry: 'Consumer Electronics',
          shipment_count: 12847,
          last_shipment_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          trade_volume_usd: 2400000000,
          confidence: 98,
          trend: 'up',
          logo_url: null
        },
        {
          company_id: '2',
          name: 'Apple Inc',
          location: 'Cupertino, CA, US',
          industry: 'Technology Hardware',
          shipment_count: 9234,
          last_shipment_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          trade_volume_usd: 1800000000,
          confidence: 96,
          trend: 'up',
          logo_url: null
        },
        {
          company_id: '3',
          name: 'Tesla Inc',
          location: 'Austin, TX, US',
          industry: 'Automotive',
          shipment_count: 6891,
          last_shipment_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          trade_volume_usd: 1200000000,
          confidence: 94,
          trend: 'up',
          logo_url: null
        }
      ];

      // Apply simple filtering
      if (filters.origin_country) {
        results = results.filter(r => r.location.includes(filters.origin_country));
      }
      if (filters.entity && filters.entity !== 'all') {
        // Mock entity filtering
      }

      // Apply sorting
      if (sort.field === 'trade_volume') {
        results.sort((a, b) => sort.dir === 'desc' ? 
          b.trade_volume_usd - a.trade_volume_usd : 
          a.trade_volume_usd - b.trade_volume_usd
        );
      }

    } else if (tab === 'shipments') {
      // Mock shipment results
      results = [
        {
          id: 1,
          company: 'Apple Inc',
          mode: 'air',
          origin: 'Shanghai, CN',
          destination: 'Los Angeles, US',
          value: '$2,400,000',
          weight: '24,500 kg',
          confidence: 95,
          date: '2025-08-15',
          hs_code: '8471.60',
          carrier: 'FedEx Express',
          description: 'Computer parts and accessories'
        }
      ];

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