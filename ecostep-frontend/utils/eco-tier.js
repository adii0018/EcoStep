import { APP_CONFIG } from '../constants/appConfig';

const { TIERS } = APP_CONFIG;

// Ordered from highest to lowest threshold for easy lookup
const TIER_ORDER = [
  TIERS.CHAMPION,
  TIERS.WARRIOR,
  TIERS.STARTER,
  TIERS.SEEDLING,
];

/**
 * Resolves the user's eco tier based on their EcoPoints.
 * @param {number} ecoPoints - User's current EcoPoints total
 * @returns {{ title: string, icon: string }} Tier object
 */
export function resolveEcoTier(ecoPoints) {
  const matchedTier = TIER_ORDER.find((tier) => ecoPoints >= tier.minPoints);
  return matchedTier ?? TIERS.SEEDLING;
}

/**
 * Calculates how many points are needed to reach the next tier.
 * Returns null if the user is already at the highest tier.
 * @param {number} ecoPoints - User's current EcoPoints total
 * @returns {{ nextTier: object, pointsRequired: number } | null}
 */
export function getProgressToNextTier(ecoPoints) {
  const reversedTiers = [...TIER_ORDER].reverse();
  const nextTier = reversedTiers.find((tier) => ecoPoints < tier.minPoints);

  if (!nextTier) return null;

  return {
    nextTier,
    pointsRequired: nextTier.minPoints - ecoPoints,
  };
}

/**
 * Generates the motivational progress message displayed on the profile page.
 * @param {number} ecoPoints - User's current EcoPoints total
 * @returns {string} Human-readable progress message
 */
export function getTierProgressMessage(ecoPoints) {
  const progress = getProgressToNextTier(ecoPoints);

  if (!progress) return "You're in the top tier! Keep inspiring others.";

  return `${progress.pointsRequired} more points to become ${progress.nextTier.title}!`;
}

/**
 * Extracts the initials from a full name string.
 * @param {string} fullName - User's full name
 * @returns {string} Up to 2 uppercase initials, e.g. "AS"
 */
export function getNameInitials(fullName) {
  if (!fullName) return '??';
  return fullName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
