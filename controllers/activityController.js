const { validationResult } = require('express-validator');
const Activity = require('../models/Activity');
const { calculateCO2 } = require('../lib/carbonFactors');

// India average monthly carbon footprint in kg CO₂
const INDIA_MONTHLY_AVERAGE_KG = 93;

// ── POST /api/activities ─────────────────────────────────────────────────────
const createActivity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { category, type, quantity, date } = req.body;

    const co2 = calculateCO2(category, type, quantity);
    if (co2 === null) {
      return res.status(400).json({
        message: `Unknown activity type "${type}" for category "${category}". Check /api/factors for valid types.`,
      });
    }

    const activity = await Activity.create({
      userId: req.user._id,
      category,
      type,
      quantity,
      co2,
      date: date ? new Date(date) : undefined,
    });

    res.status(201).json({ message: 'Activity logged successfully.', activity });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: 'Server error while logging activity.' });
  }
};

// ── GET /api/activities ──────────────────────────────────────────────────────
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(100);

    res.json({ count: activities.length, activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error while fetching activities.' });
  }
};

// ── GET /api/activities/summary ──────────────────────────────────────────────
const getSummary = async (req, res) => {
  try {
    const now = new Date();

    // Week boundary (last 7 days)
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    // Month boundary (1st of current month)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all activities needed for both ranges (pull from month start)
    const allMonthActivities = await Activity.find({
      userId: req.user._id,
      date: { $gte: monthStart },
    });

    let totalCo2ThisWeek = 0;
    let totalCo2ThisMonth = 0;
    const breakdown = { travel: 0, food: 0, energy: 0, shopping: 0 };

    for (const act of allMonthActivities) {
      totalCo2ThisMonth += act.co2;
      breakdown[act.category] = parseFloat(
        ((breakdown[act.category] || 0) + act.co2).toFixed(4)
      );
      if (new Date(act.date) >= weekStart) {
        totalCo2ThisWeek += act.co2;
      }
    }

    totalCo2ThisWeek = parseFloat(totalCo2ThisWeek.toFixed(4));
    totalCo2ThisMonth = parseFloat(totalCo2ThisMonth.toFixed(4));

    // Positive = user emitted LESS than average (good), negative = MORE
    const savedVsAverage = parseFloat(
      (INDIA_MONTHLY_AVERAGE_KG - totalCo2ThisMonth).toFixed(4)
    );

    res.json({
      totalCo2ThisWeek,
      totalCo2ThisMonth,
      breakdown,
      savedVsAverage,
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ message: 'Server error while calculating summary.' });
  }
};

// ── DELETE /api/activities/:id ───────────────────────────────────────────────
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found or not owned by you.' });
    }

    await activity.deleteOne();
    res.json({ message: 'Activity deleted successfully.' });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid activity ID format.' });
    }
    console.error('Delete activity error:', error);
    res.status(500).json({ message: 'Server error while deleting activity.' });
  }
};

module.exports = { createActivity, getActivities, getSummary, deleteActivity };
