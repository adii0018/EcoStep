"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, Target } from "lucide-react";
import api from "@/lib/api";
import TipCard from "@/components/tips/TipCard";
import { Button } from "@/components/ui/button";

// ─── 50-tip pool across 7 categories ─────────────────────────────────────────
const TIPS_POOL = [
  // 🚇 TRANSPORT (10)
  { title: "Switch to public transport", description: "Taking the metro or bus instead of a petrol car cuts travel emissions by up to 80%. Try replacing 3 car trips a week with public transit.", savingKg: 15.0, icon: "🚇", category: "Transport" },
  { title: "Cycle for short trips", description: "Trips under 3 km by cycle instead of a two-wheeler save ~0.5 kg CO₂ each. Cycling 5 such trips a week adds up to 10 kg saved per month.", savingKg: 10.0, icon: "🚲", category: "Transport" },
  { title: "Carpool to work", description: "Sharing your car commute with just one colleague halves your per-trip emissions. Two colleagues means two-thirds savings — roughly 6 kg CO₂ a week.", savingKg: 6.0, icon: "🚗", category: "Transport" },
  { title: "Walk for hyper-local errands", description: "Trips under 1 km on foot produce zero emissions. Walking to the kirana store or ATM instead of taking a two-wheeler saves ~0.2 kg per trip.", savingKg: 3.0, icon: "🚶", category: "Transport" },
  { title: "Take the train for intercity travel", description: "An AC train journey emits ~15× less CO₂ than a flight and ~5× less than a personal car. For distances under 500 km, trains are almost always greener.", savingKg: 40.0, icon: "🚆", category: "Transport" },
  { title: "Combine errands into one trip", description: "Plan your week so all errands — groceries, bank, pharmacy — happen in a single round-trip. Eliminating 3 separate short drives saves ~1.5 kg CO₂ weekly.", savingKg: 6.0, icon: "🗺️", category: "Transport" },
  { title: "Keep tyres properly inflated", description: "Under-inflated tyres increase fuel consumption by up to 3%. For a car covering 1,000 km/month, correct tyre pressure saves ~1.5 kg CO₂ per month.", savingKg: 1.5, icon: "🛞", category: "Transport" },
  { title: "Avoid idling your engine", description: "An idling petrol car emits ~0.16 kg CO₂ per 10 minutes. Turning off the engine at level crossings and long signals saves fuel and reduces local air pollution.", savingKg: 2.0, icon: "⛽", category: "Transport" },
  { title: "Use electric auto-rickshaws", description: "E-autos are now common in Delhi, Bengaluru and Pune. They produce ~70% fewer emissions per km than CNG autos and are often cheaper per ride.", savingKg: 5.0, icon: "🛺", category: "Transport" },
  { title: "Work from home when possible", description: "Eliminating one 20 km commute per week saves ~1.8 kg CO₂ per trip by car. Four WFH days a month cuts ~7 kg CO₂ and saves fuel costs too.", savingKg: 7.0, icon: "🏠", category: "Transport" },

  // 🥗 FOOD (10)
  { title: "Reduce meat consumption", description: "Swapping two beef meals a week for vegetarian alternatives saves ~10 kg CO₂ per month. Lentils, chickpeas and paneer are great protein swaps.", savingKg: 10.0, icon: "🥗", category: "Food" },
  { title: "Plant-based meal once a day", description: "Even one plant-based meal daily instead of a meat-based one can reduce your annual carbon footprint by 0.5 tonnes CO₂. Start with dal or sabzi substitutes.", savingKg: 12.0, icon: "🌱", category: "Food" },
  { title: "Eat seasonal & local produce", description: "Seasonal fruits and vegetables require no cold-chain transport. Buying from local farmers markets can halve the food-mile footprint of your meals.", savingKg: 5.5, icon: "🛒", category: "Food" },
  { title: "Reduce food waste", description: "About 8% of global emissions come from food waste. Planning meals, using leftovers creatively and composting scraps can save ~4 kg CO₂ per household monthly.", savingKg: 4.0, icon: "🍱", category: "Food" },
  { title: "Reduce dairy consumption", description: "Dairy farming is emission-intensive. Swapping cow's milk for oat or soy milk in your daily chai or coffee saves ~1.5 kg CO₂ per litre consumed.", savingKg: 4.5, icon: "🥛", category: "Food" },
  { title: "Use a pressure cooker", description: "Pressure cookers reduce cooking time by up to 70%, cutting the gas or electricity needed. Cooking dal, rice and sabzi in one saves ~3 kg CO₂ monthly.", savingKg: 3.0, icon: "🍲", category: "Food" },
  { title: "Buy whole foods, not processed", description: "Ultra-processed foods require more energy to manufacture and package. A diet of whole grains, pulses and fresh vegetables can cut food-related emissions by 30%.", savingKg: 6.0, icon: "🧅", category: "Food" },
  { title: "Compost kitchen scraps", description: "Organic waste in landfills produces methane — 25× more potent than CO₂. Home composting kitchen scraps avoids ~0.5 kg CO₂-equivalent per kg of waste diverted.", savingKg: 3.5, icon: "♻️", category: "Food" },
  { title: "Grow herbs & greens at home", description: "A small kitchen garden eliminates the transport, packaging and refrigeration footprint of shop-bought herbs. Even a windowsill pot of coriander helps.", savingKg: 1.5, icon: "🌿", category: "Food" },
  { title: "Choose sustainably sourced fish", description: "Farmed shellfish and small pelagic fish like sardines have 10× lower emissions than beef. Replacing a red-meat meal with fish saves ~3 kg CO₂ per serving.", savingKg: 3.0, icon: "🐟", category: "Food" },

  // 💡 ENERGY (10)
  { title: "Optimise home electricity", description: "Turn off appliances on standby, switch to LED bulbs, and use eco-mode on your AC. Small habits can cut electricity emissions by 15–20%.", savingKg: 8.0, icon: "💡", category: "Energy" },
  { title: "Wash clothes in cold water", description: "90% of a washing machine's energy goes to heating water. Switching to cold washes saves ~0.6 kg CO₂ per load — that's ~7 kg a month for daily washes.", savingKg: 7.0, icon: "🧺", category: "Energy" },
  { title: "Unplug chargers when not in use", description: "Phone chargers, TV set-top boxes and wifi routers on standby consume phantom power. Unplugging them saves ~3–5 kWh per month (~2.5 kg CO₂).", savingKg: 2.5, icon: "🔌", category: "Energy" },
  { title: "Air-dry clothes instead of dryer", description: "A tumble dryer uses ~2.5 kWh per cycle. India's sunny climate makes air-drying a zero-emission alternative — saving up to 5 kg CO₂ a week.", savingKg: 5.0, icon: "☀️", category: "Energy" },
  { title: "Choose energy-efficient appliances", description: "BEE 5-star rated ACs, refrigerators and fans use 20–40% less electricity. The upfront cost pays back in 2–3 years through lower bills and 15 kg less CO₂ monthly.", savingKg: 15.0, icon: "⭐", category: "Energy" },
  { title: "Take shorter showers", description: "A 10-minute hot shower uses ~0.5 kWh to heat water. Cutting showers to 5 minutes saves ~7 kg CO₂ per month per person in an electric-geyser household.", savingKg: 7.0, icon: "🚿", category: "Energy" },
  { title: "Set AC to 24–26 °C", description: "Every 1 °C increase in AC setpoint reduces energy consumption by ~6%. Setting it to 24 °C instead of 18 °C saves ~9 kg CO₂ per month during peak summer.", savingKg: 9.0, icon: "❄️", category: "Energy" },
  { title: "Use solar water heater", description: "A 100 LPD solar water heater replaces ~1,500 kWh of electric heating per year, saving ~1.2 tonnes CO₂ annually. Government subsidies cover up to 30% of the cost.", savingKg: 100.0, icon: "🌞", category: "Energy" },
  { title: "Turn off lights in empty rooms", description: "A 60 W incandescent left on 8 hr/day emits ~1.75 kg CO₂ monthly. Replacing with LED and turning off when not needed brings that to near zero.", savingKg: 1.5, icon: "🕯️", category: "Energy" },
  { title: "Use ceiling fans before switching on AC", description: "A fan cools a room by 3–4 °C and uses only 50–75 W vs. 1,500 W for a 1.5-ton AC. Running fans an extra hour before switching on AC saves ~2 kg CO₂ monthly.", savingKg: 2.0, icon: "🌀", category: "Energy" },

  // 🛍️ SHOPPING & LIFESTYLE (8)
  { title: "Buy second-hand or rent clothing", description: "Fashion is responsible for 10% of global emissions. Buying pre-owned clothes, or renting for events, can cut a garment's carbon cost by up to 82%.", savingKg: 8.0, icon: "👕", category: "Shopping" },
  { title: "Switch to e-statements & paperless billing", description: "A single paper bill's lifecycle emits ~0.25 kg CO₂. Going digital across 10 accounts saves ~2.5 kg per month.", savingKg: 2.5, icon: "📱", category: "Shopping" },
  { title: "Opt for a reusable water bottle", description: "A single-use plastic bottle takes 0.083 kg CO₂ to produce. Using a steel bottle and refilling it prevents ~2.5 kg CO₂ monthly for a daily drinker.", savingKg: 2.5, icon: "🍶", category: "Shopping" },
  { title: "Carry a reusable shopping bag", description: "A cotton tote bag used 131 times offsets the emissions from making it. Plastic bags, discarded after one use, contribute to landfill methane and litter.", savingKg: 1.0, icon: "🛍️", category: "Shopping" },
  { title: "Choose products with minimal packaging", description: "Packaging accounts for ~5% of product emissions. Buying loose produce, bulk grains and refillable containers reduces packaging waste and its embedded carbon.", savingKg: 3.0, icon: "📦", category: "Shopping" },
  { title: "Repair instead of replace", description: "Manufacturing a new smartphone emits ~70 kg CO₂. Getting your screen or battery repaired extends device life by 2 years and avoids that entire production footprint.", savingKg: 35.0, icon: "🔧", category: "Shopping" },
  { title: "Borrow, don't buy rarely-used items", description: "Tools, party equipment, and specialty appliances used once a year are better borrowed from neighbours or rented. Sharing economy reduces per-person production emissions.", savingKg: 5.0, icon: "🤝", category: "Shopping" },
  { title: "Choose eco-certified products", description: "Look for BEE star ratings, Forest Stewardship Council (FSC) labels, or Fair Trade marks. Certified products are produced with lower energy, water and land impact.", savingKg: 4.0, icon: "✅", category: "Shopping" },

  // 🌳 NATURE & OFFSET (5)
  { title: "Plant a tree or support reforestation", description: "A mature tree absorbs ~21 kg CO₂ per year. Planting one via Grow-Trees.com or SankalpTaru offsets your footprint affordably while restoring biodiversity.", savingKg: 21.0, icon: "🌳", category: "Nature" },
  { title: "Support rooftop solar installation", description: "A 1 kW rooftop solar panel in India generates ~1,400 kWh annually and offsets ~1.2 tonnes of CO₂. Net-metering allows selling excess power back to the grid.", savingKg: 100.0, icon: "🔆", category: "Nature" },
  { title: "Harvest rainwater", description: "Rainwater harvesting reduces dependency on electricity-intensive municipal water supply. A 100 m² roof can collect ~60,000 L per monsoon season.", savingKg: 2.0, icon: "🌧️", category: "Nature" },
  { title: "Create a balcony or terrace garden", description: "Green spaces reduce the urban heat island effect, lowering AC demand in buildings. Even 5 plants on a balcony provide insulation and improve air quality.", savingKg: 3.0, icon: "🪴", category: "Nature" },
  { title: "Buy carbon offsets for unavoidable flights", description: "If you must fly, offset through certified platforms like Gold Standard or Climate Partner. Offsetting a Delhi–Mumbai flight costs ~₹300 and neutralises ~0.15 tonnes CO₂.", savingKg: 150.0, icon: "✈️", category: "Nature" },

  // 💧 WATER (4)
  { title: "Fix leaky taps promptly", description: "A dripping tap wastes ~20 L of water per day. Water pumping and treatment is energy-intensive — fixing leaks saves ~0.5 kg CO₂ monthly per repaired tap.", savingKg: 0.5, icon: "🔩", category: "Water" },
  { title: "Reuse greywater for plants", description: "Kitchen rinse water and AC condensate are safe for watering plants. Reusing ~40 L/day reduces pumping demand and saves ~0.3 kg CO₂ monthly.", savingKg: 0.3, icon: "💧", category: "Water" },
  { title: "Install low-flow showerheads", description: "A low-flow showerhead uses 6–8 L/min vs. 15–20 L in standard ones. Less hot water means less geyser energy — saving ~4 kg CO₂ per person per month.", savingKg: 4.0, icon: "🚿", category: "Water" },
  { title: "Run dishwasher & washing machine full", description: "Running appliances on full loads uses the same energy as half loads. Waiting for a full drum saves ~1 kg CO₂ per avoided cycle.", savingKg: 4.0, icon: "🫧", category: "Water" },

  // 🧠 AWARENESS & HABIT (3)
  { title: "Track your carbon footprint weekly", description: "Logging activities on EcoStep creates awareness that drives real change. Users who track consistently reduce their footprint by 10–15% within 3 months.", savingKg: 8.0, icon: "📊", category: "Habit" },
  { title: "Talk to one person about sustainability", description: "Social influence is the most powerful lever for behaviour change. Sharing one eco-tip with a friend or colleague can multiply your impact far beyond your own actions.", savingKg: 5.0, icon: "💬", category: "Habit" },
  { title: "Join a local environmental group", description: "Community cleanups, tree-planting drives and policy advocacy amplify individual action. Even attending one event a month builds momentum and network effects.", savingKg: 10.0, icon: "🌍", category: "Habit" },
];

