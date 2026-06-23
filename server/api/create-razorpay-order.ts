import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { participantId, amount = 1 } = body || {}

    if (!participantId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Participant ID (UUID) is required',
      })
    }

    // Read keys from environment or use user's live credentials as fallback
    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_live_T56Xgtqtsgt6Gf"
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "oXYKFt5sbH47T0TL11Cn5WZH"

    // Razorpay amount is in paise (₹1 = 100 paise)
    const amountInPaise = amount * 100

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
    })

    const orderData = await response.json()

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: orderData.error?.description || "Failed to create Razorpay order",
      })
    }

    return {
      order_id: orderData.id,
      key_id: keyId,
      amount: orderData.amount,
      currency: orderData.currency,
    }
  } catch (err: any) {
    console.error("Error creating Razorpay order:", err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'Internal Server Error',
    })
  }
})
