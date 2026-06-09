import { AppError } from './AppError.js'

const FACTORS = {
  travel: {
    'Car (petrol)': 0.18,
    'Car (diesel)': 0.16,
    'Bike/scooter': 0.09,
    Bus: 0.04,
    'Metro/train': 0.02,
    'Flight (domestic)': 0.25,
  },
  food: {
    'Beef meal': 6.0,
    'Chicken meal': 6.0,
    'Fish meal': 3.2,
    'Vegetarian meal': 0.9,
    'Vegan meal': 0.5,
  },
  energy: {
    'Home electricity': 0.42,
    'LPG cooking': 2.9,
    'AC usage (hr)': 0.8,
  },
  shopping: {
    'New clothing': 10.0,
    Electronics: 30.0,
    Groceries: 0.5,
  },
}

/**
 * Calculate CO2 emissions for a given activity
 * @param {string} category - Activity category (travel/food/energy/shopping)
 * @param {string} type - Specific activity type
 * @param {number} quantity - Amount (km/kg/units)
 * @returns {number} CO2 in kg
 * @throws {AppError} If category/type invalid or quantity negative
 */
export const calculateCO2 = (category, type, quantity) => {
  if (!category || !type) throw new AppError('Category and type required', 400)
  if (quantity < 0) throw new AppError('Quantity cannot be negative', 400)
  if (quantity === 0) return 0
  const factor = FACTORS[category]?.[type]
  if (!factor) throw new AppError(`Unknown activity type: ${type}`, 400)
  return Math.round(quantity * factor * 100) / 100
}

/**
 * Get all available categories
 * @returns {string[]} List of categories
 */
export const getAllCategories = () => Object.keys(FACTORS)

/**
 * Get all types within a category
 * @param {string} cat - The category name
 * @returns {string[]} List of types
 */
export const getTypesForCategory = (cat) => Object.keys(FACTORS[cat] || {})

export { FACTORS }
