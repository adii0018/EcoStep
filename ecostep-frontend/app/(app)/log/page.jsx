"use client";

import { useEffect } from "react";
import { useActivities } from "@/hooks/useActivities";
import ActivityForm from "@/components/log/ActivityForm";
import ActivityList from "@/components/log/ActivityList";

export default function LogPage() {
  const { activities, loadingActivities, fetchActivities, addActivity, deleteActivity } =
    useActivities();

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleAdd = async (payload) => {
    await addActivity(payload);
  };

  return (
    <div className="space-y-6 pt-4 md:pt-0">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Log Activity</h1>
        <p className="text-zinc-400">
          Record your daily carbon-emitting activities to track your impact.
        </p>
      </div>

      <ActivityForm onSuccess={handleAdd} />
      <ActivityList
        activities={activities}
        loading={loadingActivities}
        onDelete={deleteActivity}
      />
    </div>
  );
}
