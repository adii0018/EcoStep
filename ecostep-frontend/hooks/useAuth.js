'use client';

// React core
import { useState, useCallback, useEffect } from 'react';

// Third-party libraries
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

// Services
import { loginUser, registerUser } from '../services/authService';

const AUTH_COOKIE_EXPIRY_DAYS = 7;
const TOKEN_COOKIE_KEY = 'ecostep_token';
const USER_COOKIE_KEY = 'ecostep_user';

/**
 * Persists authentication credentials into browser cookies.
 * @param {string} token - JWT access token
 * @param {Object} user - User data object
 */
function persistAuthSession(token, user) {
  const cookieOptions = { expires: AUTH_COOKIE_EXPIRY_DAYS };
  Cookies.set(TOKEN_COOKIE_KEY, token, cookieOptions);
  Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), cookieOptions);
}

/**
 * Clears all authentication session data from cookies.
 */
function clearAuthSession() {
  Cookies.remove(TOKEN_COOKIE_KEY);
  Cookies.remove(USER_COOKIE_KEY);
}

/**
 * Custom hook for managing authentication state and operations.
 * @returns {{ user: Object|null, isLoading: boolean, login: Function, register: Function, logout: Function }}
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate user from cookie on initial mount
  useEffect(() => {
    const storedUserJson = Cookies.get(USER_COOKIE_KEY);
    if (!storedUserJson) {
      setIsLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(storedUserJson));
    } catch {
      // Corrupted cookie — remove it to avoid silent failures
      Cookies.remove(USER_COOKIE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Authenticates an existing user and redirects to the dashboard. */
  const login = useCallback(
    async (email, password) => {
      const data = await loginUser({ email, password });
      persistAuthSession(data.token, data.user);
      setUser(data.user);
      router.push('/dashboard');
    },
    [router]
  );

  /** Registers a new user account and redirects to the dashboard. */
  const register = useCallback(
    async (name, email, password) => {
      const data = await registerUser({ name, email, password });
      persistAuthSession(data.token, data.user);
      setUser(data.user);
      router.push('/dashboard');
    },
    [router]
  );

  /** Clears the session and redirects to the login page. */
  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
    router.push('/login');
  }, [router]);

  return { user, isLoading, login, register, logout };
}
