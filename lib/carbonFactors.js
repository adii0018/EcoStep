/**
 * Carbon emission factors (kg CO₂ per unit).
 *
 * travel  → kg CO₂ per km
 * food    → kg CO₂ per meal
 * energy  → kg CO₂ per kWh / kg / hour (see label)
 * shopping → kg CO₂ per item
 */
const carbonFactors = {
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
};

/**
 * Calculate kg CO₂ for a given activity.
 * @param {string} category - One of travel | food | energy | shopping
 * @param {string} type     - Sub-type within the category
 * @param {number} quantity - Amount (km / meals / kWh / items)
 * @returns {number|null}   - kg CO₂ or null if factor not found
 */
const calculateCO2 = (category, type, quantity) => {
  const categoryFactors = carbonFactors[category];
  if (!categoryFactors) return null;

  const factor = categoryFactors[type];
  if (factor === undefined) return null;

  return parseFloat((quantity * factor).toFixed(4));
};

module.exports = { carbonFactors, calculateCO2 };
