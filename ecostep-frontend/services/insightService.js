import api from './api';

/**
 * Generate AI tips based on user activity
 * @param {AbortSignal} [signal] 
 * @returns {Promise<Object>} AI tips data
 */
export const generateAITips = async (signal) => {
  const { data } = await api.post('/insights', {}, { signal });
  return data;
};
