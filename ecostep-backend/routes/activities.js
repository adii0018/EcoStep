import express from 'express'
import { body, param, validationResult } from 'express-validator'
import { protect } from '../middleware/auth.js'
import {
  createActivity,
  getActivities,
  getSummary,
  deleteActivity,
} from '../controllers/activityController.js'
import { FACTORS } from '../lib/carbonFactors.js'

const router = express.Router()

/**
 * Route validator error handler middleware
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}

const validateActivity = [
  body('category')
    .isIn(['travel', 'food', 'energy', 'shopping'])
    .withMessage('Invalid category'),
  body('type')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Type is required'),
  body('quantity')
    .isFloat({ min: 0, max: 100000 })
    .withMessage('Quantity must be between 0 and 100000'),
]

const validateDelete = [
  param('id').isMongoId().withMessage('Invalid activity ID'),
]

// All routes require authentication
router.use(protect)

router.get('/summary', getSummary)
router.get('/', getActivities)
router.post('/', validateActivity, handleValidation, createActivity)
router.delete('/:id', validateDelete, handleValidation, deleteActivity)

// Convenience route for factors list
router.get('/factors', (_req, res) => {
  res.json({ success: true, carbonFactors: FACTORS })
})

export default router
