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
    console.log('🔧 Edge Function: crm-add-from-search called')
    console.log('🔧 Edge Function: Method:', req.method)
    
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
    console.log('🔧 Edge Function: Getting authenticated user')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      console.error('🔧 Edge Function: Authentication error:', authError)
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log('🔧 Edge Function: User authenticated:', user.id)

    const requestBody = await req.json()
    console.log('🔧 Edge Function: Request body:', requestBody)
    
    const { company, pipeline_name, stage_name, source } = requestBody
    
    if (!company || !company.name) {
      console.log('🔧 Edge Function: Missing company data')
      return new Response(
        JSON.stringify({ success: false, error: 'Company data is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`🔧 Edge Function: Adding company "${company.name}" to CRM pipeline "${pipeline_name}" from ${source}`)

    const defaultStages = [
      { name: 'Prospect Identified', stage_order: 1 },
      { name: 'Initial Contact', stage_order: 2 },
      { name: 'Qualified Lead', stage_order: 3 },
      { name: 'Proposal Sent', stage_order: 4 },
      { name: 'Negotiation', stage_order: 5 },
      { name: 'Won', stage_order: 6 },
      { name: 'Lost', stage_order: 7 }
    ]

    // Get or create the specified pipeline with stages in a single transaction
    console.log('🔧 Edge Function: Looking for pipeline:', pipeline_name || 'Search Intelligence')
    
    let pipeline
    let stages

    // First, try to find existing pipeline and its stages
    const { data: existingPipeline, error: pipelineLookupError } = await supabaseClient
      .from('pipelines')
      .select(`
        id, 
        name,
        pipeline_stages (
          id, 
          name, 
          stage_order,
          pipeline_id,
          org_id
        )
      `)
      .eq('name', pipeline_name || 'Search Intelligence')
      .eq('org_id', user.id)
      .maybeSingle()

    console.log('🔧 Edge Function: Pipeline lookup result:', { existingPipeline, pipelineLookupError })

    if (existingPipeline && existingPipeline.pipeline_stages && existingPipeline.pipeline_stages.length > 0) {
      // Pipeline exists with stages
      pipeline = existingPipeline
      stages = existingPipeline.pipeline_stages
      console.log('🔧 Edge Function: Using existing pipeline with stages:', { pipeline: pipeline.name, stageCount: stages.length })
    } else if (existingPipeline) {
      // Pipeline exists but no stages
      console.log('🔧 Edge Function: Pipeline exists but no stages, creating stages')
      pipeline = existingPipeline
      
      const stagesToInsert = defaultStages.map(stage => ({
        ...stage,
        pipeline_id: pipeline.id,
        org_id: user.id
      }))

      const { data: newStages, error: stagesError } = await supabaseClient
        .from('pipeline_stages')
        .insert(stagesToInsert)
        .select('*')

      console.log('🔧 Edge Function: Stages creation result:', { newStages, stagesError })

      if (stagesError) {
        console.error('🔧 Edge Function: Failed to create stages for existing pipeline:', stagesError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create pipeline stages', details: stagesError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      stages = newStages || []
    } else {
      // Create new pipeline
      console.log('🔧 Edge Function: Creating new pipeline')
      const { data: newPipeline, error: pipelineError } = await supabaseClient
        .from('pipelines')
        .insert({
          name: pipeline_name || 'Search Intelligence',
          org_id: user.id
        })
        .select('*')
        .single()

      console.log('🔧 Edge Function: Pipeline creation result:', { newPipeline, pipelineError })

      if (pipelineError) {
        console.error('🔧 Edge Function: Pipeline creation error:', pipelineError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create pipeline', details: pipelineError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      pipeline = newPipeline

      // Create stages for the new pipeline
      console.log('🔧 Edge Function: Creating stages for new pipeline')
      const stagesToInsert = defaultStages.map(stage => ({
        ...stage,
        pipeline_id: pipeline.id,
        org_id: user.id
      }))

      const { data: newStages, error: stagesError } = await supabaseClient
        .from('pipeline_stages')
        .insert(stagesToInsert)
        .select('*')

      console.log('🔧 Edge Function: Stages creation result:', { newStages, stagesError })

      if (stagesError) {
        console.error('🔧 Edge Function: Failed to create stages:', stagesError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create pipeline stages', details: stagesError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      stages = newStages || []
    }

    // Validate we have stages
    if (!stages || stages.length === 0) {
      console.error('🔧 Edge Function: No stages available after creation attempts')
      return new Response(
        JSON.stringify({ success: false, error: 'No stages found in pipeline after creation' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Find the target stage
    const targetStage = stages.find(s => s.name === (stage_name || 'Prospect Identified')) || stages[0]
    console.log('🔧 Edge Function: Target stage:', targetStage)

    if (!targetStage) {
      console.error('🔧 Edge Function: No target stage found')
      return new Response(
        JSON.stringify({ success: false, error: 'Target stage not found' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create or update CRM contact
    console.log('🔧 Edge Function: Creating contact data for org_id:', user.id)
    const contactData = {
      org_id: user.id,
      company_name: company.name,
      contact_name: company.contact?.name || null,
      title: company.contact?.title || null,
      email: company.contact?.email || null,
      phone: company.contact?.phone || null,
      industry: company.industry || null,
      headquarters_location: company.location || null,
      source: source || 'search',
      status: 'prospect',
      notes: `Added from ${source || 'search'} on ${new Date().toLocaleDateString()}`
    }

    // Check if contact already exists
    const { data: existingContact } = await supabaseClient
      .from('crm_contacts')
      .select('id')
      .eq('company_name', company.name)
      .eq('org_id', user.id)
      .maybeSingle()

    let contact_id
    if (existingContact) {
      contact_id = existingContact.id
      console.log('🔧 Edge Function: Updating existing contact:', contact_id)
      // Update existing contact
      await supabaseClient
        .from('crm_contacts')
        .update(contactData)
        .eq('id', contact_id)
    } else {
      // Create new contact
      console.log('🔧 Edge Function: Inserting new contact:', contactData)
      const { data: newContact, error: contactError } = await supabaseClient
        .from('crm_contacts')
        .insert(contactData)
        .select('id')
        .single()

      console.log('🔧 Edge Function: Contact creation result:', { newContact, contactError })

      if (contactError) {
        console.error('🔧 Edge Function: Contact creation error details:', contactError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create contact', details: contactError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      contact_id = newContact.id
    }

    // Create deal in the pipeline
    console.log('🔧 Edge Function: Creating deal')
    const dealData = {
      org_id: user.id,
      pipeline_id: pipeline.id,
      stage_id: targetStage.id,
      title: `${company.name} - Opportunity`,
      company_name: company.name,
      contact_id: contact_id,
      value_usd: company.trade_volume_usd || null,
      currency: 'USD',
      status: 'open',
      created_by: user.id,
      expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    }

    const { data: newDeal, error: dealError } = await supabaseClient
      .from('deals')
      .insert(dealData)
      .select('*')
      .single()

    console.log('🔧 Edge Function: Deal creation result:', { newDeal, dealError })

    if (dealError) {
      console.error('🔧 Edge Function: Deal creation error:', dealError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create deal', details: dealError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔧 Edge Function: Successfully added company to CRM:', {
      company: company.name,
      pipeline: pipeline.name,
      stage: targetStage.name,
      deal_id: newDeal.id,
      contact_id
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${company.name} added to ${pipeline.name} pipeline`,
        data: {
          pipeline: pipeline.name,
          stage: targetStage.name,
          deal_id: newDeal.id,
          contact_id,
          value: company.trade_volume_usd
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('🔧 Edge Function: Unexpected error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})