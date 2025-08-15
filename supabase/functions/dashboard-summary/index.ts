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

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
    const { data: authUser, error: authError } = await supabase.auth.getUser(authHeader);

    if (authError || !authUser.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const range = url.searchParams.get('range') ?? '30d';

    console.log('Dashboard summary request:', { range, user: authUser.user.id });

    // Calculate date range
    const now = new Date();
    let dateFrom: Date;
    
    switch (range) {
      case '7d':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default: // 30d
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get user's org_id
    const { data: userData } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', authUser.user.id)
      .maybeSingle();

    const orgId = userData?.org_id;

    // Fetch dashboard metrics
    let searchCount = 0;
    let contactCount = 0;
    let campaignCount = 0;

    if (orgId) {
      // Get search count
      const { count: searches } = await supabase
        .from('search_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.user.id)
        .gte('created_at', dateFrom.toISOString());
      
      searchCount = searches ?? 0;

      // Get contact count
      const { count: contacts } = await supabase
        .from('crm_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .gte('created_at', dateFrom.toISOString());
      
      contactCount = contacts ?? 0;

      // Get campaign count
      const { count: campaigns } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .gte('created_at', dateFrom.toISOString());
      
      campaignCount = campaigns ?? 0;
    }

    // Mock aggregated data for shipments (would come from trade data in real implementation)
    const shipmentData = {
      ocean_shipments: 891000,
      air_cargo: 124000,
      total_trade_volume: 4200000000
    };

    const summary = {
      usage: {
        searches_performed: searchCount,
        contacts_added: contactCount,
        campaigns_created: campaignCount,
        range: range
      },
      shipment_aggregates: shipmentData,
      top_countries: [
        { name: 'China', code: 'CN', share: 42.3 },
        { name: 'United States', code: 'US', share: 18.7 },
        { name: 'Germany', code: 'DE', share: 12.4 },
        { name: 'Japan', code: 'JP', share: 8.9 },
        { name: 'United Kingdom', code: 'GB', share: 6.2 }
      ]
    };

    console.log('Dashboard summary completed');

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in dashboard-summary function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});