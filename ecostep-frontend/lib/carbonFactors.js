export const carbonFactors = {
  travel: {
    "Car (petrol)": 0.18,
    "Car (diesel)": 0.16,
    "Bike/scooter": 0.09,
    "Bus": 0.04,
    "Metro/train": 0.02,
    "Flight (domestic)": 0.25,
  },
  food: {
    "Beef meal": 6.0,
    "Chicken meal": 6.0,
    "Fish meal": 3.2,
    "Vegetarian meal": 0.9,
    "Vegan meal": 0.5,
  },
  energy: {
    "Home electricity": 0.42,
    "LPG cooking": 2.9,
    "AC usage (hr)": 0.8,
  },
  shopping: {
    "New clothing": 10.0,
    "Electronics": 30.0,
    "Groceries": 0.5,
  },
};

export const categories = Object.keys(carbonFactors);

export function getTypesForCategory(category) {
  return category ? Object.keys(carbonFactors[category] || {}) : [];
}

export function calculateCO2(category, type, quantity) {
  if (!category || !type || !quantity) return null;
  const factor = carbonFactors[category]?.[type];
  if (factor === undefined) return null;
  return parseFloat((quantity * factor).toFixed(4));
}

export const categoryMeta = {
  travel: { color: "#f97316", label: "Travel", emoji: "🚗" },
  food: { color: "#22c55e", label: "Food", emoji: "🍽️" },
  energy: { color: "#3b82f6", label: "Energy", emoji: "⚡" },
  shopping: { color: "#a855f7", label: "Shopping", emoji: "🛍️" },
};
