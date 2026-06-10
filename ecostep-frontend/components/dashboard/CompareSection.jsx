'use client';

// React core
import { memo } from 'react';

// Third-party libraries
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

// ─── Static Constants (Memory Optimization) ───────────────────────────────────

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.4 } },
};

const DEFAULT_THIS_MONTH = 76;
const MOCK_LAST_MONTH = 83;
const MOCK_INDIA_AVG = 93;
const MOCK_GLOBAL_AVG = 120;

// ─── Helper Functions ─────────────────────────────────────────────────────────

function calculatePercentageDiff(baseValue, compareValue) {
  return Math.round(((compareValue - baseValue) / compareValue) * 100);
}

function calculateBarWidthPercentage(value, maxValue) {
  return `${Math.min((value / Math.max(value, maxValue)) * 100, 100)}%`;
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function ComparisonRow({ title, labelValue, diffPercentage, diffLabel, thisMonthValue, compareValue, barBgClass }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-medium text-white">{title}</span>
        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
          {diffLabel ?? `${diffPercentage}% better`}
        </span>
      </div>
      <div className="relative h-2 w-full bg-zinc-800 rounded-full mt-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: calculateBarWidthPercentage(thisMonthValue, compareValue) }}
          transition={{ duration: 1 }}
          className={`absolute top-0 left-0 h-full rounded-full ${barBgClass}`}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-zinc-500">You: {thisMonthValue} kg</span>
        <span className="text-xs text-zinc-500">{labelValue}: {compareValue} kg</span>
      </div>
    </div>
  );
}

ComparisonRow.propTypes = {
  title: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  diffPercentage: PropTypes.number.isRequired,
  diffLabel: PropTypes.string,
  thisMonthValue: PropTypes.number.isRequired,
  compareValue: PropTypes.number.isRequired,
  barBgClass: PropTypes.string.isRequired,
};

// ─── Main Component ───────────────────────────────────────────────────────────

function CompareSection({ data }) {
  const thisMonth = data?.totalCo2ThisMonth ?? DEFAULT_THIS_MONTH;

  return (
    <motion.div
      variants={ITEM_VARIANTS}
      initial="hidden"
      animate="show"
      className="h-[350px] bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between"
    >
      <div>
        <h3 className="text-white font-semibold text-lg mb-6">How you compare</h3>

        <div className="space-y-6">
          <ComparisonRow
            title="You vs India avg"
            labelValue="Avg"
            diffPercentage={calculatePercentageDiff(thisMonth, MOCK_INDIA_AVG)}
            thisMonthValue={thisMonth}
            compareValue={MOCK_INDIA_AVG}
            barBgClass="bg-emerald-500"
          />

          <ComparisonRow
            title="You vs Global avg"
            labelValue="Global"
            diffPercentage={calculatePercentageDiff(thisMonth, MOCK_GLOBAL_AVG)}
            thisMonthValue={thisMonth}
            compareValue={MOCK_GLOBAL_AVG}
            barBgClass="bg-blue-500"
          />

          <ComparisonRow
            title="You vs Last month"
            labelValue="Last month"
            diffPercentage={calculatePercentageDiff(thisMonth, MOCK_LAST_MONTH)}
            diffLabel={`↓ ${calculatePercentageDiff(thisMonth, MOCK_LAST_MONTH)}% improvement`}
            thisMonthValue={thisMonth}
            compareValue={MOCK_LAST_MONTH}
            barBgClass="bg-amber-500"
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800">
        <p className="text-sm text-zinc-400 text-center">
          You&apos;re in the <span className="text-white font-medium">top 28%</span> of Indian
          EcoStep users!
        </p>
      </div>
    </motion.div>
  );
}

CompareSection.propTypes = {
  data: PropTypes.shape({
    totalCo2ThisMonth: PropTypes.number,
  }),
};

export default memo(CompareSection);
