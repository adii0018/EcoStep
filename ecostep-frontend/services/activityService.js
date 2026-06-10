import api from './api';

/**
 * Get all activities with optional filters
 * @param {Object} params - Query params (category, from, to)
 * @param {AbortSignal} [signal] - AbortController signal
 * @returns {Promise<Object>} Activities data
 */
export const getActivities = async (params = {}, signal) => {
  const { data } = await api.get('/activities', { params, signal });
  return data;
};

/**
 * Get activity summary
 * @param {AbortSignal} [signal] - AbortController signal
 * @returns {Promise<Object>} Summary data
 */
export const getActivitySummary = async (signal) => {
  const { data } = await api.get('/activities/summary', { signal });
  return data;
};

/**
 * Log a new activity
 * @param {Object} activityData 
 * @returns {Promise<Object>} Created activity
 */
export const logActivity = async (activityData) => {
  const { data } = await api.post('/activities', activityData);
  return data;
};

/**
 * Update an activity
 * @param {string} id 
 * @param {Object} activityData 
 * @returns {Promise<Object>}
 */
export const updateActivity = async (id, activityData) => {
  const { data } = await api.put(`/activities/${id}`, activityData);
  return data;
};

/**
 * Delete an activity
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const deleteActivity = async (id) => {
  const { data } = await api.delete(`/activities/${id}`);
  return data;
};
