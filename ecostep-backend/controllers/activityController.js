import mongoose from 'mongoose'
import { calculateCO2 } from '../lib/carbonFactors.js'
import Activity from '../models/Activity.js'
import { AppError } from '../lib/AppError.js'

/**
 * Create a new activity for the logged-in user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const createActivity = async (req, res, next) => {
  try {
    const { category, type, quantity, date } = req.body
    const co2 = calculateCO2(category, type, quantity)
    const activity = await Activity.create({
      userId: req.user.id,
      category,
      type,
      quantity,
      co2,
      ...(date && { date: new Date(date) }),
    })
    res.status(201).json({ success: true, data: activity, activity })
  } catch (err) {
    next(err)
  }
}

/**
 * Get all activities for the logged-in user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const getActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(100)
    res.json({
      success: true,
      count: activities.length,
      activities,
      data: activities,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Get aggregated carbon footprint summary for the user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id
    const now = new Date()
    const weekStart = new Date(now - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [weekData, monthData, breakdown, trend] = await Promise.all([
      Activity.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: weekStart },
          },
        },
        { $group: { _id: null, total: { $sum: '$co2' } } },
      ]),
      Activity.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: monthStart },
          },
        },
        { $group: { _id: null, total: { $sum: '$co2' } } },
      ]),
      Activity.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: monthStart },
          },
        },
        { $group: { _id: '$category', total: { $sum: '$co2' } } },
      ]),
      Activity.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: weekStart },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            total: { $sum: '$co2' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ])

    const INDIA_MONTHLY_AVG = 93
    const totalMonth = monthData[0]?.total || 0

    const summaryPayload = {
      totalCo2ThisWeek: Math.round((weekData[0]?.total || 0) * 10) / 10,
      totalCo2ThisMonth: Math.round(totalMonth * 10) / 10,
      savedVsAverage: Math.round((INDIA_MONTHLY_AVG - totalMonth) * 10) / 10,
      breakdown: Object.fromEntries(
        breakdown.map((b) => [b._id, Math.round(b.total * 10) / 10])
      ),
      weeklyTrend: trend.map((t) => Math.round(t.total * 10) / 10),
    }

    res.json({
      success: true,
      data: summaryPayload,
      ...summaryPayload,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Delete a specific activity of the user after ownership validation
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity) return next(new AppError('Activity not found', 404))
    if (activity.userId.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403))
    }
    await activity.deleteOne()
    res.json({ success: true, message: 'Activity deleted' })
  } catch (err) {
    next(err)
  }
}
