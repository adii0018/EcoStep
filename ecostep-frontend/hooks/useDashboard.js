'use client';

// React core
import { useState, useEffect, useCallback, useRef } from 'react';

// Third-party libraries
import { toast } from 'sonner';

// Services
import { getActivitySummary } from '../services/activityService';
import { getUserProfile } from '../services/userService';

// Utils
import { isToday } from '../utils/date-formatter';

// Default summary data used as fallback if the API is unavailable
const FALLBACK_SUMMARY = {
  totalCo2ThisWeek: 0,
  totalCo2ThisMonth: 0,
  savedVsAverage: 0,
  breakdown: { travel: 0, food: 0, energy: 0, shopping: 0 },
  weeklyTrend: [0, 0, 0, 0, 0, 0, 0],
  recentActivities: [],
};

// Delay before showing skeleton (avoids flash on fast loads)
const SKELETON_DELAY_MS = 200;

/**
 * Reads the logged-in user from localStorage, returning null on failure.
 * @returns {Object|null} Parsed user object or null
 */
function readUserFromLocalStorage() {
  try {
    const storedUser = localStorage.getItem('ecostep_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

/**
 * Custom hook that manages all data fetching and state for the Dashboard page.
 * @returns {{ loading: boolean, summary: Object, user: Object, profileData: Object, showNotif: boolean, showSkeleton: boolean, setShowNotif: Function, refetch: Function }}
 */
export function useDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showActivityReminder, setShowActivityReminder] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const skeletonTimerRef = useRef(null);

  /** Fetches dashboard summary from API. Falls back to static data on error. */
  const fetchSummaryData = useCallback(async (signal) => {
    setIsLoading(true);
    try {
      const data = await getActivitySummary(signal);
      setSummary({
        totalCo2ThisWeek: data.totalCo2ThisWeek ?? FALLBACK_SUMMARY.totalCo2ThisWeek,
        totalCo2ThisMonth: data.totalCo2ThisMonth ?? FALLBACK_SUMMARY.totalCo2ThisMonth,
        savedVsAverage: data.savedVsAverage ?? FALLBACK_SUMMARY.savedVsAverage,
        breakdown: data.breakdown ?? FALLBACK_SUMMARY.breakdown,
        weeklyTrend: data.weeklyTrend ?? FALLBACK_SUMMARY.weeklyTrend,
        recentActivities: data.recentActivities ?? [],
      });
    } catch (error) {
      const isCancelled = error.name === 'CanceledError' || error.message === 'canceled';
      if (isCancelled) return;

      toast.error('Using fallback data while connection is re-established.');
      setSummary(FALLBACK_SUMMARY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Fetches profile data and determines if the activity reminder should show. */
  const fetchProfileAndReminder = useCallback(async (signal) => {
    try {
      const profileResponse = await getUserProfile(signal);
      setProfileData(profileResponse);

      // Show reminder banner if the user hasn't logged anything today
      const lastActivityDate = profileResponse?.user?.lastActivityDate;
      setShowActivityReminder(!isToday(lastActivityDate));
    } catch (error) {
      const isCancelled = error.name === 'CanceledError' || error.message === 'canceled';
      if (!isCancelled) {
        console.error('Failed to fetch profile data', error);
      }
    }
  }, []);

  useEffect(() => {
    setUser(readUserFromLocalStorage());

    const controller = new AbortController();
    fetchSummaryData(controller.signal);
    fetchProfileAndReminder(controller.signal);

    return () => controller.abort();
  }, [fetchSummaryData, fetchProfileAndReminder]);

  // Only show skeleton after a short delay to avoid flashing on fast connections
  useEffect(() => {
    if (isLoading) {
      skeletonTimerRef.current = setTimeout(() => setShowSkeleton(true), SKELETON_DELAY_MS);
    } else {
      clearTimeout(skeletonTimerRef.current);
      setShowSkeleton(false);
    }
    return () => clearTimeout(skeletonTimerRef.current);
  }, [isLoading]);

  return {
    isLoading,
    summary,
    user,
    profileData,
    showActivityReminder,
    showSkeleton,
    setShowActivityReminder,
    refetch: fetchSummaryData,
  };
}
