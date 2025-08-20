import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApolloSearchResult {
  people?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    name: string;
    linkedin_url: string;
    title: string;
    email: string;
    organization: {
      name: string;
      website_url: string;
      industry: string;
      employees_range: string;
      revenue_range: string;
    };
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔧 Contact Enrichment: Starting enrichment process');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { contact_id, company_name, contact_name } = await req.json();

    if (!contact_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Contact ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔧 Contact Enrichment: Enriching contact:', { contact_id, company_name, contact_name });

    // Get API keys
    const apolloApiKey = Deno.env.get('APOLLO_API_KEY');
    const phantomBusterApiKey = Deno.env.get('PHANTOMBUSTER_API_KEY');

    if (!apolloApiKey && !phantomBusterApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'No enrichment API keys configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let enrichmentData = {};
    let enrichmentSource = 'manual';

    // Try Apollo first if available
    if (apolloApiKey && company_name) {
      console.log('🔧 Contact Enrichment: Using Apollo API');
      try {
        const apolloResponse = await fetch('https://api.apollo.io/v1/mixed_people/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'X-Api-Key': apolloApiKey,
          },
          body: JSON.stringify({
            api_key: apolloApiKey,
            q_organization_name: company_name,
            page: 1,
            per_page: 5
          }),
        });

        if (apolloResponse.ok) {
          const apolloData: ApolloSearchResult = await apolloResponse.json();
          console.log('🔧 Contact Enrichment: Apollo response received');
          
          if (apolloData.people && apolloData.people.length > 0) {
            const person = apolloData.people[0]; // Take first match
            enrichmentData = {
              full_name: person.name || `${person.first_name} ${person.last_name}`.trim(),
              title: person.title,
              email: person.email,
              linkedin_url: person.linkedin_url,
              company_website: person.organization?.website_url,
              industry: person.organization?.industry,
              employee_count_range: person.organization?.employees_range,
              revenue_range: person.organization?.revenue_range,
            };
            enrichmentSource = 'apollo';
            console.log('🔧 Contact Enrichment: Apollo enrichment successful');
          }
        } else {
          console.log('🔧 Contact Enrichment: Apollo API failed:', apolloResponse.status);
        }
      } catch (apolloError) {
        console.error('🔧 Contact Enrichment: Apollo API error:', apolloError);
      }
    }

    // If Apollo didn't work and we have PhantomBuster, try that
    if (Object.keys(enrichmentData).length === 0 && phantomBusterApiKey) {
      console.log('🔧 Contact Enrichment: Apollo failed or unavailable, trying PhantomBuster');
      // PhantomBuster integration would go here
      // For now, we'll skip it as it requires more complex setup
    }

    // Update the contact with enrichment data
    if (Object.keys(enrichmentData).length > 0) {
      console.log('🔧 Contact Enrichment: Updating contact with enriched data');
      
      const { error: updateError } = await supabaseClient
        .from('crm_contacts')
        .update({
          ...enrichmentData,
          enrichment_source: enrichmentSource,
          last_enriched: new Date().toISOString(),
        })
        .eq('id', contact_id)
        .eq('org_id', user.id);

      if (updateError) {
        console.error('🔧 Contact Enrichment: Failed to update contact:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update contact', details: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create enrichment event
      const { error: eventError } = await supabaseClient
        .from('enrichment_events')
        .insert({
          org_id: user.id,
          contact_id: contact_id,
          provider: enrichmentSource,
          success: true,
          payload: {
            enriched_fields: Object.keys(enrichmentData),
            source: enrichmentSource,
            timestamp: new Date().toISOString(),
          },
        });

      if (eventError) {
        console.log('🔧 Contact Enrichment: Failed to create enrichment event (non-critical):', eventError);
        // Don't fail the request for this
      }

      console.log('🔧 Contact Enrichment: Enrichment completed successfully');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Contact enriched using ${enrichmentSource}`,
          data: enrichmentData 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log('🔧 Contact Enrichment: No enrichment data found');
      
      // Create failed enrichment event
      const { error: eventError } = await supabaseClient
        .from('enrichment_events')
        .insert({
          org_id: user.id,
          contact_id: contact_id,
          provider: 'apollo',
          success: false,
          payload: {
            error: 'No enrichment data found',
            company_name: company_name,
            timestamp: new Date().toISOString(),
          },
        });

      if (eventError) {
        console.log('🔧 Contact Enrichment: Failed to create enrichment event (non-critical):', eventError);
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No enrichment data found for this contact' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('🔧 Contact Enrichment: Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});