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
        const getInitials = (name: string): string => {
          if (!name) return 'BT';
          const parts = name.trim().split(/\s+/);
          if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        };
        const initials = getInitials(participant.full_name || '');
        const fullName = participant.full_name || '';
        const participantId = participant.participant_id || 'N/A';
        const email = participant.email || '';
        const whatsappLink = "https://chat.whatsapp.com/INzpDKvAVEPFmahN9STGWY?s=cl&p=a&ilr=1";

        const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ByTech Virtual Hackathon 2026</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#f0f4f8;font-family:'Space Grotesk',Arial,sans-serif;padding:30px 0}
  .ew{max-width:640px;margin:auto}
  .ec{background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e2e8f0}

  /* Hero */
  .hero{background:#1e3a8a;padding:48px 40px 40px;text-align:center}
  .hring{width:68px;height:68px;margin:0 auto 18px;position:relative}
  .hring svg{width:68px;height:68px;display:block}
  .hinn{position:absolute;inset:10px;background:#2563eb;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;font-family:'Inter',sans-serif}
  .htag{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:100px;padding:4px 14px;font-size:11px;font-weight:700;color:#bfdbfe;margin-bottom:14px;letter-spacing:0.5px;text-transform:uppercase}
  .pdot{width:6px;height:6px;background:#22d3ee;border-radius:50%;display:inline-block}
  .hero h1{font-family:'Inter',sans-serif;font-size:28px;font-weight:900;color:#fff;line-height:1.2;margin-bottom:6px}
  .hero h1 em{font-style:normal;color:#93c5fd}
  .hero p{font-size:14px;color:rgba(255,255,255,0.55);letter-spacing:1px;font-weight:500}
  .hstats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.1);border-radius:12px;margin-top:28px;overflow:hidden}
  .hs{background:#162d6e;padding:14px 10px;text-align:center}
  .hsn{font-family:'Inter',sans-serif;font-size:20px;font-weight:900;color:#fff}
  .hsn span{font-size:12px;color:#93c5fd;font-weight:600}
  .hsl{font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.5px;margin-top:3px;font-weight:600}

  /* Body */
  .body{padding:36px 36px 40px;background:#fff}
  .wavc{display:flex;align-items:flex-start;gap:14px;margin-bottom:30px}
  .ava{width:46px;height:46px;min-width:46px;border-radius:13px;background:#1e3a8a;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;font-family:'Inter',sans-serif}
  .wt h2{font-family:'Inter',sans-serif;font-size:19px;font-weight:800;color:#0f172a;margin-bottom:3px}
  .wt p{font-size:13px;color:#64748b;line-height:1.6}

  /* Section label */
  .slbl{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
  .slbl-line{flex:1;height:1px;background:#f1f5f9}

  /* Reg card */
  .rcard{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px 20px;margin-bottom:26px}
  .rrow{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9}
  .rrow:last-child{border-bottom:none;padding-bottom:0}
  .rrow:first-child{padding-top:0}
  .rk{font-size:13px;color:#64748b;font-weight:500}
  .rv{font-size:13px;color:#0f172a;font-weight:700}
  .bpaid{background:#dcfce7;color:#166534;font-size:11px;font-weight:800;padding:3px 10px;border-radius:100px}
  .bid{background:#eff6ff;color:#1e40af;font-size:12px;font-weight:800;padding:3px 10px;border-radius:7px;font-family:'Inter',sans-serif;letter-spacing:0.5px}

  /* Info grid */
  .igrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:26px}
  .ipill{background:#f8fafc;border:1px solid #e2e8f0;border-radius:11px;padding:13px 14px;display:flex;align-items:center;gap:10px}
  .ipill-icon{font-size:20px;color:#2563eb}
  .iplbl{font-size:10px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;color:#94a3b8}
  .ipval{font-size:13px;font-weight:700;color:#0f172a;margin-top:2px}

  /* Podium */
  .podium{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:26px;align-items:end}
  .pm{border-radius:16px;padding:20px 14px 18px;text-align:center;border:1px solid transparent}
  .pm.g{background:#fffbeb;border-color:#fde68a;transform:translateY(-8px)}
  .pm.s{background:#f8fafc;border-color:#e2e8f0}
  .pm.b{background:#fff7ed;border-color:#fed7aa}
  .pmmk{font-size:28px;margin-bottom:8px}
  .pmr{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#94a3b8;margin-bottom:4px}
  .pm.g .pmn{font-family:'Inter',sans-serif;font-size:24px;font-weight:900;color:#92400e}
  .pm.s .pmn{font-family:'Inter',sans-serif;font-size:24px;font-weight:900;color:#374151}
  .pm.b .pmn{font-family:'Inter',sans-serif;font-size:24px;font-weight:900;color:#9a3412}

  /* Steps */
  .steps{list-style:none;margin-bottom:26px}
  .step{display:flex;align-items:flex-start;gap:12px;padding:11px 0;border-bottom:1px solid #f1f5f9}
  .step:last-child{border-bottom:none}
  .snum{width:24px;height:24px;min-width:24px;border-radius:7px;background:#eff6ff;border:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#1d4ed8;font-family:'Inter',sans-serif}
  .stxt{font-size:13px;color:#374151;font-weight:500;line-height:1.5;padding-top:3px}

  /* CTA */
  .cta{background:#1e3a8a;border-radius:16px;padding:26px;text-align:center;margin-bottom:26px}
  .cta h3{font-family:'Inter',sans-serif;font-size:17px;font-weight:800;color:#fff;margin-bottom:4px}
  .cta p{font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:16px;font-weight:500}
  .ctab{display:inline-block;background:#fff;color:#1e3a8a;font-weight:800;font-size:13px;padding:11px 26px;border-radius:100px;cursor:pointer;font-family:'Space Grotesk',sans-serif;text-decoration:none}

  /* Footer */
  .foot{border-top:1px solid #f1f5f9;padding:18px 36px;display:flex;align-items:center;justify-content:space-between;background:#fff}
  .flogo{width:28px;height:28px;border-radius:7px;background:#1e3a8a;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;color:#fff;font-family:'Inter',sans-serif}
  .fbrand{display:flex;align-items:center;gap:9px}
  .fn{font-size:12px;font-weight:700;color:#0f172a}
  .fs{display:block;font-size:11px;font-weight:400;color:#94a3b8}
  .femail{font-size:12px;color:#94a3b8}
  .femail a{color:#2563eb;font-weight:600;text-decoration:none}

  @media(max-width:520px){
    .body{padding:24px 20px 28px}
    .igrid{grid-template-columns:1fr}
    .podium{grid-template-columns:1fr}
    .pm.g{transform:translateY(0)}
    .foot{flex-direction:column;gap:12px;text-align:center}
  }
</style>
</head>
<body>
<div class="ew">
<div class="ec">

  <!-- Hero -->
  <div class="hero">
    <div class="hring">
      <svg viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="34" cy="34" r="33" stroke="rgba(147,197,253,0.3)" stroke-width="1" stroke-dasharray="4 3"/>
      </svg>
      <div class="hinn"><img src="https://bytechsoftware.vercel.app/registration/bytechhackathon/logo.png" alt="ByTech" style="width:24px;height:24px;object-fit:contain;vertical-align:middle;" /></div>
    </div>
    <div class="htag"><span class="pdot"></span>Registration Confirmed</div>
    <h1>ByTech Virtual<br><em>Hackathon 2026</em></h1>
    <p>Build &nbsp;·&nbsp; Innovate &nbsp;·&nbsp; Win</p>
    <div class="hstats">
      <div class="hs"><div class="hsn">3<span>hr</span></div><div class="hsl">Duration</div></div>
      <div class="hs"><div class="hsn">AI</div><div class="hsl">Theme</div></div>
      <div class="hs"><div class="hsn">100<span>%</span></div><div class="hsl">Virtual</div></div>
    </div>
  </div>

  <!-- Body -->
  <div class="body">

    <!-- Welcome -->
    <div class="wavc">
      <div class="ava">\${initials}</div>
      <div class="wt">
        <h2>Welcome, \${fullName} 👋</h2>
        <p>Your registration is confirmed. We're excited to have you join the AI Innovation Challenge.</p>
      </div>
    </div>

    <!-- Registration Details -->
    <div class="slbl">
      <svg width="14" height="14" fill="none" stroke="#94a3b8" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
      Registration Details
      <span class="slbl-line"></span>
    </div>
    <div class="rcard">
      <div class="rrow"><span class="rk">Participant name</span><span class="rv">\${fullName}</span></div>
      <div class="rrow"><span class="rk">Participant ID</span><span class="bid">\${participantId}</span></div>
      <div class="rrow"><span class="rk">Email</span><span class="rv">\${email}</span></div>
      <div class="rrow"><span class="rk">Registration fee</span><span class="rv">₹99</span></div>
      <div class="rrow"><span class="rk">Payment status</span><span class="bpaid">Paid ✓</span></div>
    </div>

    <!-- Event Info -->
    <div class="slbl">
      <svg width="14" height="14" fill="none" stroke="#94a3b8" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      Event Info
      <span class="slbl-line"></span>
    </div>
    <div class="igrid">
      <div class="ipill">
        <svg class="ipill-icon" width="20" height="20" fill="none" stroke="#2563eb" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        <div><div class="iplbl">Mode</div><div class="ipval">100% Virtual</div></div>
      </div>
      <div class="ipill">
        <svg class="ipill-icon" width="20" height="20" fill="none" stroke="#2563eb" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <div><div class="iplbl">Duration</div><div class="ipval">3 Hours</div></div>
      </div>
      <div class="ipill">
        <svg class="ipill-icon" width="20" height="20" fill="none" stroke="#2563eb" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        <div><div class="iplbl">Participation</div><div class="ipval">Individual</div></div>
      </div>
      <div class="ipill">
        <svg class="ipill-icon" width="20" height="20" fill="none" stroke="#2563eb" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>
        <div><div class="iplbl">Theme</div><div class="ipval">AI Innovation</div></div>
      </div>
    </div>

    <!-- Prize Pool -->
    <div class="slbl">
      <svg width="14" height="14" fill="none" stroke="#94a3b8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M5 7H3v4a4 4 0 004 4h10a4 4 0 004-4V7h-2"/><rect x="5" y="3" width="14" height="8" rx="2"/></svg>
      Prize Pool
      <span class="slbl-line"></span>
    </div>
    <div class="podium">
      <div class="pm s">
        <div class="pmmk">🥈</div>
        <div class="pmr">2nd Place</div>
        <div class="pmn">₹1,000</div>
      </div>
      <div class="pm g">
        <div class="pmmk">🥇</div>
        <div class="pmr">1st Place</div>
        <div class="pmn">₹2,000</div>
      </div>
      <div class="pm b">
        <div class="pmmk">🥉</div>
        <div class="pmr">3rd Place</div>
        <div class="pmn">₹500</div>
      </div>
    </div>

    <!-- Next Steps -->
    <div class="slbl">
      <svg width="14" height="14" fill="none" stroke="#94a3b8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 11l3 3 8-8"/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      Next Steps
      <span class="slbl-line"></span>
    </div>
    <ul class="steps">
      <li class="step"><div class="snum">1</div><div class="stxt">Save your Participant ID — you'll need it on event day.</div></li>
      <li class="step"><div class="snum">2</div><div class="stxt">Join the official WhatsApp community for live updates.</div></li>
      <li class="step"><div class="snum">3</div><div class="stxt">Watch your inbox for the event schedule and challenge brief.</div></li>
      <li class="step"><div class="snum">4</div><div class="stxt">Set up your development environment ahead of time.</div></li>
      <li class="step"><div class="snum">5</div><div class="stxt">Be ready when the challenge goes live — stay sharp!</div></li>
    </ul>

    <!-- CTA -->
    <div class="cta">
      <h3>Ready to connect?</h3>
      <p>Join hundreds of participants in the official community</p>
      <a href="\${whatsappLink}" class="ctab">&#128172; Join WhatsApp Community</a>
    </div>

  </div>

  <!-- Footer -->
  <div class="foot">
    <div class="fbrand">
      <div class="flogo"><img src="https://bytechsoftware.vercel.app/registration/bytechhackathon/logo.png" alt="ByTech" style="width:16px;height:16px;object-fit:contain;vertical-align:middle;" /></div>
      <div>
        <div class="fn">ByTech Software Solutions</div>
        <span class="fs">Official Hackathon Organizer</span>
      </div>
    </div>
    <div class="femail"><a href="mailto:bytechsoftwares.support@gmail.com">bytechsoftwares.support@gmail.com</a></div>
  </div>

</div>
</div>
</body>
</html>\`;

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