/**
 * Pick `n` unique random items from arr, avoiding previously shown indices.
 * If the remaining pool after exclusion is smaller than n, reset exclusion.
 */
function pickFresh(arr, n, excludeIndices) {
  let available = arr.map((item, i) => ({ item, i })).filter(({ i }) => !excludeIndices.has(i));
  // If too few remain, reset and use the full pool
  if (available.length < n) {
    available = arr.map((item, i) => ({ item, i }));
  }
  const shuffled = available.sort(() => Math.random() - 0.5);
  const chosen = shuffled.slice(0, n);
  return {
    tips: chosen.map(({ item }) => item),
    chosenIndices: new Set(chosen.map(({ i }) => i)),
  };
}

export default function TipsPageClient() {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);
  // Track which tip indices were shown last time so we never repeat them
  const lastIndices = useRef(new Set());

  const fetchTips = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/insights");
      if (data.tips) {
        setTips(data.tips);
        setSource(data.source);
        toast.success("AI tips generated! 🌿");
      } else {
        // AI gave "general" source — still show fresh local tips
        const { tips: fresh, chosenIndices } = pickFresh(TIPS_POOL, 3, lastIndices.current);
        lastIndices.current = chosenIndices;
        setTips(fresh);
        setSource("general");
        toast.info("Showing general tips — log more activities for personalised AI insights.");
      }
    } catch {
      const { tips: fresh, chosenIndices } = pickFresh(TIPS_POOL, 3, lastIndices.current);
      lastIndices.current = chosenIndices;
      setTips(fresh);
      setSource("fallback");
      toast.info("Showing fresh sustainability tips!");
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
            {tips ? "Generate New Tips ✨" : "Generate Personalised AI Tips"}
          </>
        )}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Tips */}
          {tips && (
            <div className="space-y-4">
              {(source === "fallback" || source === "general") && (
                <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
                  <span className="text-lg leading-none">💡</span>
                  <p>These are general tips. Log more activities to get personalised AI insights.</p>
                </div>
              )}
              {tips.map((tip, i) => (
                <TipCard key={`${tip.title}-${i}`} tip={tip} />
              ))}
            </div>
          )}

          {/* Placeholder state before first fetch */}
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

          {/* Stats Card */}
          <div className="mt-4 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-white font-semibold">💡 Did you know?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The average Indian emits ~1.9 tonnes of CO₂ per year — well below the global average of 4.7 tonnes. But urban lifestyles are closing that gap fast.
            </p>
            <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-500">
              Click the button multiple times to explore all <span className="text-emerald-400 font-medium">{TIPS_POOL.length} tips</span> across 7 categories.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
