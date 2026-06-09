"use client";

import { useEffect } from "react";
import { useActivities } from "@/hooks/useActivities";
import MetricCards from "@/components/dashboard/MetricCards";
import BreakdownChart from "@/components/dashboard/BreakdownChart";
import CompareBar from "@/components/dashboard/CompareBar";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  const { activities, summary, loadingActivities, loadingSummary, fetchActivities, fetchSummary } =
    useActivities();

  useEffect(() => {
    fetchSummary();
    fetchActivities();
  }, [fetchSummary, fetchActivities]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your carbon footprint overview
        </p>
      </div>

      {/* KPI Cards */}
      <MetricCards summary={summary} loading={loadingSummary} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BreakdownChart summary={summary} loading={loadingSummary} />
        <CompareBar summary={summary} loading={loadingSummary} />
      </div>

      {/* Recent activity */}
      <RecentActivity activities={activities} loading={loadingActivities} />
    </div>
  );
}
