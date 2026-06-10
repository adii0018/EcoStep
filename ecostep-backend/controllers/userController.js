import mongoose from 'mongoose'
import User from '../models/User.js'
import Activity from '../models/Activity.js'
import { AppError } from '../lib/AppError.js'

/**
 * Get the logged-in user's profile with lifetime stats
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id

    const [user, lifetimeStats] = await Promise.all([
      User.findById(userId),
      Activity.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalCo2: { $sum: '$co2' },
            totalActivities: { $count: {} },
          },
        },
      ]),
    ])

    if (!user) return next(new AppError('User not found', 404))

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        ecoPoints: user.ecoPoints,
        streak: user.streak,
        createdAt: user.createdAt,
        lastActivityDate: user.lastActivityDate,
      },
      stats: {
        totalCo2: Math.round((lifetimeStats[0]?.totalCo2 || 0) * 10) / 10,
        totalActivities: lifetimeStats[0]?.totalActivities || 0,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Update name / city for the logged-in user
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, city } = req.body
    const update = {}
    if (name && name.trim()) update.name = name.trim()
    if (city !== undefined) update.city = city.trim()

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
      runValidators: true,
    })

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        ecoPoints: user.ecoPoints,
        streak: user.streak,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Get top-10 leaderboard ranked by EcoPoints
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const leaders = await User.find({}, 'name city ecoPoints streak createdAt')
      .sort({ ecoPoints: -1 })
      .limit(10)
      .lean()

    // Partially anonymise — show only first name + last initial
    const sanitised = leaders.map((u, i) => {
      const parts = u.name.trim().split(' ')
      const display =
        parts.length > 1
          ? `${parts[0]} ${parts[parts.length - 1][0]}.`
          : parts[0]
      return {
        rank: i + 1,
        name: display,
        city: u.city || 'Unknown',
        ecoPoints: u.ecoPoints,
        streak: u.streak,
        isCurrentUser: u._id.toString() === req.user.id,
      }
    })

    // Also find current user's rank if not in top 10
    const currentUser = await User.findById(req.user.id, 'ecoPoints')
    const currentRank = await User.countDocuments({
      ecoPoints: { $gt: currentUser.ecoPoints },
    })

    res.json({
      success: true,
      leaderboard: sanitised,
      myRank: currentRank + 1,
      myPoints: currentUser.ecoPoints,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Get monthly analytics for the logged-in user (last 6 months)
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const [monthly, categoryTrend, bestWorst] = await Promise.all([
      // Monthly totals
      Activity.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
            total: { $sum: '$co2' },
            count: { $count: {} },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Category breakdown per month
      Activity.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              month: { $dateToString: { format: '%Y-%m', date: '$date' } },
              category: '$category',
            },
            total: { $sum: '$co2' },
          },
        },
        { $sort: { '_id.month': 1 } },
      ]),
      // Best & worst weeks (last 12 weeks)
      Activity.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: new Date(Date.now() - 84 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $isoWeek: '$date' },
            year: { $first: { $isoWeekYear: '$date' } },
            total: { $sum: '$co2' },
          },
        },
        { $sort: { year: -1, _id: -1 } },
      ]),
    ])

    const bestWeek = bestWorst.reduce(
      (min, w) => (w.total < min.total ? w : min),
      bestWorst[0] || { total: 0, _id: 0 }
    )
    const worstWeek = bestWorst.reduce(
      (max, w) => (w.total > max.total ? w : max),
      bestWorst[0] || { total: 0, _id: 0 }
    )

    res.json({
      success: true,
      monthly: monthly.map((m) => ({
        month: m._id,
        total: Math.round(m.total * 10) / 10,
        count: m.count,
      })),
      categoryTrend,
      bestWeek: {
        week: bestWeek._id,
        total: Math.round((bestWeek.total || 0) * 10) / 10,
      },
      worstWeek: {
        week: worstWeek._id,
        total: Math.round((worstWeek.total || 0) * 10) / 10,
      },
      indiaMonthlyAvg: 93,
      worldMonthlyAvg: 392,
    })
  } catch (err) {
    next(err)
  }
}
