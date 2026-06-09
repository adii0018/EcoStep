import express from 'express'
import { protect } from '../middleware/auth.js'
import { getInsights } from '../controllers/insightController.js'

const router = express.Router()

// All insight routes require authentication
router.use(protect)

// POST /api/insights — generate AI-powered tips from recent activities
router.post('/', getInsights)

export default router
