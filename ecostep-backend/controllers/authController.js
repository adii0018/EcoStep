import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { AppError } from '../lib/AppError.js'

/**
 * Generate a signed JWT for a user id
 * @param {string} id - The user ID
 * @returns {string} Signed JWT token
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

/**
 * Register a new user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Check if email already taken
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw new AppError('An account with this email already exists.', 400)
    }

    // Create user (password is hashed by pre-save hook)
    const user = await User.create({ name, email, password })

    const token = signToken(user._id)

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Log in an existing user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      throw new AppError('Invalid email or password.', 401)
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401)
    }

    const token = signToken(user._id)

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}
