import Anthropic from '@anthropic-ai/sdk'
import Activity from '../models/Activity.js'

const FALLBACK_TIPS = [
  {
    title: 'Switch to public transport',
    description:
      'Taking the metro or bus instead of a petrol car can cut your travel emissions by up to 80%. Try replacing 3 car trips a week with public transit.',
    savingKg: 15.0,
    icon: '🚇',
  },
  {
    title: 'Reduce meat consumption',
    description:
      'Swapping two beef or chicken meals a week for vegetarian alternatives saves around 10 kg CO₂ per month. Legumes and seasonal vegetables are great protein sources.',
    savingKg: 10.0,
    icon: '🥗',
  },
  {
    title: 'Optimise home electricity use',
    description:
      'Turn off appliances on standby, switch to LED bulbs, and use energy-efficient settings on your AC. Small changes can reduce electricity emissions by 15–20%.',
    savingKg: 8.0,
    icon: '💡',
  },
]

/**
 * Generate personalized or fallback sustainability tips for the user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const getInsights = async (req, res, next) => {
  try {
    const since = new Date()
    since.setDate(since.getDate() - 7)

    const recentActivities = await Activity.find({
      userId: req.user.id,
      date: { $gte: since },
    }).sort({ date: -1 })

    if (!recentActivities.length) {
      return res.json({
        success: true,
        source: 'fallback',
        message: 'No recent activities found. Log some activities first for personalised tips.',
        tips: FALLBACK_TIPS,
      })
    }

    const summary = recentActivities.map((a) => ({
      category: a.category,
      type: a.type,
      quantity: a.quantity,
      co2: a.co2,
      date: a.date.toISOString().split('T')[0],
    }))

    const totalCo2 = recentActivities.reduce((sum, a) => sum + a.co2, 0).toFixed(2)

    const prompt = `You are an environmental sustainability coach. A user has logged the following carbon activities over the last 7 days:

${JSON.stringify(summary, null, 2)}

Total CO₂ emitted: ${totalCo2} kg

Based on their specific activity patterns, provide exactly 3 personalised, actionable tips to help them reduce their carbon footprint. Be specific to the activities they logged — reference exact types they used.

Respond ONLY with a valid JSON array (no markdown fences, no extra text) in this format:
[
  {
    "title": "Short tip title",
    "description": "2–3 sentence actionable advice referencing their actual activities",
    "savingKg": 5.5,
    "icon": "🌱"
  }
]`

    let tips

    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

      const message = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      })

      const rawText = message.content[0]?.text || ''
      const cleaned = rawText.replace(/```json\n?|```\n?/g, '').trim()
      tips = JSON.parse(cleaned)

      if (!Array.isArray(tips) || tips.length === 0) {
        throw new Error('Claude returned unexpected format')
      }
    } catch (claudeError) {
      return res.json({ success: true, source: 'fallback', tips: FALLBACK_TIPS })
    }

    res.json({ success: true, source: 'ai', tips })
  } catch (err) {
    next(err)
  }
}
