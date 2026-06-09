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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Log Activity</h1>
        <p className="text-sm text-gray-500 mt-1">
          Record your daily carbon-emitting activities
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
