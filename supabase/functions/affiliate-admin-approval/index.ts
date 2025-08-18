import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from("user_profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (profile?.role !== "admin") {
      throw new Error("Admin access required");
    }

    const { action, request_id, reason, commission_rate } = await req.json();

    if (action === "approve") {
      // Get the request details
      const { data: request } = await supabaseClient
        .from("affiliate_requests")
        .select("user_id")
        .eq("id", request_id)
        .single();

      if (!request) {
        throw new Error("Request not found");
      }

      // Start transaction-like operations
      // 1. Update request status
      await supabaseClient
        .from("affiliate_requests")
        .update({
          status: "approved",
          processed_by: userData.user.id,
          processed_at: new Date().toISOString()
        })
        .eq("id", request_id);

      // 2. Create affiliate profile
      await supabaseClient
        .from("affiliate_profiles")
        .insert({
          user_id: request.user_id,
          status: "active",
          commission_rate: commission_rate || 10.00,
          approved_by: userData.user.id,
          approved_at: new Date().toISOString()
        });

      return new Response(
        JSON.stringify({ success: true, message: "Affiliate request approved" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "reject") {
      await supabaseClient
        .from("affiliate_requests")
        .update({
          status: "rejected",
          reason: reason,
          processed_by: userData.user.id,
          processed_at: new Date().toISOString()
        })
        .eq("id", request_id);

      return new Response(
        JSON.stringify({ success: true, message: "Affiliate request rejected" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "get_pending") {
      const { data: requests } = await supabaseClient
        .from("affiliate_requests")
        .select(`
          *,
          user_profiles!inner(
            email,
            full_name
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      return new Response(
        JSON.stringify({ requests }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in affiliate admin approval:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});