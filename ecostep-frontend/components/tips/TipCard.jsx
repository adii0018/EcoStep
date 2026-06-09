"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function TipCard({ tip }) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-2xl flex-shrink-0">
            {tip.icon || "🌿"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h3 className="text-sm font-semibold text-gray-900">{tip.title}</h3>
              {tip.savingKg != null && (
                <Badge className="bg-green-100 text-green-700 border-0 text-xs flex-shrink-0">
                  Save {tip.savingKg.toFixed(1)} kg CO₂
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{tip.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
