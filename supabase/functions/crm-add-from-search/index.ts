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
    console.log('🔧 Edge Function: Headers:', Object.fromEntries(req.headers.entries()))
    
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

    // Get or create the specified pipeline
    console.log('🔧 Edge Function: Looking for pipeline:', pipeline_name || 'Search Intelligence')
    let pipeline
    const { data: existingPipeline, error: pipelineLookupError } = await supabaseClient
      .from('pipelines')
      .select('id, name')
      .eq('name', pipeline_name || 'Search Intelligence')
      .eq('org_id', user.id)
      .single()

    console.log('🔧 Edge Function: Pipeline lookup result:', { existingPipeline, pipelineLookupError })

    if (existingPipeline) {
      pipeline = existingPipeline
      console.log('🔧 Edge Function: Using existing pipeline:', pipeline)
    } else {
      // Create pipeline if it doesn't exist
      console.log('🔧 Edge Function: Creating new pipeline')
      const { data: newPipeline, error: pipelineError } = await supabaseClient
        .from('pipelines')
        .insert({
          name: pipeline_name || 'Search Intelligence',
          org_id: user.id
        })
        .select()
        .single()

      console.log('🔧 Edge Function: Pipeline creation result:', { newPipeline, pipelineError })

      if (pipelineError) {
        console.error('🔧 Edge Function: Pipeline creation error:', pipelineError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create pipeline' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      pipeline = newPipeline

      // Create default stages for the new pipeline
      console.log('🔧 Edge Function: Creating default stages for new pipeline')
      const defaultStages = [
        { name: 'Prospect Identified', stage_order: 1 },
        { name: 'Initial Contact', stage_order: 2 },
        { name: 'Qualified Lead', stage_order: 3 },
        { name: 'Proposal Sent', stage_order: 4 },
        { name: 'Negotiation', stage_order: 5 },
        { name: 'Won', stage_order: 6 },
        { name: 'Lost', stage_order: 7 }
      ]

      const stagesToInsert = defaultStages.map(stage => ({
        ...stage,
        pipeline_id: pipeline.id,
        org_id: user.id
      }))

      console.log('🔧 Edge Function: Inserting stages:', stagesToInsert)

      const { error: stagesError } = await supabaseClient
        .from('pipeline_stages')
        .insert(stagesToInsert)

      console.log('🔧 Edge Function: Stages creation result:', { stagesError })

      if (stagesError) {
        console.error('🔧 Edge Function: Failed to create stages:', stagesError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create pipeline stages' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Get the appropriate stage
    console.log('🔧 Edge Function: Looking for stages in pipeline:', pipeline.id)
    let { data: stages, error: stagesError } = await supabaseClient
      .from('pipeline_stages')
      .select('*')
      .eq('pipeline_id', pipeline.id)
      .order('stage_order')

    console.log('🔧 Edge Function: Stages lookup result:', { stages, stagesError })

    // If no stages exist, create them
    if (!stages || stages.length === 0) {
      console.log('🔧 Edge Function: No stages found, creating default stages')
      const defaultStages = [
        { name: 'Prospect Identified', stage_order: 1 },
        { name: 'Initial Contact', stage_order: 2 },
        { name: 'Qualified Lead', stage_order: 3 },
        { name: 'Proposal Sent', stage_order: 4 },
        { name: 'Negotiation', stage_order: 5 },
        { name: 'Won', stage_order: 6 },
        { name: 'Lost', stage_order: 7 }
      ]

      const stagesToInsert = defaultStages.map(stage => ({
        ...stage,
        pipeline_id: pipeline.id,
        org_id: user.id
      }))

      console.log('🔧 Edge Function: Inserting stages for existing pipeline:', stagesToInsert)

      const { data: newStages, error: stagesInsertError } = await supabaseClient
        .from('pipeline_stages')
        .insert(stagesToInsert)
        .select()

      console.log('🔧 Edge Function: Stages creation result:', { newStages, stagesInsertError })

      if (stagesInsertError) {
        console.error('🔧 Edge Function: Failed to create stages for existing pipeline:', stagesInsertError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create pipeline stages' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      stages = newStages
    }

    const targetStage = stages?.find(s => s.name === (stage_name || 'Prospect Identified')) || stages?.[0]
    console.log('🔧 Edge Function: Target stage:', targetStage)

    if (!targetStage) {
      console.log('🔧 Edge Function: No target stage found after creation attempt')
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create or find pipeline stages' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create or update CRM contact
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
      notes: `Added from ${source || 'search'} on ${new Date().toLocaleDateString()}`,
      created_at: new Date().toISOString()
    }

    // Check if contact already exists
    const { data: existingContact } = await supabaseClient
      .from('crm_contacts')
      .select('id')
      .eq('company_name', company.name)
      .eq('org_id', user.id)
      .single()

    let contact_id
    if (existingContact) {
      contact_id = existingContact.id
      // Update existing contact
      await supabaseClient
        .from('crm_contacts')
        .update(contactData)
        .eq('id', contact_id)
    } else {
      // Create new contact
      const { data: newContact, error: contactError } = await supabaseClient
        .from('crm_contacts')
        .insert(contactData)
        .select('id')
        .single()

      if (contactError) {
        console.error('Contact creation error:', contactError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create contact' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      contact_id = newContact.id
    }

    // Create deal in the pipeline
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
      created_at: new Date().toISOString(),
      expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    }

    const { data: newDeal, error: dealError } = await supabaseClient
      .from('deals')
      .insert(dealData)
      .select()
      .single()

    if (dealError) {
      console.error('Deal creation error:', dealError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create deal' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Successfully added company to CRM:', {
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