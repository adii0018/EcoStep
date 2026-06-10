import mongoose from 'mongoose'
import { calculateCO2 } from '../lib/carbonFactors.js'
import Activity from '../models/Activity.js'
import User from '../models/User.js'
import { AppError } from '../lib/AppError.js'

/** Award EcoPoints and update streak for a user after logging an activity */
async function awardPoints(userId, co2) {
  const points = Math.max(5, Math.ceil(co2 * 2))
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const user = await User.findById(userId)
  if (!user) return

  const lastDate = user.lastActivityDate ? new Date(user.lastActivityDate) : null
  if (lastDate) lastDate.setHours(0, 0, 0, 0)

  const isToday = lastDate && lastDate.getTime() === today.getTime()
  const isYesterday = lastDate && today - lastDate === 86400000

  const streakIncrement = isToday ? 0 : isYesterday ? 1 : 0
  const streakReset = !isToday && !isYesterday ? 1 : undefined
  const streakBonus = !isToday && isYesterday ? 10 : 0

  await User.findByIdAndUpdate(userId, {
    $inc: { ecoPoints: points + streakBonus },
    $set: {
      lastActivityDate: new Date(),
      streak: streakReset ?? user.streak + streakIncrement,
    },
  })
  return points + streakBonus
}

/**
 * Create a new activity for the logged-in user
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

    const pointsEarned = await awardPoints(req.user.id, co2)

    res.status(201).json({ success: true, data: activity, activity, pointsEarned })
  } catch (err) {
    next(err)
  }
}

/**
 * Get all activities for the logged-in user (with optional filters & pagination)
 * Query params: category, from, to, page (default 1), limit (default 50)
 */
export const getActivities = async (req, res, next) => {
  try {
    const { category, from, to, page = 1, limit = 50 } = req.query
    const filter = { userId: req.user.id }

    if (category && ['travel', 'food', 'energy', 'shopping'].includes(category)) {
      filter.category = category
    }
    if (from || to) {
      filter.date = {}
      if (from) filter.date.$gte = new Date(from)
      if (to) {
        const toDate = new Date(to)
        toDate.setHours(23, 59, 59, 999)
        filter.date.$lte = toDate
      }
    }

    const skip = (Number(page) - 1) * Number(limit)
    const [activities, total] = await Promise.all([
      Activity.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Activity.countDocuments(filter),
    ])

    res.json({
      success: true,
      count: activities.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      activities,
      data: activities,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Update a specific activity (recalculates CO₂)
 */
export const updateActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity) return next(new AppError('Activity not found', 404))
    if (activity.userId.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403))
    }

    const { category, type, quantity, date } = req.body
    const co2 = calculateCO2(category, type, quantity)

    activity.category = category
    activity.type = type
    activity.quantity = quantity
    activity.co2 = co2
    if (date) activity.date = new Date(date)
    await activity.save()

    res.json({ success: true, data: activity, activity })
  } catch (err) {
    next(err)
  }
}

/**
 * Get aggregated carbon footprint summary
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
 */
export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity) return next(new AppError('Activity not found', 404))
    if (activity.userId.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403))
    }

    // Deduct points proportionally
    const pointsToDeduct = Math.max(5, Math.ceil(activity.co2 * 2))
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { ecoPoints: -pointsToDeduct },
    })

    await activity.deleteOne()
    res.json({ success: true, message: 'Activity deleted' })
  } catch (err) {
    next(err)
  }
}
