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
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use auth.uid() directly as org_id for simplicity
    const orgId = user.id;

    const body = await req.json();
    const dealId = String(body?.deal_id ?? body?.id ?? body?.dealId ?? "");
    const stageId = String(body?.stage_id ?? "");

    if (!dealId || !stageId) {
      return new Response(JSON.stringify({ success: false, error: 'Missing deal_id or stage_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: deal } = await supabase
      .from("deals")
      .select("id, org_id, pipeline_id, stage_id")
      .eq("id", dealId)
      .eq("org_id", orgId)
      .single();
    
    if (!deal) {
      return new Response(JSON.stringify({ success: false, error: 'Deal not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: stage } = await supabase
      .from("pipeline_stages")
      .select("id, pipeline_id")
      .eq("id", stageId)
      .eq("org_id", orgId)
      .single();
    
    if (!stage) {
      return new Response(JSON.stringify({ success: false, error: 'Stage not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ensure target stage is within the same pipeline as the deal
    if (stage.pipeline_id !== deal.pipeline_id) {
      return new Response(JSON.stringify({ success: false, error: 'Stage pipeline mismatch' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { error: updErr } = await supabase
      .from("deals")
      .update({ stage_id: stage.id })
      .eq("id", deal.id)
      .eq("org_id", orgId);

    if (updErr) {
      return new Response(JSON.stringify({ success: false, error: updErr.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in crm-deal-move function:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});