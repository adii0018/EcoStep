import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { AppError } from '../lib/AppError.js'

/**
 * Middleware to protect routes and verify the JWT authorization token
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) throw new AppError('No token provided', 401)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) throw new AppError('User not found', 401)
    next()
  } catch (err) {
    if (err instanceof AppError) {
      return next(err)
    }
    next(new AppError('Invalid token', 401))
  }
}
