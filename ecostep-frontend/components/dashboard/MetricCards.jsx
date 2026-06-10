'use client';

// React core
import { useEffect, useState, useMemo, memo } from 'react';

// Third-party libraries
import PropTypes from 'prop-types';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Zap, Calendar, Leaf } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// ─── Static Constants (Memory Optimization) ───────────────────────────────────

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const CHART_MARGINS = { top: 0, right: 0, left: 0, bottom: 0 };

// ─── Sub-Components ───────────────────────────────────────────────────────────

function AnimatedNumber({ value, suffix = '', decimal = 1 }) {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(latest.toFixed(decimal));
      },
    });
    return animation.stop;
  }, [value, decimal, count]);

  return (
    <>
      {displayValue}
      {suffix}
    </>
  );
}

AnimatedNumber.propTypes = {
  value: PropTypes.number.isRequired,
  suffix: PropTypes.string,
  decimal: PropTypes.number,
};

// ─── Main Component ───────────────────────────────────────────────────────────

function MetricCards({ data }) {
  const { totalCo2ThisWeek, totalCo2ThisMonth, savedVsAverage, weeklyTrend } = data;

  // Memoized data transformation (Time Optimization)
  const sparklineData = useMemo(() => {
    if (!weeklyTrend) return [];
    return weeklyTrend.map((val, index) => ({
      value: typeof val === 'object' ? val.co2 ?? 0 : val ?? 0,
      index,
    }));
  }, [weeklyTrend]);

  return (
    <motion.div
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {/* Card 1: This week */}
      <motion.div
        variants={ITEM_VARIANTS}
        className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 transition-all hover:scale-[1.01] hover:border-zinc-700 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <p className="text-zinc-400 text-sm font-medium mb-1">This week</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              <AnimatedNumber value={totalCo2ThisWeek} />{' '}
              <span className="text-xl text-zinc-500 font-normal">kg</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
        <div className="flex items-end justify-between relative z-10 mt-6">
          <div>
            <span className="inline-flex items-center text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md">
              ↓ 12% vs last week
            </span>
          </div>
          <div className="w-24 h-8 opacity-70">
            <ResponsiveContainer width="100%" height="100%" minHeight={32}>
              <LineChart data={sparklineData} margin={CHART_MARGINS}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Card 2: This month */}
      <motion.div
        variants={ITEM_VARIANTS}
        className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 transition-all hover:scale-[1.01] hover:border-zinc-700 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <p className="text-zinc-400 text-sm font-medium mb-1">This month</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              <AnimatedNumber value={totalCo2ThisMonth} />{' '}
              <span className="text-xl text-zinc-500 font-normal">kg</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
        </div>
        <div className="relative z-10 mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="inline-flex items-center text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md">
              ↓ 8% vs last month
            </span>
            <span className="text-xs text-zinc-500">Target: 60kg</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalCo2ThisMonth / 60) * 100, 100)}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${totalCo2ThisMonth > 60 ? 'bg-red-500' : 'bg-emerald-500'}`}
            />
          </div>
        </div>
      </motion.div>

      {/* Card 3: Total saved */}
      <motion.div
        variants={ITEM_VARIANTS}
        className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 transition-all hover:scale-[1.01] hover:border-zinc-700 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <p className="text-zinc-400 text-sm font-medium mb-1">Total saved</p>
            <h3 className="text-3xl font-bold text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <AnimatedNumber value={savedVsAverage} />{' '}
              <span className="text-xl text-emerald-500/50 font-normal">kg</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <div className="relative z-10 mt-6">
          <p className="text-sm text-zinc-400 mb-1">saved vs India average</p>
          <div className="inline-flex items-center text-xs font-medium px-2 py-1 bg-zinc-800 text-zinc-300 rounded-md">
            ≈ {(savedVsAverage / 14).toFixed(1)} trees worth of CO₂
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

MetricCards.propTypes = {
  data: PropTypes.shape({
    totalCo2ThisWeek: PropTypes.number.isRequired,
    totalCo2ThisMonth: PropTypes.number.isRequired,
    savedVsAverage: PropTypes.number.isRequired,
    weeklyTrend: PropTypes.array.isRequired,
  }).isRequired,
};

// Memoized to prevent unnecessary re-renders on dashboard state updates
export default memo(MetricCards);
