"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryMeta } from "@/lib/carbonFactors";

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function RecentActivity({ activities, loading }) {
  const recent = activities?.slice(0, 5) || [];

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-gray-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-28" />
                <div className="h-2.5 bg-gray-100 rounded w-16" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-14" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <span className="text-3xl block mb-2">🌱</span>
            <p className="text-sm">No activities yet. Start logging!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((act) => {
              const meta = categoryMeta[act.category] || {};
              return (
                <div key={act._id} className="flex items-center gap-3 py-3 first:pt-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ backgroundColor: `${meta.color}18` }}
                  >
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{act.type}</p>
                    <p className="text-xs text-gray-400">
                      {formatDate(act.date)} · {act.quantity} units
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 flex-shrink-0">
                    {act.co2.toFixed(2)} kg
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
