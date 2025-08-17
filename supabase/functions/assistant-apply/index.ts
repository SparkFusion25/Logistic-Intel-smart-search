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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization') ?? '',
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const suggestionId = url.pathname.split('/').pop();
    const { mode = "execute" } = await req.json();

    const orgId = user.id;

    // Get the suggestion
    const { data: suggestion, error: suggestionError } = await supabase
      .from("ai_suggestions")
      .select("*")
      .eq("id", suggestionId)
      .eq("org_id", orgId)
      .single();

    if (suggestionError || !suggestion) {
      return new Response(JSON.stringify({ success: false, error: 'Suggestion not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (mode === "prepare") {
      // Return instructions for client-side action
      const action = getClientAction(suggestion);
      return new Response(JSON.stringify({ success: true, data: action }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Execute mode - perform the action
    await executeAction(supabase, suggestion, orgId);

    // Mark suggestion as applied
    await supabase
      .from("ai_suggestions")
      .update({ status: "applied", updated_at: new Date().toISOString() })
      .eq("id", suggestionId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in assistant-apply:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getClientAction(suggestion: any) {
  switch (suggestion.suggestion_type) {
    case "follow_up":
      return {
        action: "open_composer",
        payload: {
          contactId: suggestion.subject_id,
          subject: "Quick follow up",
          body_html: "<p>Hi {{first_name}},</p><p>Just checking in on our previous conversation...</p><p>Best regards,<br>{{sender_name}}</p>"
        }
      };
    case "schedule_call":
      return {
        action: "open_scheduler",
        payload: {
          contactId: suggestion.subject_id,
          subject: "Let's schedule a call",
          body_html: "<p>Hi {{first_name}},</p><p>I'd love to schedule a 15-minute call to discuss your needs...</p>"
        }
      };
    case "send_email":
      return {
        action: "open_composer",
        payload: {
          contactId: suggestion.subject_id,
          subject: "Value proposition follow-up",
          body_html: "<p>Hi {{first_name}},</p><p>I wanted to share some insights that might be valuable for your business...</p>"
        }
      };
    default:
      return {
        action: "show_message",
        payload: {
          message: "Action not yet implemented"
        }
      };
  }
}

async function executeAction(supabase: any, suggestion: any, orgId: string) {
  switch (suggestion.suggestion_type) {
    case "advance_stage":
      if (suggestion.subject_type === "deal" && suggestion.subject_id) {
        // Move deal to next stage
        const { data: deal } = await supabase
          .from("deals")
          .select("stage_id, pipeline_id")
          .eq("id", suggestion.subject_id)
          .single();
        
        if (deal) {
          const { data: stages } = await supabase
            .from("pipeline_stages")
            .select("id, stage_order")
            .eq("pipeline_id", deal.pipeline_id)
            .order("stage_order");
          
          if (stages) {
            const currentIndex = stages.findIndex(s => s.id === deal.stage_id);
            const nextStage = stages[currentIndex + 1];
            
            if (nextStage) {
              await supabase
                .from("deals")
                .update({ stage_id: nextStage.id })
                .eq("id", suggestion.subject_id);
            }
          }
        }
      }
      break;
    // Add other action implementations as needed
    default:
      console.log('Action executed:', suggestion.suggestion_type);
  }
}