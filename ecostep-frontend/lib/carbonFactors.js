import { EMISSION_FACTORS } from '../constants/emissionFactors';
import { APP_CONFIG } from '../constants/appConfig';

export const carbonFactors = {
  travel: EMISSION_FACTORS.TRAVEL,
  food: EMISSION_FACTORS.FOOD,
  energy: EMISSION_FACTORS.ENERGY,
  shopping: EMISSION_FACTORS.SHOPPING,
};

export const categories = APP_CONFIG.CATEGORIES;

/**
 * Gets types for a given category
 * @param {string} category 
 * @returns {string[]} Array of types
 */
export function getTypesForCategory(category) {
  return category ? Object.keys(carbonFactors[category] || {}) : [];
}

/**
 * Calculates CO2 emission
 * @param {string} category 
 * @param {string} type 
 * @param {number} quantity 
 * @returns {number|null} Calculated CO2
 */
export function calculateCO2(category, type, quantity) {
  if (!category || !type || !quantity) return null;
  const factor = carbonFactors[category]?.[type];
  if (factor === undefined) return null;
  return parseFloat((quantity * factor).toFixed(4));
}

export const categoryMeta = {
  travel: { color: "#f97316", label: "Travel", emoji: APP_CONFIG.CATEGORY_EMOJIS.travel },
  food: { color: "#22c55e", label: "Food", emoji: APP_CONFIG.CATEGORY_EMOJIS.food },
  energy: { color: "#3b82f6", label: "Energy", emoji: APP_CONFIG.CATEGORY_EMOJIS.energy },
  shopping: { color: "#a855f7", label: "Shopping", emoji: APP_CONFIG.CATEGORY_EMOJIS.shopping },
};
