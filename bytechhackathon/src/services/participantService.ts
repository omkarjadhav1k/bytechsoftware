import { supabase, isSupabaseConfigured } from './supabase'

export interface Participant {
  id: string;
  participant_id: string | null;
  full_name: string;
  email: string;
  whatsapp_number: string;
  contact_number: string;
  college_name: string;
  university_name: string;
  degree: string;
  branch: string;
  study_year: string;
  github_url: string;
  linkedin_url: string;
  skills: string;
  payment_id: string | null;
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

export interface AdminStats {
  totalRegistrations: number;
  paidRegistrations: number;
  pendingRegistrations: number;
  totalRevenue: number;
}

const MOCK_PARTICIPANTS_KEY = 'bytech_hackathon_participants'
const MOCK_SEQ_KEY = 'bytech_hackathon_seq'

// Seed empty array for local mock mode to start fresh
const seedMockData = () => {
  if (localStorage.getItem(MOCK_PARTICIPANTS_KEY)) return

  const mockData: Participant[] = []

  localStorage.setItem(MOCK_PARTICIPANTS_KEY, JSON.stringify(mockData))
  localStorage.setItem(MOCK_SEQ_KEY, '0')
}

// Initialize seed data
seedMockData()

export const participantService = {
  // 1. Submit Registration (stores temporarily as 'pending')
  async createPendingRegistration(data: Omit<Participant, 'id' | 'participant_id' | 'payment_id' | 'payment_status' | 'created_at'>): Promise<string> {
    const { agree, ...insertData } = data as any;
    
    if (isSupabaseConfigured) {
      const { data: newRecord, error } = await supabase
        .from('participants')
        .insert([{
          ...insertData,
          payment_status: 'pending'
        }])
        .select('id')
        .single()

      if (error) {
        if (error.code === '23505' || error.message.includes('unique')) {
          throw new Error('This email address is already registered.')
        }
        throw new Error(error.message)
      }
      return newRecord.id
    } else {
      // Mock mode
      const participants = this.getMockParticipants()
      
      if (participants.some(p => p.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('This email address is already registered.')
      }

      const newId = crypto.randomUUID()
      const newParticipant: Participant = {
        ...insertData,
        id: newId,
        participant_id: null,
        payment_id: null,
        payment_status: 'pending',
        created_at: new Date().toISOString()
      }

      participants.unshift(newParticipant)
      this.saveMockParticipants(participants)
      return newId
    }
  },

  // 2. Razorpay Order Creation via Serverless API
  async createRazorpayOrder(participantId: string): Promise<{ order_id: string; key_id: string; amount: number }> {
    try {
      const response = await fetch(`${window.location.origin}/api/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantId, amount: 1 }), // ₹1 for live testing
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.statusMessage || 'Failed to create order via Vercel server API')
      }

      return await response.json()
    } catch (err: any) {
      console.warn("Vercel server API order creation failed, falling back to local mock order:", err)
      return this.createMockRazorpayOrder(participantId)
    }
  },

  // Mock Razorpay order generator
  createMockRazorpayOrder(participantId: string) {
    return {
      order_id: `order_mock_${participantId.substring(0, 8)}_${Math.random().toString(36).substring(2, 6)}`,
      key_id: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_T56Xgtqtsgt6Gf',
      amount: 9900 // ₹99 (9900 paise)
    }
  },

  // 3. Verify Payment and finalize registration
  async verifyPaymentAndConfirm(
    paymentDetails: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
      participant_db_id: string;
    }
  ): Promise<Participant> {
    try {
      // 1. Try calling the Vercel Server API verify endpoint first
      const response = await fetch(`${window.location.origin}/api/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentDetails),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.participant) {
          // Send welcome email directly using the local API proxy
          try {
            const emailRes = await fetch(`${window.location.origin}/api/send-email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: result.participant.email,
                subject: "Welcome to ByTech Virtual Hackathon 2026",
                html: getEmailHtml(result.participant),
              }),
            })
            if (!emailRes.ok) {
              const errBody = await emailRes.json().catch(() => ({}))
              console.error("Welcome email delivery failed:", errBody)
            } else {
              console.log("Welcome email sent successfully!")
            }
          } catch (emailErr) {
            console.error("Direct welcome email failed to send:", emailErr)
          }
          return result.participant
        }
      }
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.statusMessage || 'Server API verification failed')
    } catch (err: any) {
      console.warn("Vercel server API verification failed, trying direct frontend confirmation:", err)
    }

    if (isSupabaseConfigured) {
      // 2. FALLBACK: Direct frontend update to Supabase database (requires RLS update permission or disabled RLS)
      const { data: updated, error: updateError } = await supabase
        .from('participants')
        .update({
          payment_status: 'paid',
          payment_id: paymentDetails.razorpay_payment_id
        })
        .eq('id', paymentDetails.participant_db_id)
        .select()
        .single()

      if (updateError || !updated) {
        throw new Error(
          `Frontend confirmation failed: ${updateError?.message || 'Record not found'}. ` +
          `Please ensure RLS is disabled (or an UPDATE policy is configured) on the 'participants' table.`
        )
      }

      // 3. Send welcome email directly using the local API proxy (bypassing browser CORS)
      try {
        const emailRes = await fetch(`${window.location.origin}/api/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: updated.email,
            subject: "Welcome to ByTech Virtual Hackathon 2026",
            html: getEmailHtml(updated),
          }),
        })
        if (!emailRes.ok) {
          const errBody = await emailRes.json().catch(() => ({}))
          console.error("Fallback welcome email delivery failed:", errBody)
        } else {
          console.log("Fallback welcome email sent successfully!")
        }
      } catch (emailErr) {
        console.error("Direct welcome email failed to send:", emailErr)
      }

      return updated
    } else {
      // Mock flow: update local state, generate sequence id
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const participants = this.getMockParticipants()
          const index = participants.findIndex(p => p.id === paymentDetails.participant_db_id)

          if (index === -1) {
            reject(new Error('Participant record not found'))
            return
          }

          const currentSeq = parseInt(localStorage.getItem(MOCK_SEQ_KEY) || '0', 10)
          const nextSeq = currentSeq + 1
          localStorage.setItem(MOCK_SEQ_KEY, nextSeq.toString())

          const paddedSeq = nextSeq.toString().padStart(4, '0')
          const participantId = `BTH2026-${paddedSeq}`

          const updatedParticipant: Participant = {
            ...participants[index],
            payment_status: 'paid',
            payment_id: paymentDetails.razorpay_payment_id,
            participant_id: participantId
          }

          participants[index] = updatedParticipant
          this.saveMockParticipants(participants)
          resolve(updatedParticipant)
        }, 1500)
      })
    }
  },

  // 4. Retrieve Participant Details
  async getParticipantById(id: string): Promise<Participant> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      return data
    } else {
      const participants = this.getMockParticipants()
      const participant = participants.find(p => p.id === id)
      if (!participant) throw new Error('Participant not found.')
      return participant
    }
  },

  // 5. Admin Dashboard Statistics
  async getAdminStats(): Promise<AdminStats> {
    if (isSupabaseConfigured) {
      const { data: participants, error } = await supabase
        .from('participants')
        .select('payment_status')

      if (error) throw new Error(error.message)

      const stats = {
        totalRegistrations: participants.length,
        paidRegistrations: participants.filter((p: any) => p.payment_status === 'paid').length,
        pendingRegistrations: participants.filter((p: any) => p.payment_status === 'pending').length,
        totalRevenue: participants.filter((p: any) => p.payment_status === 'paid').length * 1
      }
      return stats
    } else {
      const participants = this.getMockParticipants()
      const paidCount = participants.filter(p => p.payment_status === 'paid').length
      return {
        totalRegistrations: participants.length,
        paidRegistrations: paidCount,
        pendingRegistrations: participants.filter(p => p.payment_status === 'pending').length,
        totalRevenue: paidCount * 1
      }
    }
  },

  // 6. Admin Panel Participant List
  async getParticipantsList(): Promise<Participant[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data
    } else {
      return this.getMockParticipants()
    }
  },

  // Helper local storage mock functions
  getMockParticipants(): Participant[] {
    const data = localStorage.getItem(MOCK_PARTICIPANTS_KEY)
    return data ? JSON.parse(data) : []
  },

  saveMockParticipants(data: Participant[]): void {
    localStorage.setItem(MOCK_PARTICIPANTS_KEY, JSON.stringify(data))
  }
}

