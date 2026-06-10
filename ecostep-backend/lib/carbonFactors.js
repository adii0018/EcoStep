import { AppError } from './AppError.js';
import { EMISSION_FACTORS } from '../constants/emissionFactors.js';

/**
 * Calculate CO2 emissions for a given activity
 * @param {string} category - Activity category (travel/food/energy/shopping)
 * @param {string} type - Specific activity type
 * @param {number} quantity - Amount (km/kg/units)
 * @returns {number} CO2 in kg
 * @throws {AppError} If category/type invalid or quantity negative
 */
export const calculateCO2 = (category, type, quantity) => {
  if (!category || !type) throw new AppError('Category and type required', 400);
  if (quantity < 0) throw new AppError('Quantity cannot be negative', 400);
  if (quantity === 0) return 0;
  
  const factor = EMISSION_FACTORS[category]?.[type];
  if (!factor) throw new AppError(`Unknown activity type: ${type}`, 400);
  
  return Math.round(quantity * factor * 100) / 100;
};

/**
 * Get all available categories
 * @returns {string[]} List of categories
 */
export const getAllCategories = () => Object.keys(EMISSION_FACTORS);

/**
 * Get all types within a category
 * @param {string} cat - The category name
 * @returns {string[]} List of types
 */
export const getTypesForCategory = (cat) => Object.keys(EMISSION_FACTORS[cat] || {});

export { EMISSION_FACTORS as FACTORS };
