import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client using anon key and user's JWT
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization') ?? '',
          },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ success: false, error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orgId = user.id;

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const pipelineId = url.searchParams.get("pipelineId");
      const stageId = url.searchParams.get("stageId");
      const q = url.searchParams.get("q");
      const limit = Number(url.searchParams.get("limit") ?? 50);
      const offset = Number(url.searchParams.get("offset") ?? 0);

      let query = supabase
        .from("deals")
        .select("id, title, company_name, value_usd, currency, expected_close_date, status, stage_id, contact_id, created_at, updated_at, crm_contacts(full_name, email, company_name)")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (pipelineId) query = query.eq("pipeline_id", pipelineId);
      if (stageId) query = query.eq("stage_id", stageId);
      if (q) query = query.ilike("title", `%${q}%`);

      const { data, error, count } = await query;
      if (error) {
        console.error('Query error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, data: data ?? [], total: count ?? data?.length ?? 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      console.log('Creating deal with data:', body);

      const payload = {
        org_id: orgId,
        pipeline_id: body.pipelineId,
        stage_id: body.stageId,
        contact_id: body.contact_id ?? null,
        company_name: body.company_name ?? null,
        title: body.title ?? "Untitled Deal",
        value_usd: body.value_usd ?? null,
        currency: body.currency ?? "USD",
        expected_close_date: body.expected_close_date ?? null,
        created_by: orgId
      };

      console.log('Inserting deal payload:', payload);

      const { data, error } = await supabase
        .from("deals")
        .insert(payload)
        .select("id, title, company_name, value_usd, stage_id")
        .maybeSingle();

      if (error) {
        console.error('Insert error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Deal created successfully:', data);
      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in crm-deals function:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});