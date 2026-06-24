import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/create-razorpay-order')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { participantId, amount = 1 } = body || {}

          if (!participantId) {
            return new Response(
              JSON.stringify({ error: 'Participant ID (UUID) is required' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
          }

          // Read keys from environment or use user's live credentials as fallback
          const keyId = process.env.VITE_RAZORPAY_KEY_ID || "rzp_live_T56Xgtqtsgt6Gf"
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
            return new Response(
              JSON.stringify({ error: orderData.error?.description || "Failed to create Razorpay order" }),
              { status: response.status, headers: { 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({
              order_id: orderData.id,
              key_id: keyId,
              amount: orderData.amount,
              currency: orderData.currency,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        } catch (err: any) {
          console.error("Error creating Razorpay order:", err)
          return new Response(
            JSON.stringify({ error: err.message || 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          )
        }
      }
    }
  }
})
