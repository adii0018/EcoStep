"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function WeeklyChallenge() {
  const [completed, setCompleted] = useState(false);
  
  // Dummy state
  const total = 3;
  const current = completed ? 3 : 2;
  const percentage = (current / total) * 100;
  
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.3 } }
  };

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="show" className="h-[300px] bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-between relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="w-full">
        <h3 className="text-white font-semibold text-lg text-center">This week's challenge</h3>
      </div>

      <div className="flex flex-col items-center flex-1 justify-center z-10 w-full relative">
        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90 absolute inset-0">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-zinc-800"
            />
            {/* Progress Circle */}
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeLinecap="round"
              className="text-emerald-500"
            />
          </svg>
          <div className="text-center">
            <span className="text-2xl font-bold text-white block leading-none">{current}/{total}</span>
          </div>
        </div>

        <p className="text-white font-medium text-center leading-tight mb-1">Go car-free for 3 trips</p>
        <p className="text-xs text-zinc-400 text-center px-4 mb-2">Take metro, bus or walk instead of car</p>
        
        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full mb-3">
          <CheckCircle2 className="w-3 h-3" />
          <span>Earn 50 EcoPoints</span>
        </div>
        
        {completed ? (
          <p className="text-sm text-emerald-500 font-medium animate-pulse">Challenge completed! 🎉</p>
        ) : (
          <button 
            onClick={() => setCompleted(true)}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium py-2 rounded-xl transition-colors"
          >
            Mark 1 trip complete
          </button>
        )}
      </div>
      
      <div className="w-full text-center mt-2 border-t border-zinc-800/50 pt-2 z-10">
        <p className="text-xs text-orange-400/80 font-medium flex items-center justify-center gap-1">
          🔥 4 week streak — keep it up!
        </p>
      </div>
    </motion.div>
  );
}
