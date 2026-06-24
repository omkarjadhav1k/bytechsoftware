import { createFileRoute } from '@tanstack/react-router'
import { supabaseAdmin } from '../../integrations/supabase/client.server'
import { createClient } from '@supabase/supabase-js'

export const Route = createFileRoute('/api/verify-payment')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature, participant_db_id } = body || {}

          if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !participant_db_id) {
            return new Response(
              JSON.stringify({ error: 'Missing required payment verification parameters' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
          }

          const keySecret = process.env.RAZORPAY_KEY_SECRET || "oXYKFt5sbH47T0TL11Cn5WZH"

          // 1. Cryptographically verify Razorpay signature
          const message = razorpay_order_id + "|" + razorpay_payment_id
          const encoder = new TextEncoder()
          const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(keySecret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
          )
          const signatureBuffer = await crypto.subtle.sign(
            "HMAC",
            key,
            encoder.encode(message)
          )
          const signatureArray = Array.from(new Uint8Array(signatureBuffer))
          const generatedSignature = signatureArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")

          const isValid = generatedSignature === razorpay_signature

          if (!isValid) {
            return new Response(
              JSON.stringify({ error: 'Invalid Razorpay signature. Potential tampering detected.' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
          }

          // 2. Update participant record in Supabase database
          let dbError = null
          let updatedRecord = null

          try {
            // First, try using the service role admin client (bypasses RLS)
            const { data, error } = await supabaseAdmin
              .from("participants")
              .update({
                payment_status: "paid",
                payment_id: razorpay_payment_id
              })
              .eq("id", participant_db_id)
              .select()
              .single()

            if (error) {
              dbError = error
            } else {
              updatedRecord = data
            }
          } catch (adminErr: any) {
            console.warn("supabaseAdmin client failed, trying fallback client...", adminErr)
            dbError = adminErr
          }

          // Fallback: If supabaseAdmin fails or is not configured (e.g. missing service key),
          // try using standard anon client (which works if the UPDATE RLS policy is enabled).
          if (dbError || !updatedRecord) {
            const supabaseUrl = process.env.SUPABASE_URL || "https://nhnraalsnjnurzygwdic.supabase.co"
            const supabaseAnonKey = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_2bpFA0NK7XQqDSOnJkT9Jw_EYvl8hhe"
            
            const supabase = createClient(supabaseUrl, supabaseAnonKey)
            const { data, error } = await supabase
              .from("participants")
              .update({
                payment_status: "paid",
                payment_id: razorpay_payment_id
              })
              .eq("id", participant_db_id)
              .select()
              .single()

            if (error) {
              return new Response(
                JSON.stringify({ error: `Database update failed: ${error.message}. Please configure RLS update permissions or Supabase secrets.` }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
              )
            }
            updatedRecord = data
          }

          return new Response(
            JSON.stringify({ success: true, participant: updatedRecord }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        } catch (err: any) {
          console.error("Error verifying Razorpay payment:", err)
          return new Response(
            JSON.stringify({ error: err.message || 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          )
        }
      }
    }
  }
})
