import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CampaignData {
  org_id: string
  name: string
  channel: 'email' | 'linkedin' | 'hybrid'
  audience: any
  sequence: any[]
  created_by: string
}

serve(async (req) => {
  console.log('Campaigns manager function called')
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const campaignId = url.pathname.split('/').pop()

    if (req.method === 'POST' && url.pathname.includes('/start')) {
      // Start campaign
      console.log(`Starting campaign: ${campaignId}`)
      
      // Get campaign details
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()

      if (campaignError || !campaign) {
        return new Response(
          JSON.stringify({ error: 'Campaign not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get contacts based on audience filters
      let contactsQuery = supabase.from('crm_contacts').select('id, email, full_name')
      
      // Apply audience filters
      if (campaign.audience?.tags?.length > 0) {
        contactsQuery = contactsQuery.contains('tags', campaign.audience.tags)
      }
      
      if (campaign.audience?.country) {
        contactsQuery = contactsQuery.eq('country', campaign.audience.country)
      }

      const { data: contacts, error: contactsError } = await contactsQuery

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch contacts' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Queue contacts for campaign
      const queueEntries = contacts?.map(contact => ({
        campaign_id: campaignId,
        contact_id: contact.id,
        step_index: 0,
        scheduled_at: new Date().toISOString()
      })) || []

      if (queueEntries.length > 0) {
        const { error: queueError } = await supabase
          .from('campaign_queue')
          .insert(queueEntries)

        if (queueError) {
          console.error('Error queuing contacts:', queueError)
          return new Response(
            JSON.stringify({ error: 'Failed to queue contacts' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      // Update campaign status
      await supabase
        .from('campaigns')
        .update({ status: 'running' })
        .eq('id', campaignId)

      console.log(`Campaign started with ${queueEntries.length} contacts queued`)

      return new Response(
        JSON.stringify({ 
          message: 'Campaign started successfully',
          contacts_queued: queueEntries.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST' && url.pathname.includes('/pause')) {
      // Pause campaign
      console.log(`Pausing campaign: ${campaignId}`)
      
      await supabase
        .from('campaigns')
        .update({ status: 'paused' })
        .eq('id', campaignId)

      return new Response(
        JSON.stringify({ message: 'Campaign paused successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST') {
      // Create new campaign
      const campaignData: CampaignData = await req.json()
      
      console.log('Creating new campaign:', campaignData.name)

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          org_id: campaignData.org_id,
          name: campaignData.name,
          channel: campaignData.channel,
          audience: campaignData.audience,
          sequence: campaignData.sequence,
          created_by: campaignData.created_by
        })
        .select('id')
        .single()

      if (error) {
        console.error('Database error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to create campaign', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ id: data.id, message: 'Campaign created successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'PUT') {
      // Update campaign
      const campaignData = await req.json()
      
      console.log('Updating campaign:', campaignData.id)

      const { error } = await supabase
        .from('campaigns')
        .update(campaignData)
        .eq('id', campaignData.id)

      if (error) {
        console.error('Database error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to update campaign', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ message: 'Campaign updated successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'GET') {
      // Get campaigns
      const orgId = url.searchParams.get('org_id')
      
      if (!orgId) {
        return new Response(
          JSON.stringify({ error: 'org_id parameter required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch campaigns', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ campaigns: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in campaigns manager:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})