function getInitials(name: string): string {
  if (!name) return 'BT'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Helper to generate registration welcome email HTML
function getEmailHtml(participant: Participant): string {
  const initials = getInitials(participant.full_name)
  const fullName = participant.full_name
  const participantId = participant.participant_id || 'N/A'
  const email = participant.email
  const whatsappLink = "https://chat.whatsapp.com/INzpDKvAVEPFmahN9STGWY?s=cl&p=a&ilr=1"

  return `<!DOCTYPE html>
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
  .ec{background:#f0f4f8;border-radius:24px;overflow:hidden;border:1px solid #e2e8f0}

  /* Hero */
  .hero{background:#1e3a8a;padding:48px 40px 40px;text-align:center}
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
  .body{padding:36px 36px 40px;background:#f0f4f8}
  .wavc{display:flex;align-items:flex-start;gap:14px;margin-bottom:30px}
  .ava{width:46px;height:46px;min-width:46px;border-radius:13px;background:#1e3a8a;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;font-family:'Inter',sans-serif}
  .wt h2{font-family:'Inter',sans-serif;font-size:19px;font-weight:800;color:#0f172a;margin-bottom:3px}
  .wt p{font-size:13px;color:#64748b;line-height:1.6}

  /* Section label */
  .slbl{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
  .slbl-line{flex:1;height:1px;background:#e2e8f0}

  /* Reg card */
  .rcard{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:18px 20px;margin-bottom:26px}
  .rrow{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9}
  .rrow:last-child{border-bottom:none;padding-bottom:0}
  .rrow:first-child{padding-top:0}
  .rk{font-size:13px;color:#64748b;font-weight:500}
  .rv{font-size:13px;color:#0f172a;font-weight:700}
  .bpaid{background:#dcfce7;color:#166534;font-size:11px;font-weight:800;padding:3px 10px;border-radius:100px}
  .bid{background:#eff6ff;color:#1e40af;font-size:12px;font-weight:800;padding:3px 10px;border-radius:7px;font-family:'Inter',sans-serif;letter-spacing:0.5px}

  /* Info grid */
  .igrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:26px}
  .ipill{background:#ffffff;border:1px solid #e2e8f0;border-radius:11px;padding:13px 14px;display:flex;align-items:center;gap:10px}
  .ipill-icon{font-size:20px;color:#2563eb}
  .iplbl{font-size:10px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;color:#94a3b8}
  .ipval{font-size:13px;font-weight:700;color:#0f172a;margin-top:2px}

  /* Podium */
  .podium{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:26px;align-items:end}
  .pm{border-radius:16px;padding:20px 14px 18px;text-align:center;border:1px solid transparent}
  .pm.g{background:#fffbeb;border-color:#fde68a;transform:translateY(-8px)}
  .pm.s{background:#ffffff;border-color:#e2e8f0}
  .pm.b{background:#fff7ed;border-color:#fed7aa}
  .pmmk{font-size:28px;margin-bottom:8px}
  .pmr{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#94a3b8;margin-bottom:4px}
  .pm.g .pmn{font-family:'Inter',sans-serif;font-size:24px;font-weight:900;color:#92400e}
  .pm.s .pmn{font-family:'Inter',sans-serif;font-size:24px;font-weight:900;color:#374151}
  .pm.b .pmn{font-family:'Inter',sans-serif;font-size:24px;font-weight:900;color:#9a3412}

  /* Steps */
  .steps{list-style:none;margin-bottom:26px}
  .step{display:flex;align-items:flex-start;gap:12px;padding:11px 0;border-bottom:1px solid #e2e8f0}
  .step:last-child{border-bottom:none}
  .snum{width:24px;height:24px;min-width:24px;border-radius:7px;background:#eff6ff;border:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#1d4ed8;font-family:'Inter',sans-serif}
  .stxt{font-size:13px;color:#374151;font-weight:500;line-height:1.5;padding-top:3px}

  /* CTA */
  .cta{background:#1e3a8a;border-radius:16px;padding:26px;text-align:center;margin-bottom:26px}
  .cta h3{font-family:'Inter',sans-serif;font-size:17px;font-weight:800;color:#fff;margin-bottom:4px}
  .cta p{font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:16px;font-weight:500}
  .ctab{display:inline-block;background:#fff;color:#1e3a8a;font-weight:800;font-size:13px;padding:11px 26px;border-radius:100px;cursor:pointer;font-family:'Space Grotesk',sans-serif;text-decoration:none}

  /* Footer */
  .foot{border-top:1px solid #e2e8f0;padding:18px 36px;display:flex;align-items:center;justify-content:space-between;background:#f0f4f8}
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
    <img src="https://bytechsoftware.vercel.app/registration/bytechhackathon/logo.png" alt="ByTech Logo" style="width:48px;height:48px;object-fit:contain;margin:0 auto 16px;display:block;" />
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
      <div class="ava">${initials}</div>
      <div class="wt">
        <h2>Welcome, ${fullName} 👋</h2>
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
      <div class="rrow"><span class="rk">Participant name</span><span class="rv">${fullName}</span></div>
      <div class="rrow"><span class="rk">Participant ID</span><span class="bid">${participantId}</span></div>
      <div class="rrow"><span class="rk">Email</span><span class="rv">${email}</span></div>
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
      <a href="${whatsappLink}" class="ctab">&#128172; Join WhatsApp Community</a>
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
</html>`
}
