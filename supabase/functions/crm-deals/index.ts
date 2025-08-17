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

    // Use auth.uid() directly as org_id for simplicity
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

      // Validate stage belongs to this org
      let stageId = body?.stage_id as string | undefined;
      let pipelineId = body?.pipeline_id as string | undefined;

      if (!stageId || !pipelineId) {
        // default to first stage of 'Default' pipeline
        const { data: pipelines } = await supabase
          .from("pipelines")
          .select("id, name, pipeline_stages(id, stage_order)")
          .eq("org_id", orgId)
          .order("name", { ascending: true })
          .order("stage_order", { referencedTable: "pipeline_stages", ascending: true });

        const first = pipelines?.[0];
        stageId = stageId ?? first?.pipeline_stages?.[0]?.id;
        pipelineId = pipelineId ?? first?.id;
      }

      if (!stageId || !pipelineId) {
        return new Response(JSON.stringify({ success: false, error: "No pipeline/stage available" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Ensure provided stage exists for this org
      const { data: stg } = await supabase
        .from("pipeline_stages")
        .select("id, pipeline_id")
        .eq("id", stageId)
        .eq("org_id", orgId)
        .single();
      
      if (!stg) {
        return new Response(JSON.stringify({ success: false, error: "Invalid stage" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // If client sent pipeline_id, ensure it matches the stage's pipeline
      if (pipelineId && pipelineId !== stg.pipeline_id) {
        return new Response(JSON.stringify({ success: false, error: "Stage does not belong to given pipeline" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const payload = {
        org_id: orgId,
        pipeline_id: stg.pipeline_id,
        stage_id: stg.id,
        contact_id: body.contact_id && body.contact_id !== "1" ? body.contact_id : null,
        company_name: body.company_name ?? null,
        title: body.title ?? "Untitled Deal",
        value_usd: body.value_usd ?? null,
        currency: body.currency ?? "USD",
        expected_close_date: body.expected_close_date ?? null,
        status: "open",
        created_by: user.id
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