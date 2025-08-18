import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

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

    // Get user from auth header
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

    const { to, subject, body, dealId } = await req.json();

    if (!to || !subject || !body) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields: to, subject, body' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // Send email
    const emailResponse = await resend.emails.send({
      from: "CRM System <noreply@yourcompany.com>",
      to: [to],
      subject: subject,
      html: body.replace(/\n/g, '<br>'),
    });

    console.log('Email sent:', emailResponse);

    // Log email activity
    if (dealId) {
      try {
        await supabase.from('activities').insert({
          deal_id: dealId,
          type: 'email',
          subject: `Email sent: ${subject}`,
          body: `Sent email to ${to}\n\nSubject: ${subject}\n\nContent:\n${body}`,
          org_id: user.id,
          created_by: user.id
        });
      } catch (logError) {
        console.error('Failed to log email activity:', logError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: emailResponse 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-email function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});