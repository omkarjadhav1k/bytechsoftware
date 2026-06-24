import { createFileRoute } from '@tanstack/react-router'
import nodemailer from 'nodemailer'

export const Route = createFileRoute('/api/send-email')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { to, subject, html } = body || {}

          if (!to || !subject || !html) {
            return new Response(
              JSON.stringify({ error: 'Missing parameters: to, subject, or html must be provided' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
          }

          const gmailUser = process.env.GMAIL_USER || 'bytechsoftwares.support@gmail.com'
          const gmailPass = process.env.GMAIL_PASS || 'hjnisuaercxpunmn'

          if (!gmailPass) {
            console.warn("GMAIL_PASS environment variable is not configured. Email will fail.")
            return new Response(
              JSON.stringify({ error: 'Email configuration error: GMAIL_PASS is missing' }),
              { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
          }

          // Configure the Gmail SMTP transporter
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: gmailUser,
              pass: gmailPass,
            },
          })

          // Send email using nodemailer
          const info = await transporter.sendMail({
            from: `"ByTech Software Solutions" <${gmailUser}>`,
            to,
            subject,
            html,
          })

          console.log("Email sent successfully via Gmail SMTP:", info.messageId)
          return new Response(
            JSON.stringify({ success: true, id: info.messageId }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        } catch (err: any) {
          console.error("Error sending email via Gmail SMTP:", err)
          return new Response(
            JSON.stringify({ error: err.message || 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          )
        }
      }
    }
  }
})
