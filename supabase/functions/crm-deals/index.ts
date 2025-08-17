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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get user from JWT token in Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create client with the user's token for auth context
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Authentication failed' }), {
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

      let query = userClient
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

      const { data, error } = await userClient
        .from("deals")
        .insert(payload)
        .select("id, title, company_name, value_usd, stage_id")
        .single();

      if (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

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
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});