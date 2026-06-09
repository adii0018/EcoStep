"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryMeta } from "@/lib/carbonFactors";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-900">
          {payload[0].value.toFixed(2)} kg CO₂
        </p>
      </div>
    );
  }
  return null;
};

export default function BreakdownChart({ summary, loading }) {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">
            Emissions Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-44 flex items-center justify-center">
            <div className="animate-pulse flex gap-3 items-end h-32">
              {[70, 50, 90, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-12 bg-gray-100 rounded-t-md"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = Object.entries(summary?.breakdown || {}).map(([category, value]) => ({
    name: categoryMeta[category]?.label || category,
    value: parseFloat(value.toFixed(2)),
    color: categoryMeta[category]?.color || "#6b7280",
    emoji: categoryMeta[category]?.emoji || "📊",
  }));

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          Monthly Emissions Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.every((d) => d.value === 0) ? (
          <div className="h-44 flex flex-col items-center justify-center text-gray-400 gap-2">
            <span className="text-3xl">📊</span>
            <p className="text-sm">No data yet — start logging activities!</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} layout="vertical" margin={{ left: 16, right: 16 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={68}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
