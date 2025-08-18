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

    const { action, email, subject, body, threadId, dealId, code } = await req.json();

    switch (action) {
      case 'get_auth_url':
        return await getAuthUrl();
      case 'oauth_callback':
        return await handleOAuthCallback(code, user.id);
      case 'check_connection':
        return await checkConnection(user.id);
      case 'disconnect':
        return await disconnectGmail(user.id);
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


async function getAuthUrl() {
  const clientId = Deno.env.get('GMAIL_CLIENT_ID');
  const redirectUri = `https://4a45296c-0092-4421-bccf-a0427c89b8cf.lovableproject.com/oauth/callback`;
  
  const scope = encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify');
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${scope}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent`;

  return new Response(JSON.stringify({ success: true, authUrl }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleOAuthCallback(code: string, userId: string) {
  const clientId = Deno.env.get('GMAIL_CLIENT_ID');
  const clientSecret = Deno.env.get('GMAIL_CLIENT_SECRET');
  const redirectUri = `https://4a45296c-0092-4421-bccf-a0427c89b8cf.lovableproject.com/oauth/callback`;

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      throw new Error(tokens.error_description || tokens.error);
    }

    // Get user profile
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const profile = await profileResponse.json();

    // Store tokens in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { error } = await supabase.from('gmail_tokens').upsert({
      user_id: userId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      email: profile.email,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error storing tokens:', error);
      throw error;
    }

    return new Response(JSON.stringify({ success: true, email: profile.email }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function checkConnection(userId: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { data, error } = await supabase
    .from('gmail_tokens')
    .select('email, expires_at')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ connected: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const isExpired = new Date(data.expires_at) < new Date();
  
  return new Response(JSON.stringify({ 
    connected: !isExpired, 
    email: data.email,
    expired: isExpired 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function disconnectGmail(userId: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { error } = await supabase
    .from('gmail_tokens')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error disconnecting Gmail:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function sendEmail(to: string, subject: string, body: string, userId: string, dealId?: string) {
  // Get access token
  const token = await getValidAccessToken(userId);
  if (!token) {
    return new Response(JSON.stringify({ success: false, error: 'Gmail not connected' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Create email message
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=utf-8`,
      '',
      body
    ].join('\n');

    // Use Deno's standard approach for base64 encoding
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    const base64 = btoa(String.fromCharCode.apply(null, Array.from(data)));
    const encodedEmail = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Send via Gmail API
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedEmail
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to send email');
    }

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

    return new Response(JSON.stringify({ success: true, messageId: result.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Send email error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function fetchEmails(userId: string) {
  const token = await getValidAccessToken(userId);
  if (!token) {
    return new Response(JSON.stringify({ success: false, error: 'Gmail not connected' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get messages list
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch emails');
    }

    const emails = [];
    
    // Get details for each message
    for (const message of data.messages || []) {
      const msgResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const msgData = await msgResponse.json();
      
      if (msgResponse.ok) {
        const headers = msgData.payload?.headers || [];
        const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
        const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
        const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();
        
        emails.push({
          id: message.id,
          threadId: msgData.threadId,
          subject,
          from,
          body: msgData.snippet || '',
          date: new Date(date).toISOString(),
          read: !msgData.labelIds?.includes('UNREAD')
        });
      }
    }

    return new Response(JSON.stringify({ success: true, emails }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Fetch emails error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function replyToEmail(threadId: string, body: string, userId: string, dealId?: string) {
  const token = await getValidAccessToken(userId);
  if (!token) {
    return new Response(JSON.stringify({ success: false, error: 'Gmail not connected' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get original thread to extract recipient info
    const threadResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const threadData = await threadResponse.json();
    
    if (!threadResponse.ok) {
      throw new Error(threadData.error?.message || 'Failed to get thread');
    }

    const lastMessage = threadData.messages[threadData.messages.length - 1];
    const headers = lastMessage.payload?.headers || [];
    const originalFrom = headers.find(h => h.name === 'From')?.value || '';
    const originalSubject = headers.find(h => h.name === 'Subject')?.value || '';
    
    // Extract email from "Name <email>" format
    const emailMatch = originalFrom.match(/<(.+)>/);
    const replyTo = emailMatch ? emailMatch[1] : originalFrom;
    
    const replySubject = originalSubject.startsWith('Re: ') ? originalSubject : `Re: ${originalSubject}`;

    // Create reply message
    const email = [
      `To: ${replyTo}`,
      `Subject: ${replySubject}`,
      `In-Reply-To: ${lastMessage.id}`,
      `References: ${lastMessage.id}`,
      `Content-Type: text/html; charset=utf-8`,
      '',
      body
    ].join('\n');

    // Use Deno's standard approach for base64 encoding
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    const base64 = btoa(String.fromCharCode.apply(null, Array.from(data)));
    const encodedEmail = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Send reply via Gmail API
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedEmail,
        threadId: threadId
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to send reply');
    }

    return new Response(JSON.stringify({ success: true, messageId: result.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Reply email error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function getValidAccessToken(userId: string): Promise<string | null> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { data, error } = await supabase
    .from('gmail_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  // Check if token is expired
  const isExpired = new Date(data.expires_at) < new Date();
  
  if (!isExpired) {
    return data.access_token;
  }

  // Refresh token if expired
  try {
    const clientId = Deno.env.get('GMAIL_CLIENT_ID');
    const clientSecret = Deno.env.get('GMAIL_CLIENT_SECRET');

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        refresh_token: data.refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    const tokens = await response.json();
    
    if (tokens.error) {
      console.error('Token refresh error:', tokens.error);
      return null;
    }

    // Update stored tokens
    const { error: updateError } = await supabase
      .from('gmail_tokens')
      .update({
        access_token: tokens.access_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating tokens:', updateError);
      return null;
    }

    return tokens.access_token;

  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}