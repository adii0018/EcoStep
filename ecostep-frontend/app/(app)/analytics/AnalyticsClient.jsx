"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, BarChart2, TrendingDown, TrendingUp, Globe } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import api from "@/lib/api";

const CATEGORY_COLORS = { travel: "#60a5fa", food: "#fb923c", energy: "#facc15", shopping: "#c084fc" };
const MONTH_LABELS = { "01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun","07":"Jul","08":"Aug","09":"Sep","10":"Oct","11":"Nov","12":"Dec" };

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl shadow-xl text-sm">
      <p className="text-white font-medium mb-1">{label}</p>
      <p className="text-emerald-400 font-bold">{payload[0].value} kg CO₂</p>
    </div>
  );
  return null;
};

export default function AnalyticsClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/analytics");
        setData(data);
      } catch { toast.error("Failed to load analytics"); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>;

  // Build monthly chart data
  const monthlyData = (data?.monthly || []).map(m => ({
    name: MONTH_LABELS[m.month.split("-")[1]] || m.month,
    total: m.total,
    count: m.count,
  }));

  // Build category pie data from latest month
  const latestMonth = data?.monthly?.slice(-1)[0]?.month;
  const categoryData = Object.entries(
    (data?.categoryTrend || [])
      .filter(c => c._id.month === latestMonth)
      .reduce((acc, c) => { acc[c._id.category] = (acc[c._id.category] || 0) + c.total; return acc; }, {})
  ).map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }));

  const latestCo2 = data?.monthly?.slice(-1)[0]?.total || 0;
  const prevCo2 = data?.monthly?.slice(-2, -1)[0]?.total || 0;
  const trend = prevCo2 > 0 ? ((latestCo2 - prevCo2) / prevCo2 * 100).toFixed(1) : null;

  return (
    <div className="space-y-6 pt-4 md:pt-0">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1 flex items-center gap-3">
          <BarChart2 className="w-7 h-7 text-emerald-400" /> Analytics
        </h1>
        <p className="text-zinc-400">Your carbon footprint trends over the last 6 months</p>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "This month", value: `${latestCo2.toFixed(1)} kg`, sub: trend !== null ? `${trend > 0 ? "↑" : "↓"} ${Math.abs(trend)}% vs last month` : "First month", color: trend > 0 ? "text-red-400" : "text-emerald-400" },
          { label: "Best week ever", value: `${data?.bestWeek?.total ?? 0} kg`, sub: `Week ${data?.bestWeek?.week || "—"}`, color: "text-emerald-400" },
          { label: "Worst week", value: `${data?.worstWeek?.total ?? 0} kg`, sub: `Week ${data?.worstWeek?.week || "—"}`, color: "text-red-400" },
          { label: "vs India avg", value: `${(data?.indiaMonthlyAvg - latestCo2).toFixed(1)} kg`, sub: `India avg: ${data?.indiaMonthlyAvg} kg/mo`, color: (data?.indiaMonthlyAvg - latestCo2) >= 0 ? "text-emerald-400" : "text-red-400" },
        ].map(({ label, value, sub, color }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-zinc-500 mt-1">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Monthly Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-1">Monthly CO₂ Emissions</h3>
        <p className="text-zinc-500 text-sm mb-6">Last 6 months — kg CO₂ per month</p>
        {monthlyData.length === 0 ? (
          <p className="text-zinc-500 text-sm py-10 text-center">No data yet — log some activities first!</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="total" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Bottom row: Pie + Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Pie */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-1">Category Breakdown</h3>
          <p className="text-zinc-500 text-sm mb-4">This month's emissions by source</p>
          {categoryData.length === 0 ? (
            <p className="text-zinc-500 text-sm py-8 text-center">No data this month</p>
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {categoryData.map((entry) => <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6b7280"} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} kg`, "CO₂"]} contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Global Comparison */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-1 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Global Comparison</h3>
          <p className="text-zinc-500 text-sm mb-6">Your monthly CO₂ vs global benchmarks</p>
          <div className="space-y-4">
            {[
              { label: "You", value: latestCo2, max: data?.worldMonthlyAvg || 400, color: "bg-emerald-500" },
              { label: "India avg", value: data?.indiaMonthlyAvg || 93, max: data?.worldMonthlyAvg || 400, color: "bg-amber-500" },
              { label: "World avg", value: data?.worldMonthlyAvg || 392, max: data?.worldMonthlyAvg || 400, color: "bg-red-500" },
            ].map(({ label, value, max, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-zinc-400">{label}</span>
                  <span className="text-white font-bold">{value.toFixed(1)} kg</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                    className={`h-full ${color} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-600 mt-6">World avg: 392 kg/month · India avg: 93 kg/month (IEA 2023)</p>
        </motion.div>
      </div>
    </div>
  );
}
