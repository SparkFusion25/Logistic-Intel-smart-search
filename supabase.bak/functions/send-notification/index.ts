import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  userId?: string;
  userIds?: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  options?: {
    icon?: string;
    badge?: string;
    requireInteraction?: boolean;
    silent?: boolean;
    tag?: string;
    actions?: Array<{
      action: string;
      title: string;
      icon?: string;
    }>;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get VAPID keys
    const vapidPublicKey = Deno.env.get('NEXT_PUBLIC_VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error('VAPID keys not configured');
      return new Response(
        JSON.stringify({ error: 'Push notification service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: NotificationPayload = await req.json();
    console.log('Notification payload:', payload);

    // Get target user IDs
    const targetUserIds = payload.userIds || (payload.userId ? [payload.userId] : []);
    
    if (targetUserIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No target users specified' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get push subscriptions for target users
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', targetUserIds);

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch push subscriptions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found for users:', targetUserIds);
      return new Response(
        JSON.stringify({ message: 'No push subscriptions found', sent: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Import web-push library
    const webPush = await import('https://deno.land/x/web_push@0.1.0/mod.ts');
    
    // Set VAPID details
    webPush.setVapidDetails(
      'mailto:notifications@logisticintel.com',
      vapidPublicKey,
      vapidPrivateKey
    );

    // Prepare notification data
    const notificationData = {
      title: payload.title,
      body: payload.body,
      data: payload.data || {},
      options: payload.options || {}
    };

    // Send notifications to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: subscription.keys
          };

          await webPush.sendNotification(
            pushSubscription,
            JSON.stringify(notificationData)
          );

          console.log(`Notification sent to user ${subscription.user_id}`);
          return { success: true, userId: subscription.user_id };
        } catch (error) {
          console.error(`Failed to send notification to user ${subscription.user_id}:`, error);
          
          // If subscription is invalid, remove it from database
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log(`Removing invalid subscription for user ${subscription.user_id}`);
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', subscription.id);
          }
          
          return { success: false, userId: subscription.user_id, error: error.message };
        }
      })
    );

    // Count successful sends
    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;

    const failedCount = results.length - successCount;

    console.log(`Notifications sent: ${successCount} successful, ${failedCount} failed`);

    return new Response(
      JSON.stringify({
        message: 'Notifications processed',
        sent: successCount,
        failed: failedCount,
        total: results.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);