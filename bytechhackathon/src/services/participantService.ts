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

// Seed dummy data for local mock mode matching the new table schema
const seedMockData = () => {
  if (localStorage.getItem(MOCK_PARTICIPANTS_KEY)) return

  const mockData: Participant[] = [
    {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      participant_id: 'BTH2026-0001',
      full_name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      whatsapp_number: '9876543210',
      contact_number: '9876543210',
      college_name: 'Delhi Technological University',
      university_name: 'Delhi Technological University',
      degree: 'B.Tech',
      branch: 'Computer Science',
      study_year: '3rd Year',
      github_url: 'https://github.com/rahulsharma',
      linkedin_url: 'https://linkedin.com/in/rahulsharma',
      skills: 'React, Node.js, Express, PostgreSQL',
      payment_id: 'pay_P1A2B3C4D5E6F7',
      payment_status: 'paid',
      created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString() // 3 days ago
    },
    {
      id: 'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e',
      participant_id: 'BTH2026-0002',
      full_name: 'Ananya Iyer',
      email: 'ananya.iyer@yahoo.com',
      whatsapp_number: '9123456789',
      contact_number: '9123456789',
      college_name: 'RV College of Engineering',
      university_name: 'Visvesvaraya Technological University',
      degree: 'B.E.',
      branch: 'Information Science',
      study_year: '2nd Year',
      github_url: 'https://github.com/ananyaiyer',
      linkedin_url: 'https://linkedin.com/in/ananyaiyer',
      skills: 'Python, Machine Learning, TensorFlow, Pandas',
      payment_id: 'pay_P2B3C4D5E6F7G8',
      payment_status: 'paid',
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString() // 2 days ago
    },
    {
      id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
      participant_id: null,
      full_name: 'Devansh Verma',
      email: 'devansh.v@outlook.com',
      whatsapp_number: '8887776665',
      contact_number: '8887776665',
      college_name: 'IIT Bombay',
      university_name: 'Indian Institute of Technology',
      degree: 'B.Tech',
      branch: 'Electrical Engineering',
      study_year: '4th Year',
      github_url: 'https://github.com/devanshverma',
      linkedin_url: 'https://linkedin.com/in/devanshverma',
      skills: 'Embedded Systems, IoT, C, Web3',
      payment_id: null,
      payment_status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
    },
    {
      id: 'd4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
      participant_id: 'BTH2026-0003',
      full_name: 'Siddhi Patel',
      email: 'siddhi.patel@gmail.com',
      whatsapp_number: '7776665554',
      contact_number: '7776665554',
      college_name: 'Nirma University',
      university_name: 'Nirma University',
      degree: 'B.Tech',
      branch: 'Computer Science',
      study_year: '3rd Year',
      github_url: 'https://github.com/siddhipatel',
      linkedin_url: 'https://linkedin.com/in/siddhipatel',
      skills: 'UI/UX Design, Figma, TailwindCSS, Next.js',
      payment_id: 'pay_P3C4D5E6F7G8H9',
      payment_status: 'paid',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
    },
    {
      id: 'e5f67a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
      participant_id: null,
      full_name: 'Karan Malhotra',
      email: 'karan.malhotra@gmail.com',
      whatsapp_number: '9998887776',
      contact_number: '9998887776',
      college_name: 'SRM Institute of Science and Technology',
      university_name: 'SRM University',
      degree: 'B.Tech',
      branch: 'Software Engineering',
      study_year: '2nd Year',
      github_url: 'https://github.com/karanm',
      linkedin_url: 'https://linkedin.com/in/karanm',
      skills: 'Node.js, Express, MongoDB, Redis',
      payment_id: null,
      payment_status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
    }
  ]

  localStorage.setItem(MOCK_PARTICIPANTS_KEY, JSON.stringify(mockData))
  localStorage.setItem(MOCK_SEQ_KEY, '3')
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
      amount: 100 // ₹1 (100 paise)
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
            await fetch(`${window.location.origin}/api/send-email`, {
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
        await fetch(`${window.location.origin}/api/send-email`, {
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

// Helper to generate registration welcome email HTML
function getEmailHtml(participant: Participant): string {
  return `
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
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          border: 1px solid #f3f4f6;
          padding: 40px 30px;
        }
        .header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          padding: 30px;
          text-align: center;
          color: #ffffff;
          border-radius: 8px;
        }
        .badge {
          background-color: #eff6ff;
          border: 1px dashed #3b82f6;
          padding: 12px 24px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0; font-size:24px;">ByTech Virtual Hackathon 2026</h1>
          <p style="margin:5px 0 0 0; font-size:14px; opacity:0.9;">Registration Confirmed - ByTech Software Solutions</p>
        </div>
        <p style="font-size:16px; margin-top:28px;">Hi ${participant.full_name},</p>
        <p>Thank you for registering! Your payment of <strong>₹99</strong> has been successfully processed, and your registration is confirmed.</p>
        <div class="badge">
          <div style="font-size:11px; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Your Unique Participant ID</div>
          <div style="font-size:22px; color:#1e3a8a; font-weight:bold; font-family:monospace;">${participant.participant_id}</div>
        </div>
        <p>Best regards,<br/><strong>ByTech Software Solutions Team</strong></p>
      </div>
    </body>
    </html>
  `;
}
