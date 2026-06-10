"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    
    // Determine a fake main source based on the day for the mockup feel
    const sources = ["Travel", "Food", "Energy", "Shopping"];
    const source = sources[Math.floor(value) % sources.length];

    return (
      <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
        <p className="text-white font-medium mb-1">{label}</p>
        <p className="text-emerald-400 font-bold mb-1">{value} kg CO₂</p>
        <p className="text-xs text-zinc-400">Main source: {source}</p>
      </div>
    );
  }
  return null;
};

export default function WeeklyTrendChart({ data }) {
  const weeklyTrend = data?.weeklyTrend || [3.1, 2.8, 3.2, 2.4, 2.9, 2.2, 1.8];
  
  // Normalise: backend may return [{date, co2}] or plain numbers
  const chartData = weeklyTrend.map((val, i) => ({
    name: DAYS[i % 7],
    value: typeof val === 'object' ? (val.co2 ?? 0) : (val ?? 0)
  }));

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.5 } }
  };

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="show" className="h-[350px] bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 flex flex-col">
      <div>
        <h3 className="text-white font-semibold text-lg">7-day CO₂ trend</h3>
        <p className="text-zinc-500 text-sm mb-6">Daily emissions this week</p>
      </div>

      {/* Screen reader fallback data table */}
      <div className="sr-only">
        <table>
          <caption>Carbon emissions by day of the week</caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Emissions (kg CO₂)</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((d) => (
              <tr key={d.name}>
                <td>{d.name}</td>
                <td>{d.value} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div 
        className="flex-1 w-full min-h-0"
        role="img"
        aria-label="Area chart showing daily CO2 emissions trend for this week from Monday to Sunday."
      >
        <ResponsiveContainer width="100%" height="100%" minHeight={150}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={1500}
              activeDot={{ r: 6, fill: "#10b981", stroke: "#000", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
