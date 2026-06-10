import express from 'express'
import { body } from 'express-validator'
import { protect } from '../middleware/auth.js'
import {
  getProfile,
  updateProfile,
  getLeaderboard,
  getAnalytics,
} from '../controllers/userController.js'

const router = express.Router()

router.use(protect)

router.get('/profile', getProfile)
router.put(
  '/profile',
  [
    body('name').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1–100 chars'),
    body('city').optional().isString().trim().isLength({ max: 100 }).withMessage('City max 100 chars'),
  ],
  updateProfile
)
router.get('/leaderboard', getLeaderboard)
router.get('/analytics', getAnalytics)

export default router
