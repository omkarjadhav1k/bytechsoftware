// Deno Edge Function: create-razorpay-order
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { participantId, amount = 1 } = await req.json();

    if (!participantId) {
      return new Response(
        JSON.stringify({ error: "Participant ID (UUID) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!keyId || !keySecret) {
      return new Response(
        JSON.stringify({ error: "Razorpay credentials are not configured in Supabase Secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Razorpay amount is in paise (₹99 = 9900 paise)
    const amountInPaise = amount * 100;

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${keyId}:${keySecret}`),
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${participantId.substring(0, 10)}`,
        notes: {
          participant_db_id: participantId,
          project: "ByTech Hackathon 2026",
        },
      }),
    });

    const orderData = await response.json();

    if (!response.ok) {
      throw new Error(orderData.error?.description || "Failed to create order");
    }

    return new Response(
      JSON.stringify({
        order_id: orderData.id,
        key_id: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
