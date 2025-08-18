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

    const { action, email, subject, body, threadId, dealId } = await req.json();

    switch (action) {
      case 'send':
        return await sendEmail(email, subject, body, user.id, dealId);
      case 'fetch':
        return await fetchEmails(user.id);
      case 'reply':
        return await replyToEmail(threadId, body, user.id, dealId);
      default:
        return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in gmail-integration function:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendEmail(to: string, subject: string, body: string, userId: string, dealId?: string) {
  // This would integrate with Gmail API
  // For now, using a placeholder implementation
  console.log('Sending email:', { to, subject, userId, dealId });
  
  // Log email activity
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  
  const { error } = await supabase.from('activities').insert({
    org_id: userId,
    deal_id: dealId,
    type: 'email',
    subject: `Email sent: ${subject}`,
    body: `To: ${to}\n\n${body}`,
    created_by: userId
  });

  if (error) {
    console.error('Error logging email activity:', error);
  }

  return new Response(JSON.stringify({ success: true, messageId: 'temp_id_' + Date.now() }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function fetchEmails(userId: string) {
  // This would fetch emails from Gmail API
  // For now, returning mock data
  const mockEmails = [
    {
      id: '1',
      threadId: 'thread_1',
      subject: 'Re: Business Proposal',
      from: 'contact@example.com',
      body: 'Thank you for your proposal. We are interested in discussing further.',
      date: new Date().toISOString(),
      read: true
    }
  ];

  return new Response(JSON.stringify({ success: true, emails: mockEmails }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function replyToEmail(threadId: string, body: string, userId: string, dealId?: string) {
  // This would reply using Gmail API
  console.log('Replying to email:', { threadId, body, userId, dealId });
  
  return new Response(JSON.stringify({ success: true, messageId: 'reply_' + Date.now() }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}