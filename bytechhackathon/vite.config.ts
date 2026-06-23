import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'send-email-api',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.includes('/api/send-email')) {
              if (req.method === 'POST') {
                let body = ''
                req.on('data', chunk => {
                  body += chunk.toString()
                })
                req.on('end', async () => {
                  try {
                    const { to, subject, html } = JSON.parse(body)
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
                  } catch (err: any) {
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: err.message }))
                  }
                })
                return
              }
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
