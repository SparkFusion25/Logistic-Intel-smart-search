import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
    const { data: authUser, error: authError } = await supabase.auth.getUser(authHeader);

    if (authError || !authUser.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's org_id
    const { data: userData } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', authUser.user.id)
      .single();

    if (!userData?.org_id) {
      return new Response(JSON.stringify({ error: 'User org not found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const {
      company_name,
      full_name = null,
      title = null,
      email = null,
      phone = null,
      linkedin = null,
      country = null,
      city = null,
      tags = [],
      notes = ''
    } = body;

    console.log('Adding contact to CRM:', { company_name, full_name, email });

    // Use the upsert_crm_contact RPC function
    const { data: contactId, error: insertError } = await supabase
      .rpc('upsert_crm_contact', {
        p_org_id: userData.org_id,
        p_company_name: company_name,
        p_full_name: full_name,
        p_title: title,
        p_email: email,
        p_phone: phone,
        p_linkedin: linkedin,
        p_country: country,
        p_city: city,
        p_tags: tags,
        p_notes: notes,
        p_source: 'search_intelligence'
      });

    if (insertError) {
      console.error('Error adding contact:', insertError);
      return new Response(JSON.stringify({ 
        error: 'Failed to add contact',
        message: insertError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log the event
    await supabase.from('audit_logs').insert({
      org_id: userData.org_id,
      user_id: authUser.user.id,
      entity: 'crm_contact',
      entity_id: contactId,
      action: 'added_to_crm',
      meta: {
        company_name,
        full_name,
        source: 'search_intelligence'
      }
    });

    console.log('Contact added successfully:', contactId);

    return new Response(JSON.stringify({
      success: true,
      contact_id: contactId,
      message: 'Contact added to CRM successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in crm-add-contact function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});