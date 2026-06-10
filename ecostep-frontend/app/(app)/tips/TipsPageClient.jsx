"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, Target } from "lucide-react";
import api from "@/lib/api";
import TipCard from "@/components/tips/TipCard";
import { Button } from "@/components/ui/button";

// Large pool — 3 random tips are picked on every refresh
const TIPS_POOL = [
  { title: "Switch to public transport", description: "Taking the metro or bus instead of a petrol car cuts travel emissions by up to 80%. Try replacing 3 car trips a week with public transit.", savingKg: 15.0, icon: "🚇" },
  { title: "Reduce meat consumption", description: "Swapping two beef meals a week for vegetarian alternatives saves ~10 kg CO₂ per month. Lentils, chickpeas and paneer are great protein swaps.", savingKg: 10.0, icon: "🥗" },
  { title: "Optimise home electricity", description: "Turn off appliances on standby, switch to LED bulbs, and use eco-mode on your AC. Small habits can cut electricity emissions by 15–20%.", savingKg: 8.0, icon: "💡" },
  { title: "Cycle for short trips", description: "Trips under 3 km by cycle instead of a two-wheeler save ~0.5 kg CO₂ each. Cycling 5 such trips a week adds up to 10 kg saved per month.", savingKg: 10.0, icon: "🚲" },
  { title: "Eat seasonal & local produce", description: "Seasonal fruits and vegetables require no cold-chain transport. Buying from local farmers markets can halve the food-mile footprint of your meals.", savingKg: 5.5, icon: "🛒" },
  { title: "Wash clothes in cold water", description: "90% of a washing machine's energy goes to heating water. Switching to cold washes saves ~0.6 kg CO₂ per load — that's ~7 kg a month for daily washes.", savingKg: 7.0, icon: "🧺" },
  { title: "Plant-based meal once a day", description: "Even one plant-based meal daily instead of a meat-based one can reduce your annual carbon footprint by 0.5 tonnes CO₂. Start with dal or sabzi substitutes.", savingKg: 12.0, icon: "🌱" },
  { title: "Air-dry clothes instead of dryer", description: "A tumble dryer uses ~2.5 kWh per cycle. India's sunny climate makes air-drying a zero-emission alternative — saving up to 5 kg CO₂ a week.", savingKg: 5.0, icon: "☀️" },
  { title: "Unplug chargers when not in use", description: "Phone chargers, TV set-top boxes and wifi routers on standby consume phantom power. Unplugging them saves ~3–5 kWh per month (~2.5 kg CO₂).", savingKg: 2.5, icon: "🔌" },
  { title: "Opt for a reusable water bottle", description: "A single-use plastic bottle takes 0.083 kg CO₂ to produce. Using a steel bottle and refilling it prevents ~2.5 kg CO₂ monthly for a daily drinker.", savingKg: 2.5, icon: "🍶" },
  { title: "Carpool to work", description: "Sharing your car commute with just one colleague halves your per-trip emissions. Two colleagues means two-thirds savings — roughly 6 kg CO₂ a week.", savingKg: 6.0, icon: "🚗" },
  { title: "Reduce dairy consumption", description: "Dairy farming is emission-intensive. Swapping cow's milk for oat or soy milk in your daily chai or coffee saves ~1.5 kg CO₂ per litre consumed.", savingKg: 4.5, icon: "🥛" },
  { title: "Use a pressure cooker", description: "Pressure cookers reduce cooking time by up to 70%, cutting the gas or electricity needed. Cooking dal, rice and sabzi in one saves ~3 kg CO₂ monthly.", savingKg: 3.0, icon: "🍲" },
  { title: "Buy second-hand or rent clothing", description: "Fashion is responsible for 10% of global emissions. Buying pre-owned clothes, or renting for events, can cut a garment's carbon cost by up to 82%.", savingKg: 8.0, icon: "👕" },
  { title: "Switch to e-statements & paperless billing", description: "A single paper bill's lifecycle (paper, printing, transport, disposal) emits ~0.25 kg CO₂. Going digital across 10 accounts saves ~2.5 kg per month.", savingKg: 2.5, icon: "📱" },
  { title: "Plant a tree or support reforestation", description: "A mature tree absorbs ~21 kg CO₂ per year. Planting one via platforms like Grow-Trees.com offsets your footprint affordably while restoring biodiversity.", savingKg: 21.0, icon: "🌳" },
  { title: "Reduce food waste", description: "About 8% of global emissions come from food waste. Planning meals, using leftovers creatively and composting scraps can save ~4 kg CO₂ per household monthly.", savingKg: 4.0, icon: "🍱" },
  { title: "Choose energy-efficient appliances", description: "BEE 5-star rated ACs, refrigerators and fans use 20–40% less electricity. The upfront cost pays back in 2–3 years through lower bills and 15 kg less CO₂ monthly.", savingKg: 15.0, icon: "⭐" },
  { title: "Take shorter showers", description: "A 10-minute hot shower uses ~0.5 kWh to heat water. Cutting showers to 5 minutes saves ~7 kg CO₂ per month per person in an electric-geyser household.", savingKg: 7.0, icon: "🚿" },
  { title: "Work from home when possible", description: "Eliminating one 20 km commute per week saves ~1.8 kg CO₂ per trip by car. Four WFH days a month cuts ~7 kg CO₂ and saves fuel costs too.", savingKg: 7.0, icon: "🏠" },
];

/** Pick n unique random items from an array */
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export default function TipsPageClient() {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/insights");
      setTips(data.tips || pickRandom(TIPS_POOL, 3));
      setSource(data.source);
      if (data.source === "ai") {
        toast.success("AI tips generated! 🌿");
      } else {
        toast.info("Showing general tips — log more activities for personalised advice.");
      }
    } catch {
      setTips(pickRandom(TIPS_POOL, 3));
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
