import { defineEventHandler, readBody, createError } from 'h3'
import { supabaseAdmin } from '../../src/integrations/supabase/client.server'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, participant_db_id } = body || {}

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !participant_db_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required payment verification parameters',
      })
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
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Razorpay signature. Potential tampering detected.',
      })
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
        throw createError({
          statusCode: 500,
          statusMessage: `Database update failed: ${error.message}. Please configure RLS update permissions or Supabase secrets.`,
        })
      }
      updatedRecord = data
    }

    return { success: true, participant: updatedRecord }
  } catch (err: any) {
    console.error("Error verifying Razorpay payment:", err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'Internal Server Error',
    })
  }
})
