'use client';

// React core
import { useEffect, useState } from 'react';

// Third-party libraries
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import { Loader2, Trophy, Flame, Star } from 'lucide-react';

// Services
import { getLeaderboard } from '@/services/userService';

// ─── Constants ────────────────────────────────────────────────────────────────

const PODIUM_DISPLAY_ORDER = [1, 0, 2]; // Silver, Gold, Bronze — visual podium order
const TOP_THREE_RANK_STYLES = [
  'from-yellow-400 to-amber-500 text-zinc-900',
  'from-zinc-300 to-zinc-400 text-zinc-900',
  'from-orange-400 to-orange-600 text-white',
];
const RANK_MEDAL_EMOJIS = ['🥇', '🥈', '🥉'];

// ─── Sub-Components ───────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-40">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
    </div>
  );
}

function MyRankBanner({ rank, points }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between"
    >
      <div>
        <p className="text-xs text-zinc-400 mb-0.5">Your global rank</p>
        <p className="text-2xl font-bold text-white">#{rank}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-zinc-400 mb-0.5">Your EcoPoints</p>
        <p className="text-2xl font-bold text-emerald-400 flex items-center gap-1 justify-end">
          <Star className="w-5 h-5" /> {points}
        </p>
      </div>
    </motion.div>
  );
}

MyRankBanner.propTypes = {
  rank: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
};

function PodiumCard({ entry, position }) {
  const isTopRank = position === 0;
  const isCurrentUser = entry?.isCurrentUser ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: isTopRank ? -10 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.1 }}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${isCurrentUser ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/80'} ${isTopRank ? 'ring-2 ring-yellow-400/30' : ''}`}
    >
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${TOP_THREE_RANK_STYLES[position]} flex items-center justify-center text-xl font-bold shadow-lg`}>
        {RANK_MEDAL_EMOJIS[position]}
      </div>
      <p className="text-white font-bold text-sm text-center leading-tight">{entry?.name}</p>
      <p className="text-zinc-500 text-xs">{entry?.city}</p>
      <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
        <Star className="w-3.5 h-3.5" /> {entry?.ecoPoints}
      </div>
      {entry?.streak > 0 && (
        <div className="flex items-center gap-1 text-orange-400 text-xs">
          <Flame className="w-3 h-3" /> {entry.streak}d
        </div>
      )}
    </motion.div>
  );
}

PodiumCard.propTypes = {
  entry: PropTypes.shape({
    name: PropTypes.string,
    city: PropTypes.string,
    ecoPoints: PropTypes.number,
    streak: PropTypes.number,
    isCurrentUser: PropTypes.bool,
  }),
  position: PropTypes.number.isRequired,
};

function LeaderboardRow({ entry, index }) {
  const isTopThree = index < 3;
  const isCurrentUser = entry.isCurrentUser ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`flex items-center gap-4 px-5 py-4 border-b border-zinc-800/50 last:border-0 transition-colors hover:bg-white/[0.02] ${isCurrentUser ? 'bg-emerald-500/5' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${isTopThree ? `bg-gradient-to-br ${TOP_THREE_RANK_STYLES[index]}` : 'bg-zinc-800 text-zinc-400'}`}>
        {isTopThree ? RANK_MEDAL_EMOJIS[index] : entry.rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-emerald-400' : 'text-white'}`}>
          {entry.name}{' '}
          {isCurrentUser && <span className="text-xs font-normal text-zinc-500">(you)</span>}
        </p>
        <p className="text-xs text-zinc-500">{entry.city}</p>
      </div>
      {entry.streak > 0 && (
        <div className="flex items-center gap-1 text-orange-400 text-xs font-medium">
          <Flame className="w-3.5 h-3.5" /> {entry.streak}d
        </div>
      )}
      <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
        <Star className="w-4 h-4" /> {entry.ecoPoints}
      </div>
    </motion.div>
  );
}

LeaderboardRow.propTypes = {
  entry: PropTypes.shape({
    rank: PropTypes.number,
    name: PropTypes.string,
    city: PropTypes.string,
    ecoPoints: PropTypes.number,
    streak: PropTypes.number,
    isCurrentUser: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeaderboardClient() {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    loadLeaderboardData(controller.signal);
    return () => controller.abort();
  }, []);

  async function loadLeaderboardData(signal) {
    try {
      const data = await getLeaderboard(signal);
      setLeaderboardData(data);
    } catch (error) {
      const isCancelled = error.name === 'CanceledError' || error.message === 'canceled';
      if (!isCancelled) toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  }

  const hasEnoughForPodium = (leaderboardData?.leaderboard?.length ?? 0) >= 3;

  return (
    <div className="space-y-6 pt-4 md:pt-0 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1 flex items-center gap-3">
          <Trophy className="w-7 h-7 text-yellow-400" /> Leaderboard
        </h1>
        <p className="text-zinc-400">Top eco-warriors ranked by EcoPoints this season</p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {leaderboardData?.myRank && (
            <MyRankBanner rank={leaderboardData.myRank} points={leaderboardData.myPoints} />
          )}

          {/* Top 3 podium layout */}
          {hasEnoughForPodium && (
            <div className="grid grid-cols-3 gap-3 px-2">
              {PODIUM_DISPLAY_ORDER.map((arrayIndex) => (
                <PodiumCard
                  key={arrayIndex}
                  entry={leaderboardData.leaderboard[arrayIndex]}
                  position={arrayIndex}
                />
              ))}
            </div>
          )}

          {/* Full ranked list */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden">
            {leaderboardData?.leaderboard?.map((entry, index) => (
              <LeaderboardRow key={entry.rank ?? index} entry={entry} index={index} />
            ))}
          </div>

          <p className="text-xs text-zinc-600 text-center">
            Names partially anonymised for privacy · Rankings update in real-time
          </p>
        </>
      )}
    </div>
  );
}
