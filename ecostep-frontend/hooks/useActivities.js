"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";

export function useActivities() {
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchActivities = useCallback(async () => {
    setLoadingActivities(true);
    try {
      const { data } = await api.get("/activities");
      setActivities(data.activities || []);
    } finally {
      setLoadingActivities(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const { data } = await api.get("/activities/summary");
      setSummary(data);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const addActivity = useCallback(async (payload) => {
    const { data } = await api.post("/activities", payload);
    setActivities((prev) => [data.activity, ...prev]);
    return data.activity;
  }, []);

  const deleteActivity = useCallback(async (id) => {
    await api.delete(`/activities/${id}`);
    setActivities((prev) => prev.filter((a) => a._id !== id));
  }, []);

  return {
    activities,
    summary,
    loadingActivities,
    loadingSummary,
    fetchActivities,
    fetchSummary,
    addActivity,
    deleteActivity,
  };
}
