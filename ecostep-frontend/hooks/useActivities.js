'use client';

// React core
import { useState, useCallback } from 'react';

// Services
import {
  getActivities,
  logActivity,
  deleteActivity as deleteActivityApi,
} from '../services/activityService';

/**
 * Custom hook for all CRUD operations on user activities.
 * Manages loading states and local cache for activity lists.
 * @returns {{
 *   activities: Array,
 *   isLoadingActivities: boolean,
 *   isLoadingSummary: boolean,
 *   fetchActivities: Function,
 *   addActivity: Function,
 *   removeActivity: Function,
 * }}
 */
export function useActivities() {
  const [activities, setActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  /** Fetches all activities, with an optional AbortController signal. */
  const fetchActivities = useCallback(async (params = {}, signal) => {
    setIsLoadingActivities(true);
    try {
      const data = await getActivities(params, signal);
      setActivities(data.activities ?? []);
    } finally {
      setIsLoadingActivities(false);
    }
  }, []);

  /** Logs a new activity and prepends it to the local list. */
  const addActivity = useCallback(async (activityPayload) => {
    const data = await logActivity(activityPayload);
    setActivities((previousActivities) => [data.activity, ...previousActivities]);
    return data.activity;
  }, []);

  /** Deletes an activity by ID and removes it from the local list. */
  const removeActivity = useCallback(async (activityId) => {
    await deleteActivityApi(activityId);
    setActivities((previousActivities) =>
      previousActivities.filter((activity) => activity._id !== activityId)
    );
  }, []);

  return {
    activities,
    isLoadingActivities,
    fetchActivities,
    addActivity,
    removeActivity,
  };
}
