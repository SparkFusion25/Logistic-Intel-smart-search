import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEFAULT_STAGES = [
  "Prospect Identified",
  "Contacted",
  "Engaged",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? '',
      Deno.env.get("SUPABASE_ANON_KEY") ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization") ?? "",
          },
        },
      }
    );

    // 1) Who am I? (RLS context)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2) Resolve org
    const { data: me, error: meErr } = await supabase
      .from("users")
      .select("org_id")
      .eq("id", user.id)
      .single();
    
    if (meErr || !me?.org_id) {
      return new Response(JSON.stringify({ success: false, error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3) Do I already have a pipeline?
    const { data: existing } = await supabase
      .from("pipelines")
      .select("id, name")
      .eq("org_id", me.org_id)
      .order("created_at", { ascending: true })
      .limit(1);

    // If none, create Default pipeline + 7 stages
    if (!existing || existing.length === 0) {
      const { data: inserted, error: insErr } = await supabase
        .from("pipelines")
        .insert({ org_id: me.org_id, name: "Default" })
        .select("id")
        .single();
      
      if (insErr) {
        return new Response(JSON.stringify({ success: false, error: insErr.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const rows = DEFAULT_STAGES.map((name, i) => ({
        org_id: me.org_id,
        pipeline_id: inserted.id,
        name,
        stage_order: i + 1,
      }));
      
      const { error: stErr } = await supabase.from("pipeline_stages").insert(rows);
      if (stErr) {
        return new Response(JSON.stringify({ success: false, error: stErr.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, seeded: true, pipeline_id: inserted.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If at least one pipeline exists, ensure it has all seven (idempotent)
    const pipelineId = existing[0].id;
    const { data: stages } = await supabase
      .from("pipeline_stages")
      .select("id, name, stage_order")
      .eq("org_id", me.org_id)
      .eq("pipeline_id", pipelineId);

    const missing = DEFAULT_STAGES.filter(s => !stages?.some(x => x.name === s));
    if (missing.length) {
      const startOrder = (stages?.length ?? 0) + 1;
      const rows = missing.map((name, idx) => ({
        org_id: me.org_id,
        pipeline_id: pipelineId,
        name,
        stage_order: startOrder + idx,
      }));
      
      const { error: addErr } = await supabase.from("pipeline_stages").insert(rows);
      if (addErr) {
        return new Response(JSON.stringify({ success: false, error: addErr.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ success: true, seeded: false, pipeline_id: pipelineId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (e) {
    console.error('Error in crm-seed-pipeline function:', e);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});