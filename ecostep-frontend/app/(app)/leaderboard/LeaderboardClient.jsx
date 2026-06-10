"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Trophy, Flame, Star } from "lucide-react";
import api from "@/lib/api";

const RANK_STYLES = ["from-yellow-400 to-amber-500 text-zinc-900", "from-zinc-300 to-zinc-400 text-zinc-900", "from-orange-400 to-orange-600 text-white"];
const RANK_EMOJIS = ["🥇", "🥈", "🥉"];

export default function LeaderboardClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/leaderboard");
        setData(data);
      } catch { toast.error("Failed to load leaderboard"); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="space-y-6 pt-4 md:pt-0 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1 flex items-center gap-3">
          <Trophy className="w-7 h-7 text-yellow-400" /> Leaderboard
        </h1>
        <p className="text-zinc-400">Top eco-warriors ranked by EcoPoints this season</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
      ) : (
        <>
          {/* My Rank Banner */}
          {data?.myRank && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 mb-0.5">Your global rank</p>
                <p className="text-2xl font-bold text-white">#{data.myRank}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-400 mb-0.5">Your EcoPoints</p>
                <p className="text-2xl font-bold text-emerald-400 flex items-center gap-1 justify-end">
                  <Star className="w-5 h-5" /> {data.myPoints}
                </p>
              </div>
            </motion.div>
          )}

          {/* Top 3 podium */}
          {data?.leaderboard?.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 px-2">
              {[1, 0, 2].map((pos) => {
                const entry = data.leaderboard[pos];
                const isFirst = pos === 0;
                return (
                  <motion.div key={pos} initial={{ opacity: 0, y: isFirst ? -10 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pos * 0.1 }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${entry?.isCurrentUser ? "border-emerald-500/40 bg-emerald-500/5" : "border-zinc-800 bg-zinc-900/80"} ${isFirst ? "ring-2 ring-yellow-400/30" : ""}`}>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${RANK_STYLES[pos]} flex items-center justify-center text-xl font-bold shadow-lg`}>
                      {RANK_EMOJIS[pos]}
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
              })}
            </div>
          )}

          {/* Full list */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden">
            {data?.leaderboard?.map((entry, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 px-5 py-4 border-b border-zinc-800/50 last:border-0 transition-colors hover:bg-white/[0.02] ${entry.isCurrentUser ? "bg-emerald-500/5" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${i < 3 ? `bg-gradient-to-br ${RANK_STYLES[i]}` : "bg-zinc-800 text-zinc-400"}`}>
                  {i < 3 ? RANK_EMOJIS[i] : entry.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${entry.isCurrentUser ? "text-emerald-400" : "text-white"}`}>
                    {entry.name} {entry.isCurrentUser && <span className="text-xs font-normal text-zinc-500">(you)</span>}
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
            ))}
          </div>

          <p className="text-xs text-zinc-600 text-center">Names partially anonymised for privacy · Rankings update in real-time</p>
        </>
      )}
    </div>
  );
}
