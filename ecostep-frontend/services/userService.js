import api from './api';

/**
 * Get user profile data
 * @param {AbortSignal} [signal] 
 * @returns {Promise<Object>} Profile data
 */
export const getUserProfile = async (signal) => {
  const { data } = await api.get('/users/profile', { signal });
  return data;
};

/**
 * Update user profile
 * @param {Object} profileData - { name, city }
 * @returns {Promise<Object>} Updated profile
 */
export const updateUserProfile = async (profileData) => {
  const { data } = await api.put('/users/profile', profileData);
  return data;
};

/**
 * Get leaderboard data
 * @param {AbortSignal} [signal] 
 * @returns {Promise<Object>} Leaderboard data
 */
export const getLeaderboard = async (signal) => {
  const { data } = await api.get('/users/leaderboard', { signal });
  return data;
};

/**
 * Get user analytics data
 * @param {AbortSignal} [signal] 
 * @returns {Promise<Object>} Analytics data
 */
export const getUserAnalytics = async (signal) => {
  const { data } = await api.get('/users/analytics', { signal });
  return data;
};
