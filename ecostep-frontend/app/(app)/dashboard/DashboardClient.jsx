"use client";

import Link from "next/link";
import { PlusCircle, Lightbulb, Bell, Star, Flame } from "lucide-react";
import dynamic from "next/dynamic";
import PropTypes from 'prop-types';

import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import MetricCards from "@/components/dashboard/MetricCards";
import WeeklyChallenge from "@/components/dashboard/WeeklyChallenge";
import CompareSection from "@/components/dashboard/CompareSection";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useDashboard } from "@/hooks/useDashboard";

const WeeklyTrendChart = dynamic(
  () => import("@/components/dashboard/WeeklyTrendChart"),
  {
    loading: () => (
      <div className="h-[300px] w-full bg-zinc-900/50 animate-pulse rounded-2xl border border-zinc-800 flex items-center justify-center text-zinc-500">
        Loading trend chart...
      </div>
    ),
    ssr: false,
  }
);

const BreakdownChart = dynamic(
  () => import("@/components/dashboard/BreakdownChart"),
  {
    loading: () => (
      <div className="h-[300px] w-full bg-zinc-900/50 animate-pulse rounded-2xl border border-zinc-800 flex items-center justify-center text-zinc-500">
        Loading breakdown chart...
      </div>
    ),
    ssr: false,
  }
);

export default function DashboardClient() {
  const {
    loading,
    summary,
    user,
    profileData,
    showNotif,
    showSkeleton,
    setShowNotif,
    refetch
  } = useDashboard();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading && showSkeleton) return <DashboardSkeleton />;
  if (loading && !showSkeleton) return null;
  if (!summary) return null;

  return (
    <div className="space-y-6 pb-12 pt-4 md:pt-0">
      {/* Notification Banner */}
      {showNotif && (
        <div className="flex items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-200">You haven&apos;t logged any activity today! 🌿 Keep your streak alive.</p>
          </div>
          <button onClick={() => setShowNotif(false)} className="text-amber-400/50 hover:text-amber-400 text-lg leading-none flex-shrink-0">×</button>
        </div>
      )}
      {/* EcoPoints & Streak Row */}
      {profileData?.user && (
        <div className="flex items-center gap-3 justify-end flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-xs font-medium">
            <Star className="w-3.5 h-3.5" /> {profileData.user.ecoPoints} EcoPoints
          </div>
          {profileData.user.streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-medium">
              <Flame className="w-3.5 h-3.5" /> {profileData.user.streak} day streak
            </div>
          )}
        </div>
      )}
      {/* Row 1: Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            {getGreeting()}, {user?.name?.split(" ")[0] || "eco warrior"} 🌿
          </h1>
          <p className="text-zinc-400">
            {getFormattedDate()} · Your carbon score this week is better than 72% of Indian users
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

      {/* Row 2: Metric Cards */}
      <MetricCards data={summary} />

      {/* Row 3: Breakdown (60%) + Challenge (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        <div className="lg:col-span-3">
          <BreakdownChart data={summary.breakdown} />
        </div>
        <div className="lg:col-span-2 flex flex-col">
          <WeeklyChallenge />
        </div>
      </div>

      {/* Row 4: Compare (40%) + Trend (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <CompareSection data={summary} />
        </div>
        <div className="lg:col-span-3">
          <WeeklyTrendChart data={summary} />
        </div>
      </div>

      {/* Row 5: Recent Activity (100%) */}
      <RecentActivity
        activities={summary.recentActivities || []}
        onDeleted={() => refetch(new AbortController().signal)}
      />
    </div>
  );
}

DashboardClient.propTypes = {};
