import axios from 'axios';
import Cookies from 'js-cookie';
import { APP_CONFIG } from '../constants/appConfig';

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Simple In-Memory Cache (Memory Optimization)
const CACHE_EXPIRY_MS = 120000; // 2 minutes
const requestCache = new Map();

/**
 * Generates a unique cache key based on URL and params.
 */
function getCacheKey(config) {
  return `${config.url}?${new URLSearchParams(config.params || {}).toString()}`;
}

// Intercept Request: Check Cache
api.interceptors.request.use((config) => {
  const token = Cookies.get('ecostep_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only cache GET requests
  if (config.method?.toLowerCase() === 'get') {
    const key = getCacheKey(config);
    const cachedData = requestCache.get(key);

    if (cachedData && Date.now() < cachedData.expiry) {
      // Return cached response via Axios custom adapter trick
      config.adapter = () => Promise.resolve({
        data: cachedData.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
      });
    }
  }

  return config;
});

// Intercept Response: Store in Cache & Handle 401
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method?.toLowerCase() === 'get') {
      const key = getCacheKey(response.config);
      requestCache.set(key, {
        data: response.data,
        expiry: Date.now() + CACHE_EXPIRY_MS,
      });
    } else {
      // Clear cache on mutations (POST, PUT, DELETE) to ensure fresh data
      requestCache.clear();
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('ecostep_token');
      Cookies.remove('ecostep_user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
