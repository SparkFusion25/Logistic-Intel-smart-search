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

    const orgId = user.id;

    // GET: List stages for a pipeline
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const pipelineId = url.searchParams.get('pipeline_id');

      if (!pipelineId) {
        return new Response(JSON.stringify({ success: false, error: 'pipeline_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: stages, error } = await supabase
        .from("pipeline_stages")
        .select("*")
        .eq("org_id", orgId)
        .eq("pipeline_id", pipelineId)
        .order("stage_order", { ascending: true });

      if (error) {
        console.error('Stage query error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, data: stages ?? [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST: Create new stage
    if (req.method === 'POST') {
      const body = await req.json();
      const { pipeline_id, name, stage_order } = body;

      if (!pipeline_id || !name) {
        return new Response(JSON.stringify({ success: false, error: 'pipeline_id and name are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Verify pipeline ownership
      const { data: pipeline, error: pipelineError } = await supabase
        .from("pipelines")
        .select("id")
        .eq("id", pipeline_id)
        .eq("org_id", orgId)
        .single();

      if (pipelineError || !pipeline) {
        return new Response(JSON.stringify({ success: false, error: 'Pipeline not found or access denied' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // If no stage_order provided, get the next order
      let finalStageOrder = stage_order;
      if (!stage_order) {
        const { data: lastStage } = await supabase
          .from("pipeline_stages")
          .select("stage_order")
          .eq("pipeline_id", pipeline_id)
          .eq("org_id", orgId)
          .order("stage_order", { ascending: false })
          .limit(1);

        finalStageOrder = (lastStage?.[0]?.stage_order ?? 0) + 1;
      }

      const { data: newStage, error: insertError } = await supabase
        .from("pipeline_stages")
        .insert({
          org_id: orgId,
          pipeline_id,
          name,
          stage_order: finalStageOrder
        })
        .select("*")
        .single();

      if (insertError) {
        console.error('Stage insert error:', insertError);
        return new Response(JSON.stringify({ success: false, error: insertError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, data: newStage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT: Update existing stage
    if (req.method === 'PUT') {
      const body = await req.json();
      const { stage_id, name, stage_order } = body;

      if (!stage_id) {
        return new Response(JSON.stringify({ success: false, error: 'stage_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (stage_order !== undefined) updateData.stage_order = stage_order;

      const { data: updatedStage, error: updateError } = await supabase
        .from("pipeline_stages")
        .update(updateData)
        .eq("id", stage_id)
        .eq("org_id", orgId)
        .select("*")
        .single();

      if (updateError) {
        console.error('Stage update error:', updateError);
        return new Response(JSON.stringify({ success: false, error: updateError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, data: updatedStage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE: Remove stage
    if (req.method === 'DELETE') {
      const body = await req.json();
      const { stage_id } = body;

      if (!stage_id) {
        return new Response(JSON.stringify({ success: false, error: 'stage_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if stage has any deals
      const { data: dealsInStage, error: dealsError } = await supabase
        .from("deals")
        .select("id")
        .eq("stage_id", stage_id)
        .eq("org_id", orgId)
        .limit(1);

      if (dealsError) {
        console.error('Deals check error:', dealsError);
        return new Response(JSON.stringify({ success: false, error: 'Failed to check deals in stage' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (dealsInStage && dealsInStage.length > 0) {
        return new Response(JSON.stringify({ success: false, error: 'Cannot delete stage with existing deals' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error: deleteError } = await supabase
        .from("pipeline_stages")
        .delete()
        .eq("id", stage_id)
        .eq("org_id", orgId);

      if (deleteError) {
        console.error('Stage delete error:', deleteError);
        return new Response(JSON.stringify({ success: false, error: deleteError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, message: 'Stage deleted successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in crm-stages function:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});