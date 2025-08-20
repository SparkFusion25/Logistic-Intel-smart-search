import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

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

    const { action, affiliate_id, period_start, period_end, amount } = await req.json();

    if (action === "calculate_payouts") {
      // Calculate pending payouts for all affiliates
      const { data: referrals } = await supabaseClient
        .from("affiliate_referrals")
        .select(`
          affiliate_id,
          commission_earned,
          created_at,
          affiliate_profiles!inner(commission_rate)
        `)
        .eq("status", "converted")
        .gte("created_at", period_start)
        .lte("created_at", period_end);

      const payouts = new Map();
      
      referrals?.forEach((referral) => {
        const affiliateId = referral.affiliate_id;
        const commission = referral.commission_earned || 0;
        
        if (!payouts.has(affiliateId)) {
          payouts.set(affiliateId, 0);
        }
        payouts.set(affiliateId, payouts.get(affiliateId) + commission);
      });

      const payoutRecords = Array.from(payouts.entries()).map(([affiliateId, amount]) => ({
        affiliate_id: affiliateId,
        amount,
        period_start,
        period_end,
        status: "pending"
      }));

      return new Response(
        JSON.stringify({ payouts: payoutRecords }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "process_payout") {
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
        apiVersion: "2023-10-16",
      });

      // Get affiliate profile
      const { data: affiliate } = await supabaseClient
        .from("affiliate_profiles")
        .select("stripe_account_id, payment_email")
        .eq("id", affiliate_id)
        .single();

      if (!affiliate?.stripe_account_id) {
        throw new Error("Affiliate Stripe account not configured");
      }

      // Create Stripe transfer
      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        destination: affiliate.stripe_account_id,
        description: `Affiliate payout for period ${period_start} to ${period_end}`,
      });

      // Create payout record
      const { data: payout } = await supabaseClient
        .from("affiliate_payouts")
        .insert({
          affiliate_id,
          amount,
          period_start,
          period_end,
          status: "processed",
          stripe_transfer_id: transfer.id,
          processed_by: userData.user.id,
          processed_at: new Date().toISOString()
        })
        .select()
        .single();

      return new Response(
        JSON.stringify({ payout, transfer_id: transfer.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in payout processing:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});