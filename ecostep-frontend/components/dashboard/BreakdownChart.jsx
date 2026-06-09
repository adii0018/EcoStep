"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = {
  Travel: "#f97316", // orange-500
  Food: "#f59e0b",   // amber-500
  Energy: "#3b82f6", // blue-500
  Shopping: "#a855f7",// purple-500
};

// India averages for dummy tooltip info
const INDIA_AVG = {
  Travel: 12.5,
  Food: 6.2,
  Energy: 4.8,
  Shopping: 2.1,
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    const avg = INDIA_AVG[data.name] || 0;
    
    // Calculate percentage of total (dummy total derived roughly)
    const total = 18.4; // using the mock total from MetricCards
    const pct = ((value / total) * 100).toFixed(0);

    return (
      <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
        <p className="text-white font-medium mb-1 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[data.name] }} />
          {data.name}: {value} kg
        </p>
        <p className="text-xs text-zinc-400">{pct}% of your total</p>
        <p className="text-xs text-zinc-500 mt-1 pt-1 border-t border-zinc-800">
          India avg: {avg} kg
        </p>
      </div>
    );
  }
  return null;
};

export default function BreakdownChart({ data }) {
  const breakdown = data || { travel: 0, food: 0, energy: 0, shopping: 0 };
  
  const chartData = [
    { name: "Travel", value: breakdown.travel || 0 },
    { name: "Food", value: breakdown.food || 0 },
    { name: "Energy", value: breakdown.energy || 0 },
    { name: "Shopping", value: breakdown.shopping || 0 },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } }
  };

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="show" className="h-[300px] bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 flex flex-col">
      <div>
        <h3 className="text-white font-semibold text-lg">Emissions by category</h3>
        <p className="text-zinc-500 text-sm mb-4">This week · click a bar to see details</p>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 12 }} 
              width={70}
            />
            <Tooltip cursor={{ fill: '#27272a', opacity: 0.4 }} content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1500}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
