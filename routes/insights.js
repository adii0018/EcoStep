const express = require('express');
const protect = require('../middleware/auth');
const { getInsights } = require('../controllers/insightController');

const router = express.Router();

// All insight routes require authentication
router.use(protect);

// POST /api/insights — generate AI-powered tips from recent activities
router.post('/', getInsights);

module.exports = router;
