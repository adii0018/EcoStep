import api from './api';

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} API response data
 */
export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

/**
 * Login a user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} API response data
 */
export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};
