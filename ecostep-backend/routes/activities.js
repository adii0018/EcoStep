const express = require('express');
const { body, param } = require('express-validator');
const protect = require('../middleware/auth');
const {
  createActivity,
  getActivities,
  getSummary,
  deleteActivity,
} = require('../controllers/activityController');
const { carbonFactors } = require('../lib/carbonFactors');

const router = express.Router();

// All routes below require a valid JWT
router.use(protect);

// Validation for creating an activity
const createActivityValidation = [
  body('category')
    .isIn(['travel', 'food', 'energy', 'shopping'])
    .withMessage('Category must be one of: travel, food, energy, shopping'),
  body('type').trim().notEmpty().withMessage('Type is required'),
  body('quantity')
    .isFloat({ min: 0.001 })
    .withMessage('Quantity must be a positive number'),
];

// ── GET /api/activities/summary  (must be BEFORE /:id) ────────────────────────
router.get('/summary', getSummary);

// ── GET /api/activities ───────────────────────────────────────────────────────
router.get('/', getActivities);

// ── POST /api/activities ──────────────────────────────────────────────────────
router.post('/', createActivityValidation, createActivity);

// ── DELETE /api/activities/:id ────────────────────────────────────────────────
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid activity ID')],
  deleteActivity
);

// ── GET /api/activities/factors  (convenience — returns all valid factors) ────
router.get('/factors', (_req, res) => {
  res.json({ carbonFactors });
});

module.exports = router;
