export const APP_CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://ecostep-backend.onrender.com/api",
  CATEGORIES: ["travel", "food", "energy", "shopping"],
  CATEGORY_COLORS: {
    travel: "text-blue-400 bg-blue-500/10",
    food: "text-orange-400 bg-orange-500/10",
    energy: "text-yellow-400 bg-yellow-500/10",
    shopping: "text-purple-400 bg-purple-500/10",
  },
  CATEGORY_EMOJIS: {
    travel: "🚗",
    food: "🍽️",
    energy: "⚡",
    shopping: "🛍️",
  },
  TIERS: {
    SEEDLING: { minPoints: 0, title: "Seedling", icon: "🌾" },
    STARTER: { minPoints: 50, title: "Eco Starter", icon: "🌱" },
    WARRIOR: { minPoints: 200, title: "Green Warrior", icon: "🌿" },
    CHAMPION: { minPoints: 500, title: "Eco Champion", icon: "🌟" },
  },
  DEFAULT_FALLBACKS: {
    WORLD_AVG_CO2_MONTHLY: 392, // kg
    INDIA_AVG_CO2_MONTHLY: 93, // kg
  }
};
