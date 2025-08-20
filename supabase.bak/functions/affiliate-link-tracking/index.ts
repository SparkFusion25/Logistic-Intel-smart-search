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

    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const affiliateId = url.searchParams.get("affiliate_id");

    if (!slug && !affiliateId) {
      return new Response(
        JSON.stringify({ error: "Missing slug or affiliate_id parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let link;
    if (slug) {
      // Get link by slug
      const { data, error } = await supabaseClient
        .from("affiliate_links")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Link not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      link = data;
    }

    // Track the click
    const trackingCode = crypto.randomUUID();
    
    if (link) {
      // Create referral record
      await supabaseClient
        .from("affiliate_referrals")
        .insert({
          affiliate_id: link.affiliate_id,
          tracking_code: trackingCode,
          status: "clicked"
        });

      // Redirect to target URL with tracking
      const targetUrl = new URL(link.target_url);
      targetUrl.searchParams.set("ref", trackingCode);
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          "Location": targetUrl.toString()
        }
      });
    }

    // Direct affiliate tracking
    if (affiliateId) {
      await supabaseClient
        .from("affiliate_referrals")
        .insert({
          affiliate_id: affiliateId,
          tracking_code: trackingCode,
          status: "clicked"
        });

      return new Response(
        JSON.stringify({ tracking_code: trackingCode }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in affiliate link tracking:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});