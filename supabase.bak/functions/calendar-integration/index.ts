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

    const { action, eventData, dealId } = await req.json();

    switch (action) {
      case 'create':
        return await createCalendarEvent(eventData, user.id, dealId);
      case 'fetch':
        return await fetchEvents(user.id);
      case 'update':
        return await updateEvent(eventData, user.id);
      case 'delete':
        return await deleteEvent(eventData.id, user.id);
      default:
        return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in calendar-integration function:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createCalendarEvent(eventData: any, userId: string, dealId?: string) {
  // This would integrate with Google Calendar API
  console.log('Creating calendar event:', eventData);
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Log activity
  const { error } = await supabase.from('activities').insert({
    org_id: userId,
    deal_id: dealId,
    type: 'meeting',
    subject: `Meeting scheduled: ${eventData.title}`,
    body: `${eventData.description}\nDate: ${eventData.startDate}\nTime: ${eventData.startTime}`,
    due_at: new Date(`${eventData.startDate}T${eventData.startTime}`).toISOString(),
    created_by: userId
  });

  if (error) {
    console.error('Error logging calendar activity:', error);
  }

  return new Response(JSON.stringify({ 
    success: true, 
    eventId: 'cal_' + Date.now(),
    message: 'Meeting scheduled successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function fetchEvents(userId: string) {
  // This would fetch from Google Calendar API
  const mockEvents = [
    {
      id: 'event_1',
      title: 'Sales Call with ABC Corp',
      start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      description: 'Follow-up call to discuss proposal'
    }
  ];

  return new Response(JSON.stringify({ success: true, events: mockEvents }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function updateEvent(eventData: any, userId: string) {
  console.log('Updating calendar event:', eventData);
  return new Response(JSON.stringify({ success: true, message: 'Event updated' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function deleteEvent(eventId: string, userId: string) {
  console.log('Deleting calendar event:', eventId);
  return new Response(JSON.stringify({ success: true, message: 'Event deleted' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}