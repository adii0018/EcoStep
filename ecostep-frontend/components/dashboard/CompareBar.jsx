"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const INDIA_AVERAGE = 93;

export default function CompareBar({ summary, loading }) {
  const monthly = summary?.totalCo2ThisMonth ?? 0;
  const percentage = Math.min((monthly / INDIA_AVERAGE) * 100, 150);
  const isBelow = monthly <= INDIA_AVERAGE;
  const diff = Math.abs(INDIA_AVERAGE - monthly).toFixed(1);

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">
            vs India Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-3 bg-gray-100 rounded-full" />
            <div className="h-3 bg-gray-100 rounded w-40" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          Monthly vs India Average
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Your usage: <strong className="text-gray-800">{monthly.toFixed(1)} kg</strong></span>
          <span>India avg: <strong className="text-gray-800">{INDIA_AVERAGE} kg</strong></span>
        </div>

        {/* Bar track */}
        <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
          {/* User bar */}
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: isBelow ? "#16a34a" : "#f97316",
            }}
          />
          {/* India average marker at 100% / (percentage/100 ratio) */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
            style={{ left: `${(100 / Math.max(percentage, 100)) * 100}%` }}
          />
        </div>

        {/* India average line label */}
        <div className="flex items-center gap-1.5 mt-1">
          <div
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: isBelow ? "#dcfce7" : "#ffedd5",
              color: isBelow ? "#16a34a" : "#ea580c",
            }}
          >
            {isBelow
              ? `🎉 ${diff} kg below average`
              : `⚠️ ${diff} kg above average`}
          </div>
        </div>

        <p className="text-xs text-gray-400">
          India&apos;s average monthly carbon footprint is ~93 kg CO₂ per person.
        </p>
      </CardContent>
    </Card>
  );
}
