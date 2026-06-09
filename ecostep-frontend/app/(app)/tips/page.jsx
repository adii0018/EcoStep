"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, Target } from "lucide-react";
import api from "@/lib/api";
import TipCard from "@/components/tips/TipCard";
import { Button } from "@/components/ui/button";

const FALLBACK_TIPS = [
  {
    title: "Switch to public transport",
    description:
      "Taking the metro or bus instead of a petrol car can cut your travel emissions by up to 80%. Try replacing 3 car trips a week with public transit.",
    savingKg: 15.0,
    icon: "🚇",
  },
  {
    title: "Reduce meat consumption",
    description:
      "Swapping two beef or chicken meals a week for vegetarian alternatives saves around 10 kg CO₂ per month. Legumes and seasonal vegetables are great protein sources.",
    savingKg: 10.0,
    icon: "🥗",
  },
  {
    title: "Optimise home electricity use",
    description:
      "Turn off appliances on standby, switch to LED bulbs, and use energy-efficient settings on your AC. Small changes can reduce electricity emissions by 15–20%.",
    savingKg: 8.0,
    icon: "💡",
  },
];

export default function TipsPage() {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/insights");
      setTips(data.tips || FALLBACK_TIPS);
      setSource(data.source);
      if (data.source === "ai") {
        toast.success("AI tips generated! 🌿");
      } else {
        toast.info("Showing general tips — log more activities for personalised advice.");
      }
    } catch {
      setTips(FALLBACK_TIPS);
      setSource("fallback");
      toast.error("Could not reach AI. Showing general tips.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-4 md:pt-0">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Sustainability Tips</h1>
        <p className="text-zinc-400">
          AI-powered advice based on your recent activities
        </p>
      </div>

      {/* CTA */}
      <Button
        onClick={fetchTips}
        disabled={loading}
        className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:scale-[1.02] active:scale-[0.98] h-11 px-6 rounded-xl"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing your footprint…
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Personalised AI Tips
          </>
        )}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Tips */}
          {tips && (
            <div className="space-y-4">
              {source === "fallback" && (
                <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
                  <span className="text-lg leading-none">💡</span>
                  <p>These are general tips. Log more activities to get personalised AI insights.</p>
                </div>
              )}
              {tips.map((tip, i) => (
                <TipCard key={i} tip={tip} />
              ))}
            </div>
          )}

          {/* Placeholder state before fetch */}
          {!tips && !loading && (
            <div className="py-16 text-center text-zinc-500 bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white font-medium mb-1">Ready for your insights?</p>
              <p className="text-sm">Click the button above to generate personalised advice based on your last 7 days of activities.</p>
            </div>
          )}
        </div>

        <div>
          {/* Weekly Challenge Card */}
          <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-emerald-400" />
              <h3 className="text-white font-semibold text-lg">Weekly Challenge</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              <p className="text-sm text-white font-medium leading-relaxed">
                Walk or cycle for trips under 2 km this week
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Replacing short car trips with walking or cycling can save up to 5 kg CO₂ per week
                and improve your health!
              </p>
              
              <div className="pt-2">
                <div className="flex justify-between text-xs text-zinc-300 mb-2">
                  <span className="font-medium">Progress</span>
                  <span className="text-emerald-400 font-bold">60%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[60%]" />
                </div>
              </div>
              <p className="text-xs text-emerald-500/80 font-medium">3 of 5 days completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
