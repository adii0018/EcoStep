"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categoryMeta } from "@/lib/carbonFactors";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const categoryColors = {
  travel: "bg-orange-50 text-orange-700 border-orange-100",
  food: "bg-green-50 text-green-700 border-green-100",
  energy: "bg-blue-50 text-blue-700 border-blue-100",
  shopping: "bg-purple-50 text-purple-700 border-purple-100",
};

export default function ActivityList({ activities, loading, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Delete this activity?")) return;
    setDeletingId(id);
    try {
      await onDelete(id);
      toast.success("Activity deleted.");
    } catch {
      toast.error("Failed to delete activity.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800">
            All Activities
          </CardTitle>
          <span className="text-xs text-gray-400">{activities.length} entries</span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse py-2">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded w-32" />
                  <div className="h-2.5 bg-gray-100 rounded w-20" />
                </div>
                <div className="h-3 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <span className="text-4xl block mb-3">📋</span>
            <p className="text-sm font-medium">No activities logged yet.</p>
            <p className="text-xs mt-1">Use the form above to start tracking!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {activities.map((act) => {
              const meta = categoryMeta[act.category] || {};
              return (
                <div
                  key={act._id}
                  className="flex items-center gap-3 py-3 first:pt-0 hover:bg-gray-50/50 rounded-lg px-1 transition-colors"
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: `${meta.color}18` }}
                  >
                    {meta.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-800 truncate">{act.type}</p>
                      <Badge
                        variant="outline"
                        className={`text-xs border ${categoryColors[act.category] || ""}`}
                      >
                        {act.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {act.quantity} units · {formatDate(act.date)}
                    </p>
                  </div>

                  {/* CO2 */}
                  <span className="text-sm font-semibold text-gray-700 flex-shrink-0 mr-2">
                    {act.co2.toFixed(2)} kg
                  </span>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                    onClick={() => handleDelete(act._id)}
                    disabled={deletingId === act._id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
