"use client";

import { motion } from "framer-motion";

export default function CompareSection({ data }) {
  const thisMonth = data?.totalCo2ThisMonth || 76;
  const lastMonth = 83; // static mock for this metric
  const indiaAvg = 93;
  const globalAvg = 120;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.4 } }
  };

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="show" className="h-[350px] bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-white font-semibold text-lg mb-6">How you compare</h3>
        
        <div className="space-y-6">
          {/* Row 1: India Avg */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-medium text-white">You vs India avg</span>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {Math.round(((indiaAvg - thisMonth) / indiaAvg) * 100)}% better
              </span>
            </div>
            <div className="relative h-2 w-full bg-zinc-800 rounded-full mt-2">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${Math.min((thisMonth / Math.max(thisMonth, indiaAvg)) * 100, 100)}%` }} 
                transition={{ duration: 1 }}
                className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full" 
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-zinc-500">You: {thisMonth} kg</span>
              <span className="text-xs text-zinc-500">Avg: {indiaAvg} kg</span>
            </div>
          </div>

          {/* Row 2: Global Avg */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-medium text-white">You vs Global avg</span>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {Math.round(((globalAvg - thisMonth) / globalAvg) * 100)}% better
              </span>
            </div>
            <div className="relative h-2 w-full bg-zinc-800 rounded-full mt-2">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${Math.min((thisMonth / Math.max(thisMonth, globalAvg)) * 100, 100)}%` }} 
                transition={{ duration: 1 }}
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" 
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-zinc-500">You: {thisMonth} kg</span>
              <span className="text-xs text-zinc-500">Global: {globalAvg} kg</span>
            </div>
          </div>

          {/* Row 3: Last month */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-medium text-white">You vs Last month</span>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                ↓ {Math.round(((lastMonth - thisMonth) / lastMonth) * 100)}% improvement
              </span>
            </div>
            <div className="relative h-2 w-full bg-zinc-800 rounded-full mt-2">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${Math.min((thisMonth / Math.max(thisMonth, lastMonth)) * 100, 100)}%` }} 
                transition={{ duration: 1 }}
                className="absolute top-0 left-0 h-full bg-amber-500 rounded-full" 
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-zinc-500">This month: {thisMonth} kg</span>
              <span className="text-xs text-zinc-500">Last month: {lastMonth} kg</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <p className="text-sm text-zinc-400 text-center">
          You're in the <span className="text-white font-medium">top 28%</span> of Indian EcoStep users!
        </p>
      </div>
    </motion.div>
  );
}
