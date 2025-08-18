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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { companyName, departments, contactName } = await req.json();

    const apolloApiKey = Deno.env.get('APOLLO_API_KEY');
    if (!apolloApiKey) {
      return new Response(JSON.stringify({ success: false, error: 'Apollo API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const enrichedContacts = [];

    // Search for contacts in each department
    for (const department of departments) {
      try {
        const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'X-Api-Key': apolloApiKey,
          },
          body: JSON.stringify({
            q_organization_domains: [companyName.toLowerCase().replace(/\s+/g, '') + '.com'],
            page: 1,
            per_page: 10,
            person_titles: [department],
            organization_locations: ['United States'],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const contacts = data.people?.map((person: any) => ({
            id: person.id,
            name: person.name || 'Unknown',
            title: person.title || department,
            email: person.email,
            phone: person.phone_numbers?.[0]?.sanitized_number,
            linkedin: person.linkedin_url,
            company: person.organization?.name || companyName,
            department,
            photoUrl: person.photo_url,
            location: person.city && person.state ? `${person.city}, ${person.state}` : null,
          })) || [];

          enrichedContacts.push(...contacts);
        }
      } catch (error) {
        console.error(`Error fetching contacts for ${department}:`, error);
      }
    }

    // Log enrichment event
    await supabase.from('enrichment_events').insert({
      org_id: user.id,
      provider: 'apollo',
      success: enrichedContacts.length > 0,
      payload: {
        company_name: companyName,
        departments,
        results_count: enrichedContacts.length
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      contacts: enrichedContacts,
      totalFound: enrichedContacts.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in apollo-enrichment function:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});