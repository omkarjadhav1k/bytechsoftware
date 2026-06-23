// Deno Edge Function: verify-payment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

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
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, participant_db_id } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !participant_db_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keySecret) {
      return new Response(
        JSON.stringify({ error: "Razorpay Key Secret is not configured in Supabase Secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Cryptographically verify Razorpay signature
    const message = razorpay_order_id + "|" + razorpay_payment_id;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(keySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(message)
    );
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const generatedSignature = signatureArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Invalid Razorpay signature. Potential tampering detected." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Connect to Supabase using service role to bypass RLS policies and update participant
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update the participant record to 'paid'
    const { data: participant, error: updateError } = await supabase
      .from("participants")
      .update({
        payment_status: "paid",
        payment_id: razorpay_payment_id
      })
      .eq("id", participant_db_id)
      .select()
      .single();

    if (updateError || !participant) {
      throw new Error(updateError?.message || "Failed to update participant record");
    }

    // 3. Send confirmation email using Resend API
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    let emailSent = false;
    let emailErrorMsg = "";

    if (resendApiKey) {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ByTech Virtual Hackathon 2026</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                background-color: #f9fafb;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                overflow: hidden;
                border: 1px solid #f3f4f6;
              }
              .header {
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                padding: 40px 30px;
                text-align: center;
                color: #ffffff;
              }
              .header h1 {
                margin: 0 0 10px 0;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: -0.025em;
              }
              .header p {
                margin: 0;
                font-size: 15px;
                opacity: 0.9;
              }
              .content {
                padding: 40px 30px;
                color: #374151;
                line-height: 1.6;
              }
              .greeting {
                font-size: 18px;
                font-weight: 600;
                margin-top: 0;
                margin-bottom: 16px;
              }
              .badge {
                display: inline-block;
                background-color: #eff6ff;
                border: 1px dashed #3b82f6;
                padding: 12px 24px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
              }
              .badge-title {
                font-size: 11px;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 4px;
              }
              .badge-value {
                font-family: monospace;
                font-size: 22px;
                color: #1e3a8a;
                font-weight: 700;
              }
              .details-table {
                width: 100%;
                border-collapse: collapse;
                margin: 24px 0;
              }
              .details-table td {
                padding: 10px 0;
                border-bottom: 1px solid #f3f4f6;
                font-size: 14px;
              }
              .details-table td.label {
                color: #6b7280;
                font-weight: 500;
                width: 150px;
              }
              .details-table td.value {
                color: #1f2937;
                font-weight: 600;
              }
              .next-steps {
                background-color: #f8fafc;
                border-left: 4px solid #3b82f6;
                padding: 20px;
                border-radius: 0 8px 8px 0;
                margin: 28px 0;
              }
              .next-steps h3 {
                margin-top: 0;
                margin-bottom: 10px;
                font-size: 15px;
                color: #1e3a8a;
              }
              .next-steps ol {
                margin: 0;
                padding-left: 20px;
                font-size: 14px;
              }
              .next-steps li {
                margin-bottom: 8px;
              }
              .footer {
                background-color: #f9fafb;
                padding: 24px 30px;
                text-align: center;
                border-top: 1px solid #f3f4f6;
                font-size: 12px;
                color: #9ca3af;
              }
              .footer p {
                margin: 4px 0;
              }
              .footer a {
                color: #3b82f6;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>ByTech Virtual Hackathon 2026</h1>
                <p>Registration Confirmed - ByTech Software Solutions</p>
              </div>
              <div class="content">
                <p class="greeting">Hi ${participant.full_name},</p>
                <p>Thank you for registering! Your payment of <strong>₹99</strong> has been successfully processed, and your registration is confirmed.</p>
                
                <div class="badge" align="center">
                  <div class="badge-title">Your Unique Participant ID</div>
                  <div class="badge-value">${participant.participant_id}</div>
                </div>

                <h3 style="margin-top: 30px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; color: #1e3a8a;">Event Information</h3>
                <table class="details-table">
                  <tr>
                    <td class="label">Date</td>
                    <td class="value">July 10, 2026</td>
                  </tr>
                  <tr>
                    <td class="label">Duration</td>
                    <td class="value">3 Hours (06:00 PM - 09:00 PM)</td>
                  </tr>
                  <tr>
                    <td class="label">Format</td>
                    <td class="value">100% Virtual (Individual Participation)</td>
                  </tr>
                  <tr>
                    <td class="label">College</td>
                    <td class="value">${participant.college_name}</td>
                  </tr>
                  <tr>
                    <td class="label">Payment Receipt ID</td>
                    <td class="value">${participant.payment_id}</td>
                  </tr>
                </table>

                <div class="next-steps">
                  <h3>Important Guidelines</h3>
                  <ol>
                    <li><strong>Watch Your Inbox:</strong> Setup details and hackathon portal credentials will be emailed to you 24 hours before the event starts.</li>
                    <li><strong>Prepare Your Tools:</strong> Ensure you have Git installed, a working GitHub account, and a stable internet connection for the 3-hour marathon.</li>
                    <li><strong>Prizes & Awards:</strong> 1st Prize: ₹2,000 \| 2nd Prize: ₹1,000 \| 3rd Prize: ₹500 \| Top 10: Finalist Certificates \| All participants: Participation Certificate.</li>
                  </ol>
                </div>

                <p>If you have any questions or require assistance, please reply directly to this email.</p>
                
                <p>Best regards,<br/><strong>ByTech Software Solutions Team</strong></p>
              </div>
              <div class="footer">
                <p>ByTech Software Solutions &copy; 2026. All rights reserved.</p>
                <p>Need support? Contact us at <a href="mailto:support@bytechsoftware.com">support@bytechsoftware.com</a></p>
                <p><a href="https://bytechsoftware.vercel.app">Visit Base Website</a></p>
              </div>
            </div>
          </body>
          </html>
        `;

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "ByTech Hackathon <no-reply@resend.dev>",
            to: participant.email,
            subject: "Welcome to ByTech Virtual Hackathon 2026",
            html: emailHtml,
          }),
        });

        if (emailResponse.ok) {
          emailSent = true;
        } else {
          const resendError = await emailResponse.json();
          emailErrorMsg = JSON.stringify(resendError);
        }
      } catch (err: any) {
        emailErrorMsg = err.message;
      }
    } else {
      emailErrorMsg = "Resend API Key not configured in Supabase Secrets";
    }

    return new Response(
      JSON.stringify({
        success: true,
        participant: {
          id: participant.id,
          participant_id: participant.participant_id,
          full_name: participant.full_name,
          email: participant.email,
          payment_status: participant.payment_status,
          payment_id: participant.payment_id,
        },
        email_sent: emailSent,
        email_error: emailErrorMsg || null,
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
