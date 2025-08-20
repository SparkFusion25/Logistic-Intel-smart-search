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

    const orgId = user.id;
    const url = new URL(req.url);
    const subjectType = url.searchParams.get("subjectType");
    const subjectId = url.searchParams.get("subjectId");
    const limit = Number(url.searchParams.get("limit") ?? 12);

    let query = supabase
      .from("ai_suggestions")
      .select("*")
      .eq("org_id", orgId)
      .eq("status", "new")
      .order("score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (subjectType) {
      query = query.eq("subject_type", subjectType);
    }
    if (subjectId) {
      query = query.eq("subject_id", subjectId);
    }

    const { data: suggestions, error } = await query;

    if (error) {
      console.error('Query error:', error);
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If no suggestions exist, create some mock ones for demonstration
    if (!suggestions || suggestions.length === 0) {
      const mockSuggestions = await createMockSuggestions(supabase, orgId, subjectType, subjectId);
      return new Response(JSON.stringify({ success: true, data: mockSuggestions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in assistant-next-best-action:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createMockSuggestions(supabase: any, orgId: string, subjectType?: string, subjectId?: string) {
  const mockSuggestions = [
    {
      org_id: orgId,
      subject_type: subjectType || "deal",
      subject_id: subjectId,
      suggestion_type: "follow_up",
      score: 85,
      confidence: "High",
      rationale: "Deal has been in 'Contacted' stage for 5 days with 3 email opens but no reply",
      source_signals: { opens: 3, days_in_stage: 5, stage: "contacted" },
      status: "new"
    },
    {
      org_id: orgId,
      subject_type: subjectType || "deal",
      subject_id: subjectId,
      suggestion_type: "schedule_call",
      score: 75,
      confidence: "Medium",
      rationale: "Contact clicked pricing link twice in last 48 hours",
      source_signals: { clicks: 2, link_type: "pricing", hours_since: 48 },
      status: "new"
    },
    {
      org_id: orgId,
      subject_type: subjectType || "contact",
      subject_id: subjectId,
      suggestion_type: "send_email",
      score: 65,
      confidence: "Medium",
      rationale: "No outreach in 7 days, good time for value-based follow up",
      source_signals: { days_since_contact: 7, engagement_score: 65 },
      status: "new"
    }
  ];

  const { data, error } = await supabase
    .from("ai_suggestions")
    .insert(mockSuggestions)
    .select();

  if (error) {
    console.error('Error creating mock suggestions:', error);
    return mockSuggestions; // Return mock data even if insert fails
  }

  return data || mockSuggestions;
}