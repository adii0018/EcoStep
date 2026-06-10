'use client';

// React core
import dynamic from 'next/dynamic';
import { useCallback } from 'react';

// Third-party libraries
import Link from 'next/link';
import PropTypes from 'prop-types';
import { PlusCircle, Lightbulb, Bell, Star, Flame } from 'lucide-react';

// Internal components
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import MetricCards from '@/components/dashboard/MetricCards';
import WeeklyChallenge from '@/components/dashboard/WeeklyChallenge';
import CompareSection from '@/components/dashboard/CompareSection';
import RecentActivity from '@/components/dashboard/RecentActivity';

// Hooks & Utils
import { useDashboard } from '@/hooks/useDashboard';
import { getTimeBasedGreeting, getFormattedHeaderDate } from '@/utils/date-formatter';

// Lazy-load heavy chart components to keep the initial bundle small
const WeeklyTrendChart = dynamic(
  () => import('@/components/dashboard/WeeklyTrendChart'),
  {
    loading: () => <ChartLoadingPlaceholder label="Loading trend chart..." />,
    ssr: false,
  }
);

const BreakdownChart = dynamic(
  () => import('@/components/dashboard/BreakdownChart'),
  {
    loading: () => <ChartLoadingPlaceholder label="Loading breakdown chart..." />,
    ssr: false,
  }
);

// ─── Sub-Components ───────────────────────────────────────────────────────────

function ChartLoadingPlaceholder({ label }) {
  return (
    <div className="h-[300px] w-full bg-zinc-900/50 animate-pulse rounded-2xl border border-zinc-800 flex items-center justify-center text-zinc-500">
      {label}
    </div>
  );
}

ChartLoadingPlaceholder.propTypes = {
  label: PropTypes.string.isRequired,
};

function ActivityReminderBanner({ onDismiss }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-3">
      <div className="flex items-center gap-3">
        <Bell className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <p className="text-sm text-amber-200">
          You haven&apos;t logged any activity today! 🌿 Keep your streak alive.
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-amber-400/50 hover:text-amber-400 text-lg leading-none flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
}

ActivityReminderBanner.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};

function GamificationBadges({ ecoPoints, streak }) {
  return (
    <div className="flex items-center gap-3 justify-end flex-wrap">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-xs font-medium">
        <Star className="w-3.5 h-3.5" /> {ecoPoints} EcoPoints
      </div>
      {streak > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-medium">
          <Flame className="w-3.5 h-3.5" /> {streak} day streak
        </div>
      )}
    </div>
  );
}

GamificationBadges.propTypes = {
  ecoPoints: PropTypes.number.isRequired,
  streak: PropTypes.number.isRequired,
};

function DashboardHeader({ userName }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          {getTimeBasedGreeting()}, {userName} 🌿
        </h1>
        <p className="text-zinc-400">
          {getFormattedHeaderDate()} · Your carbon score this week is better than 72% of Indian users
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/tips"
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all"
        >
          <Lightbulb className="w-4 h-4 text-emerald-400" />
          Get AI Tips
        </Link>
        <Link
          href="/log"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(16,185,129,0.25)]"
        >
          <PlusCircle className="w-4 h-4" />
          Log Activity
        </Link>
      </div>
    </div>
  );
}

DashboardHeader.propTypes = {
  userName: PropTypes.string.isRequired,
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardClient() {
  const {
    isLoading,
    summary,
    user,
    profileData,
    showActivityReminder,
    showSkeleton,
    setShowActivityReminder,
    refetch,
  } = useDashboard();

  if (isLoading && showSkeleton) return <DashboardSkeleton />;
  if (isLoading) return null;
  if (!summary) return null;

  const displayName = user?.name?.split(' ')[0] ?? 'eco warrior';

  const handleDismissReminder = useCallback(() => {
    setShowActivityReminder(false);
  }, [setShowActivityReminder]);

  return (
    <div className="space-y-6 pb-12 pt-4 md:pt-0">
      {showActivityReminder && (
        <ActivityReminderBanner onDismiss={handleDismissReminder} />
      )}

      {profileData?.user && (
        <GamificationBadges
          ecoPoints={profileData.user.ecoPoints}
          streak={profileData.user.streak}
        />
      )}

      <DashboardHeader userName={displayName} />

      <MetricCards data={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        <div className="lg:col-span-3">
          <BreakdownChart data={summary.breakdown} />
        </div>
        <div className="lg:col-span-2 flex flex-col">
          <WeeklyChallenge />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <CompareSection data={summary} />
        </div>
        <div className="lg:col-span-3">
          <WeeklyTrendChart data={summary} />
        </div>
      </div>

      <RecentActivity
        activities={summary.recentActivities}
        onDeleted={() => refetch(new AbortController().signal)}
      />
    </div>
  );
}
