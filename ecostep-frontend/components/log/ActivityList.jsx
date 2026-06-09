"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  travel: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  food: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  energy: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shopping: "bg-purple-500/10 text-purple-400 border-purple-500/20",
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
    <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">
          All Activities
        </h3>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md">{activities.length} entries</span>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-32" />
                  <div className="h-3 bg-zinc-800/50 rounded w-20" />
                </div>
                <div className="h-4 bg-zinc-800 rounded w-16" />
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 bg-zinc-950/30 rounded-xl border border-zinc-800 border-dashed">
            <span className="text-4xl block mb-3 opacity-50">📋</span>
            <p className="text-sm font-medium text-zinc-400">No activities logged yet.</p>
            <p className="text-xs mt-1">Use the form above to start tracking!</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {activities.map((act) => {
              const meta = categoryMeta[act.category] || {};
              return (
                <div
                  key={act._id}
                  className="flex items-center gap-4 py-4 first:pt-0 hover:bg-zinc-800/30 -mx-4 px-4 rounded-xl transition-colors group"
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-20" style={{ backgroundColor: meta.color || '#10b981' }} />
                    <span className="relative z-10">{meta.emoji}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-medium text-white truncate">{act.type}</p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase tracking-wider font-semibold border ${categoryColors[act.category] || "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}
                      >
                        {act.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500">
                      {act.quantity} units · {formatDate(act.date)}
                    </p>
                  </div>

                  {/* CO2 */}
                  <span className="text-sm font-bold text-white flex-shrink-0">
                    {act.co2.toFixed(2)} <span className="text-zinc-500 font-normal text-xs">kg</span>
                  </span>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all"
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
      </div>
    </div>
  );
}
