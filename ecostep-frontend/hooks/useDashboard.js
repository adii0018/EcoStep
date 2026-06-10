import { useState, useEffect, useCallback, useRef } from 'react';

import { toast } from 'sonner';
import { getActivitySummary } from '../services/activityService';
import { getUserProfile } from '../services/userService';

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  
  const skeletonTimer = useRef(null);

  const fetchDashboardData = useCallback(async (signal) => {
    setLoading(true);
    try {
      const data = await getActivitySummary(signal);
      setSummary({
        totalCo2ThisWeek: data.totalCo2ThisWeek || 18.4,
        totalCo2ThisMonth: data.totalCo2ThisMonth || 76.2,
        savedVsAverage: data.savedVsAverage || 16.8,
        breakdown: data.breakdown || {
          travel: 9.1,
          food: 4.8,
          energy: 3.2,
          shopping: 1.3,
        },
        weeklyTrend: data.weeklyTrend || [3.1, 2.8, 3.2, 2.4, 2.9, 2.2, 1.8],
        recentActivities: data.recentActivities || [],
      });
    } catch (error) {
      if (error.name === 'CanceledError' || error.message === 'canceled') return;
      console.error("Failed to fetch summary data", error);
      toast.error("Using fallback data while connection is re-established.");
      setSummary({
        totalCo2ThisWeek: 18.4,
        totalCo2ThisMonth: 76.2,
        savedVsAverage: 16.8,
        breakdown: { travel: 9.1, food: 4.8, energy: 3.2, shopping: 1.3 },
        weeklyTrend: [3.1, 2.8, 3.2, 2.4, 2.9, 2.2, 1.8],
        recentActivities: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfileData = useCallback(async (signal) => {
    try {
      const pd = await getUserProfile(signal);
      setProfileData(pd);
      const last = pd?.user?.lastActivityDate ? new Date(pd.user.lastActivityDate) : null;
      const todayStr = new Date().toDateString();
      if (!last || last.toDateString() !== todayStr) setShowNotif(true);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        console.error("Failed to fetch profile", err);
      }
    }
  }, []);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("ecostep_user");
      if (userData) setUser(JSON.parse(userData));
    } catch (e) {
      console.error("Failed to parse user data", e);
    }

    const controller = new AbortController();
    fetchDashboardData(controller.signal);
    fetchProfileData(controller.signal);
    
    return () => controller.abort();
  }, [fetchDashboardData, fetchProfileData]);

  // Skeleton delay
  useEffect(() => {
    if (loading) {
      skeletonTimer.current = setTimeout(() => setShowSkeleton(true), 200);
    } else {
      clearTimeout(skeletonTimer.current);
      setShowSkeleton(false);
    }
    return () => clearTimeout(skeletonTimer.current);
  }, [loading]);

  return {
    loading,
    summary,
    user,
    profileData,
    showNotif,
    showSkeleton,
    setShowNotif,
    refetch: fetchDashboardData
  };
}
