import { defineEventHandler, readBody, createError } from 'h3'

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

    // Securely read Resend API key on Vercel server environment
    const resendApiKey = process.env.VITE_RESEND_API_KEY || "re_9GgGirVM_5cwX1X5mf5ciTqBngLygGr7Y";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "ByTech Hackathon <noreply@bytechsoftware.com>",
        to,
        subject,
        html,
      }),
    });

    const data = await response.json();
    return data;
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'Internal Server Error',
    })
  }
})
