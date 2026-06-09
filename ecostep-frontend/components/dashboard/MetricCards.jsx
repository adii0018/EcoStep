"use client";

import { TrendingUp, TrendingDown, Calendar, CalendarDays, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function MetricCard({ title, value, unit, subtitle, icon: Icon, trend, color }) {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              <span className="text-sm text-gray-500">{unit}</span>
            </div>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1.5">
            {trend >= 0 ? (
              <TrendingDown className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingUp className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-xs font-medium ${
                trend >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {trend >= 0
                ? `${trend.toFixed(1)} kg below India avg`
                : `${Math.abs(trend).toFixed(1)} kg above India avg`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MetricCards({ summary, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-100 rounded w-24" />
                <div className="h-7 bg-gray-100 rounded w-16" />
                <div className="h-3 bg-gray-100 rounded w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MetricCard
        title="This Week"
        value={summary.totalCo2ThisWeek?.toFixed(1) ?? "0.0"}
        unit="kg CO₂"
        subtitle="Last 7 days"
        icon={Calendar}
        color="#16a34a"
      />
      <MetricCard
        title="This Month"
        value={summary.totalCo2ThisMonth?.toFixed(1) ?? "0.0"}
        unit="kg CO₂"
        subtitle="Current month total"
        icon={CalendarDays}
        color="#3b82f6"
        trend={summary.savedVsAverage}
      />
      <MetricCard
        title="vs India Average"
        value={
          summary.savedVsAverage >= 0
            ? `-${summary.savedVsAverage?.toFixed(1)}`
            : `+${Math.abs(summary.savedVsAverage)?.toFixed(1)}`
        }
        unit="kg CO₂"
        subtitle={
          summary.savedVsAverage >= 0
            ? "You're below the 93 kg avg 🎉"
            : "India avg is 93 kg/month"
        }
        icon={Leaf}
        color={summary.savedVsAverage >= 0 ? "#16a34a" : "#f97316"}
      />
    </div>
  );
}
