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
    if (req.method !== 'GET') {
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

    const orgId = user.id;
    const url = new URL(req.url);
    const pipelineId = url.searchParams.get('pipeline_id');
    const timeRange = url.searchParams.get('range') || '30'; // days

    if (!pipelineId) {
      return new Response(JSON.stringify({ success: false, error: 'pipeline_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));

    // Get pipeline stages
    const { data: stages, error: stagesError } = await supabase
      .from("pipeline_stages")
      .select("*")
      .eq("org_id", orgId)
      .eq("pipeline_id", pipelineId)
      .order("stage_order", { ascending: true });

    if (stagesError) {
      console.error('Stages query error:', stagesError);
      return new Response(JSON.stringify({ success: false, error: stagesError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get deals by stage
    const { data: deals, error: dealsError } = await supabase
      .from("deals")
      .select("id, stage_id, value_usd, created_at, updated_at, status")
      .eq("org_id", orgId)
      .eq("pipeline_id", pipelineId)
      .gte("created_at", cutoffDate.toISOString());

    if (dealsError) {
      console.error('Deals query error:', dealsError);
      return new Response(JSON.stringify({ success: false, error: dealsError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate analytics
    const analytics = {
      totalDeals: deals?.length || 0,
      totalValue: deals?.reduce((sum, deal) => sum + (deal.value_usd || 0), 0) || 0,
      stageMetrics: [] as any[],
      conversionRates: {} as any,
      avgDealVelocity: 0, // days
      winRate: 0
    };

    // Stage metrics
    if (stages) {
      analytics.stageMetrics = stages.map(stage => {
        const stageDeals = deals?.filter(deal => deal.stage_id === stage.id) || [];
        const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.value_usd || 0), 0);
        
        return {
          stageId: stage.id,
          stageName: stage.name,
          stageOrder: stage.stage_order,
          dealCount: stageDeals.length,
          totalValue: stageValue,
          avgDealSize: stageDeals.length > 0 ? stageValue / stageDeals.length : 0
        };
      });

      // Calculate conversion rates between stages
      for (let i = 0; i < stages.length - 1; i++) {
        const currentStage = stages[i];
        const nextStage = stages[i + 1];
        
        const currentStageDeals = analytics.stageMetrics[i].dealCount;
        const nextStageDeals = analytics.stageMetrics[i + 1].dealCount;
        
        const conversionRate = currentStageDeals > 0 ? (nextStageDeals / currentStageDeals) * 100 : 0;
        
        analytics.conversionRates[`${currentStage.name}_to_${nextStage.name}`] = {
          fromStage: currentStage.name,
          toStage: nextStage.name,
          rate: Math.round(conversionRate * 100) / 100
        };
      }
    }

    // Calculate win rate (assuming "Won" is a final stage)
    const wonDeals = deals?.filter(deal => 
      stages?.find(stage => stage.id === deal.stage_id && stage.name.toLowerCase().includes('won'))
    ) || [];
    const lostDeals = deals?.filter(deal => 
      stages?.find(stage => stage.id === deal.stage_id && stage.name.toLowerCase().includes('lost'))
    ) || [];
    
    const closedDeals = wonDeals.length + lostDeals.length;
    analytics.winRate = closedDeals > 0 ? Math.round((wonDeals.length / closedDeals) * 100 * 100) / 100 : 0;

    // Calculate average deal velocity (simple version - from creation to current state)
    if (deals && deals.length > 0) {
      const velocities = deals.map(deal => {
        const created = new Date(deal.created_at);
        const updated = new Date(deal.updated_at);
        return Math.abs(updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // days
      });
      
      analytics.avgDealVelocity = Math.round(
        (velocities.reduce((sum, vel) => sum + vel, 0) / velocities.length) * 100
      ) / 100;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: analytics,
      timeRange: `${timeRange} days`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in crm-pipeline-analytics function:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});