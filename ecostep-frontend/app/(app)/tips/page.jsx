"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import api from "@/lib/api";
import TipCard from "@/components/tips/TipCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sustainability Tips</h1>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered advice based on your recent activities
        </p>
      </div>

      {/* CTA */}
      <Button
        onClick={fetchTips}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating tips…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Get AI Tips
          </>
        )}
      </Button>

      {/* Tips */}
      {tips && (
        <div className="space-y-3">
          {source === "fallback" && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              💡 These are general tips. Log more activities to get personalised AI insights.
            </p>
          )}
          {tips.map((tip, i) => (
            <TipCard key={i} tip={tip} />
          ))}
        </div>
      )}

      {/* Placeholder state before fetch */}
      {!tips && !loading && (
        <div className="py-12 text-center text-gray-400">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-green-300" />
          <p className="text-sm font-medium">Click &quot;Get AI Tips&quot; to generate personalised advice.</p>
          <p className="text-xs mt-1">We&apos;ll analyse your last 7 days of activities.</p>
        </div>
      )}

      {/* Weekly Challenge Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-green-800 flex items-center gap-2">
            🏆 Weekly Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-green-700 font-medium">
            Walk or cycle for trips under 2 km this week
          </p>
          <p className="text-xs text-green-600">
            Replacing short car trips with walking or cycling can save up to 5 kg CO₂ per week
            and improve your health!
          </p>
          <div>
            <div className="flex justify-between text-xs text-green-600 mb-1.5">
              <span>Progress</span>
              <span>60%</span>
            </div>
            <Progress value={60} className="h-2 bg-green-200 [&>div]:bg-green-500" />
          </div>
          <p className="text-xs text-green-500">3 of 5 days completed</p>
        </CardContent>
      </Card>
    </div>
  );
}
