import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import generateRouter from './routes/generate.js'
import { rateLimit } from './middleware/rateLimit.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.ALLOWED_ORIGIN, // Set this to your Render URL in production
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, same-origin in prod)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, true) // In production, same-origin requests pass anyway
    }
  },
}))
app.use(express.json({ limit: '50mb' }))

// Rate limiting for API routes
app.use('/api', rateLimit)

// API routes
app.use('/api', generateRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.GEMINI_API_KEY })
})

// In production, serve the built frontend
if (process.env.NODE_ENV === `production`) {
  const distPath = join(__dirname, `..`, `dist`)
  app.use(express.static(distPath))
  app.get(/(.*)/, (req, res) => {
    res.sendFile(join(distPath, `index.html`))
  })
}

app.listen(PORT, () => {
  console.log(`Fatma Shooting Studio server running on http://localhost:${PORT}`)
  if (!process.env.GEMINI_API_KEY) {
    console.warn(`Warning: GEMINI_API_KEY is not set. Add it to .env file.`)
  }
})
