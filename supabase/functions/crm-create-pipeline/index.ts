import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { name } = await req.json()
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Pipeline name is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Creating pipeline "${name}" for user ${user.id}`)

    // Create the pipeline
    const { data: pipeline, error: pipelineError } = await supabaseClient
      .from('crm_pipelines')
      .insert({
        name: name.trim(),
        user_id: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (pipelineError) {
      console.error('Pipeline creation error:', pipelineError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create pipeline' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Pipeline created:', pipeline)

    // Create default stages for the new pipeline
    const defaultStages = [
      { name: 'Prospect Identified', stage_order: 1 },
      { name: 'Contacted', stage_order: 2 },
      { name: 'Engaged', stage_order: 3 },
      { name: 'Qualified', stage_order: 4 },
      { name: 'Proposal Sent', stage_order: 5 },
      { name: 'Won', stage_order: 6 },
      { name: 'Lost', stage_order: 7 }
    ]

    const stagesToInsert = defaultStages.map(stage => ({
      ...stage,
      pipeline_id: pipeline.id,
      created_at: new Date().toISOString()
    }))

    const { data: stages, error: stagesError } = await supabaseClient
      .from('crm_pipeline_stages')
      .insert(stagesToInsert)
      .select()

    if (stagesError) {
      console.error('Stages creation error:', stagesError)
      // Clean up the pipeline if stages failed
      await supabaseClient
        .from('crm_pipelines')
        .delete()
        .eq('id', pipeline.id)
      
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create pipeline stages' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Stages created:', stages)

    return new Response(
      JSON.stringify({ 
        success: true, 
        pipeline: {
          ...pipeline,
          stages: stages
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})