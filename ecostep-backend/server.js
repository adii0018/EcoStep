import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { connectDB } from './config/db.js'

import authRoutes from './routes/auth.js'
import activityRoutes from './routes/activities.js'
import insightRoutes from './routes/insights.js'

const app = express()

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
)

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
)

// Rate limiters
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' },
})
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts' },
})
app.use('/api/', limiter)
app.use('/api/auth/', authLimiter)

// ── Body parser ──────────────────────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date() })
})

// ── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/insights', insightRoutes)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.isOperational ? err.message : 'Internal server error'
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error(err.stack)
  }
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// ── Bootstrap ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    await connectDB()
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`)
    })
  })()
}

export default app
