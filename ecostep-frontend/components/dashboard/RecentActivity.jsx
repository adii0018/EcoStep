'use client';

// React core
import { useState, useCallback, memo } from 'react';

// Third-party libraries
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Trash2, Car, Coffee, Zap, ShoppingBag, Loader2, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import PropTypes from 'prop-types';

// Services
import { deleteActivity as deleteActivityApi } from '@/services/activityService';

// Utils
import { isToday } from '@/utils/date-formatter';

// ─── Static Constants (Memory Optimization) ───────────────────────────────────

const ICONS = {
  Travel: { icon: Car, bg: 'bg-orange-500/20', color: 'text-orange-500' },
  Food: { icon: Coffee, bg: 'bg-amber-500/20', color: 'text-amber-500' },
  Energy: { icon: Zap, bg: 'bg-blue-500/20', color: 'text-blue-500' },
  Shopping: { icon: ShoppingBag, bg: 'bg-purple-500/20', color: 'text-purple-500' },
};

const DEFAULT_ICON = { icon: Leaf, bg: 'bg-emerald-500/20', color: 'text-emerald-500' };

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.6 } },
};

const CONFIRMATION_RESET_MS = 3000;

// ─── Helper Functions (Time Optimization) ─────────────────────────────────────

function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (isToday(dateString)) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// ─── Main Component ───────────────────────────────────────────────────────────

function RecentActivity({ activities, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  // Memoized event handler
  const handleDelete = useCallback(
    async (id) => {
      // Step 1: Confirmation mechanism
      if (confirmId !== id) {
        setConfirmId(id);
        const timer = setTimeout(() => setConfirmId(null), CONFIRMATION_RESET_MS);
        return () => clearTimeout(timer); // Clean up timer to prevent memory leaks
      }

      // Step 2: Actual deletion
      try {
        setDeletingId(id);
        await deleteActivityApi(id);
        toast.success('Activity deleted');
        if (onDeleted) onDeleted();
      } catch (error) {
        toast.error('Failed to delete activity');
      } finally {
        setDeletingId(null);
        setConfirmId(null);
      }
    },
    [confirmId, onDeleted]
  );

  return (
    <motion.div
      variants={ITEM_VARIANTS}
      initial="hidden"
      animate="show"
      className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-semibold text-lg">Recent activity</h3>
        <Link
          href="/log"
          className="text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {!activities || activities.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 bg-zinc-800/20 rounded-xl border border-zinc-800/50 border-dashed">
          <p>No recent activities found.</p>
          <Link href="/log" className="text-emerald-400 text-sm mt-2 inline-block hover:underline">
            Log your first activity
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.slice(0, 5).map((activity) => {
            const IconConfig = ICONS[activity.category] || DEFAULT_ICON;
            const Icon = IconConfig.icon;
            const isConfirming = confirmId === activity._id;
            const isDeleting = deletingId === activity._id;

            return (
              <div
                key={activity._id} // Fixed: Array index removed from key
                className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-800/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${IconConfig.bg}`}>
                    <Icon className={`w-5 h-5 ${IconConfig.color}`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.title || activity.category}</p>
                    <p className="text-sm text-zinc-500 flex gap-2">
                      <span>
                        {activity.quantity || '-'} {activity.unit || ''}
                      </span>
                      <span>·</span>
                      <span>{formatRelativeDate(activity.date || activity.createdAt)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-white font-bold">
                    {activity.co2Impact?.toFixed(1) || activity.co2?.toFixed(1) || 0}{' '}
                    <span className="text-zinc-500 text-sm font-normal">kg CO₂</span>
                  </span>

                  <button
                    onClick={() => handleDelete(activity._id)}
                    disabled={isDeleting}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isConfirming
                        ? 'bg-red-500/20 text-red-500'
                        : 'text-zinc-600 opacity-0 group-hover:opacity-100 hover:bg-zinc-800 hover:text-zinc-300'
                    }`}
                    title={isConfirming ? 'Click again to confirm' : 'Delete'}
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

RecentActivity.propTypes = {
  activities: PropTypes.array,
  onDeleted: PropTypes.func,
};

// Memoized to prevent unnecessary re-renders
export default memo(RecentActivity);
