import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'hackathon-dev-api',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (!req.url) return next()

            // 1. Send Email Endpoint
            if (req.url.includes('/api/send-email') && req.method === 'POST') {
              let body = ''
              req.on('data', chunk => { body += chunk.toString() })
              req.on('end', async () => {
                try {
                  const { to, subject, html } = JSON.parse(body)
                  const gmailUser = env.GMAIL_USER || 'bytechsoftwares.support@gmail.com'
                  const gmailPass = env.GMAIL_PASS

                  if (gmailPass) {
                    // Send via Gmail SMTP
                    const transporter = nodemailer.createTransport({
                      host: 'smtp.gmail.com',
                      port: 465,
                      secure: true,
                      auth: {
                        user: gmailUser,
                        pass: gmailPass,
                      },
                    })

                    const info = await transporter.sendMail({
                      from: `"ByTech Software Solutions" <${gmailUser}>`,
                      to,
                      subject,
                      html,
                    })

                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ success: true, id: info.messageId }))
                  } else {
                    // Fallback to Resend (standard Resend sandbox setup)
                    const resendApiKey = env.VITE_RESEND_API_KEY || 're_9GgGirVM_5cwX1X5mf5ciTqBngLygGr7Y'

                    const emailResponse = await fetch("https://api.resend.com/emails", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${resendApiKey}`,
                      },
                      body: JSON.stringify({
                        from: "ByTech Hackathon <no-reply@resend.dev>",
                        to,
                        subject,
                        html,
                      }),
                    })

                    const resData = await emailResponse.json()
                    res.writeHead(emailResponse.status, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify(resData))
                  }
                } catch (err: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: err.message }))
                }
              })
              return
            }

            // 2. Create Razorpay Order Endpoint
            if (req.url.includes('/api/create-razorpay-order') && req.method === 'POST') {
              let body = ''
              req.on('data', chunk => { body += chunk.toString() })
              req.on('end', async () => {
                try {
                  const { participantId, amount = 1 } = JSON.parse(body)
                  const keyId = env.VITE_RAZORPAY_KEY_ID || "rzp_live_T56Xgtqtsgt6Gf"
                  const keySecret = env.RAZORPAY_KEY_SECRET || "oXYKFt5sbH47T0TL11Cn5WZH"
                  const amountInPaise = amount * 9900

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

                  const orderData = await response.json() as any
                  if (!response.ok) {
                    res.writeHead(response.status, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify(orderData))
                    return
                  }

                  res.writeHead(200, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({
                    order_id: orderData.id,
                    key_id: keyId,
                    amount: orderData.amount,
                    currency: orderData.currency,
                  }))
                } catch (err: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: err.message }))
                }
              })
              return
            }

            // 3. Verify Payment Endpoint
            if (req.url.includes('/api/verify-payment') && req.method === 'POST') {
              let body = ''
              req.on('data', chunk => { body += chunk.toString() })
              req.on('end', async () => {
                try {
                  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, participant_db_id } = JSON.parse(body)
                  const keySecret = env.RAZORPAY_KEY_SECRET || "oXYKFt5sbH47T0TL11Cn5WZH"

                  const message = razorpay_order_id + "|" + razorpay_payment_id
                  const generatedSignature = crypto
                    .createHmac('sha256', keySecret)
                    .update(message)
                    .digest('hex')

                  const isValid = generatedSignature === razorpay_signature
                  if (!isValid) {
                    res.writeHead(400, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: "Invalid Razorpay signature" }))
                    return
                  }

                  // Update DB using the loaded anon client (supported by UPDATE policy)
                  const supabaseUrl = env.VITE_SUPABASE_URL || "https://nhnraalsnjnurzygwdic.supabase.co"
                  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_2bpFA0NK7XQqDSOnJkT9Jw_EYvl8hhe"
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
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: error.message }))
                    return
                  }

                  res.writeHead(200, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ success: true, participant: data }))
                } catch (err: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: err.message }))
                }
              })
              return
            }

            next()
          })
        }
      }
    ],
    base: '/registration/bytechhackathon/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
