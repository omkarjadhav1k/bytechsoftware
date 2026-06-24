import { defineEventHandler, readBody, createError } from 'h3'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { to, subject, html } = body || {}

    if (!to || !subject || !html) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing parameters: to, subject, or html must be provided',
      })
    }

    const gmailUser = process.env.GMAIL_USER || 'bytechsoftwares.support@gmail.com'
    const gmailPass = process.env.GMAIL_PASS || 'hjnisuaercxpunmn'

    if (!gmailPass) {
      console.warn("GMAIL_PASS environment variable is not configured. Email will fail unless in mock/dev mode.")
      throw createError({
        statusCode: 500,
        statusMessage: 'Email configuration error: GMAIL_PASS is missing',
      })
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
    return { success: true, id: info.messageId }
  } catch (err: any) {
    console.error("Error sending email via Gmail SMTP:", err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'Internal Server Error',
    })
  }
})

