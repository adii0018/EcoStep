"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, User, MapPin, Star, Flame, Calendar, Pencil, Check, X } from "lucide-react";
import api from "@/lib/api";

export default function ProfileClient() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", city: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/profile");
        setProfile(data.user);
        setStats(data.stats);
        setForm({ name: data.user.name, city: data.user.city || "" });
      } catch { toast.error("Failed to load profile"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", form);
      setProfile(data.user);
      // Update localStorage so sidebar reflects new name
      const stored = JSON.parse(localStorage.getItem("ecostep_user") || "{}");
      localStorage.setItem("ecostep_user", JSON.stringify({ ...stored, name: data.user.name }));
      setEditing(false);
      toast.success("Profile updated!");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
    </div>
  );

  const initials = profile?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const memberSince = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—";

  return (
    <div className="space-y-6 pt-4 md:pt-0 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">My Profile</h1>
        <p className="text-zinc-400">Manage your account and view your eco journey</p>
      </div>

      {/* Avatar + Info Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Full Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">City</label>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Mumbai"
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-400 border border-zinc-700 rounded-lg hover:text-white transition-colors">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg transition-colors">
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                    <p className="text-zinc-400 text-sm">{profile.email}</p>
                    {profile.city && (
                      <p className="text-zinc-500 text-xs flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {profile.city}
                      </p>
                    )}
                  </div>
                  <button onClick={() => setEditing(true)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500">
                  <Calendar className="w-3 h-3" /> Member since {memberSince}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "EcoPoints", value: profile.ecoPoints, icon: <Star className="w-5 h-5 text-yellow-400" />, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Day Streak", value: `${profile.streak} 🔥`, icon: <Flame className="w-5 h-5 text-orange-400" />, color: "text-orange-400", bg: "bg-orange-500/10" },
          { label: "Total CO₂", value: `${stats?.totalCo2 ?? 0} kg`, icon: <span className="text-lg">🌿</span>, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Activities", value: stats?.totalActivities ?? 0, icon: <span className="text-lg">📊</span>, color: "text-blue-400", bg: "bg-blue-500/10" },
        ].map(({ label, value, icon, color, bg }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Eco Level Banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4">
        <div className="text-4xl">
          {profile.ecoPoints >= 500 ? "🌟" : profile.ecoPoints >= 200 ? "🌿" : profile.ecoPoints >= 50 ? "🌱" : "🌾"}
        </div>
        <div>
          <p className="text-white font-bold">
            {profile.ecoPoints >= 500 ? "Eco Champion" : profile.ecoPoints >= 200 ? "Green Warrior" : profile.ecoPoints >= 50 ? "Eco Starter" : "Seedling"}
          </p>
          <p className="text-zinc-400 text-sm">
            {profile.ecoPoints >= 500 ? "You're in the top tier! Keep inspiring others." :
             profile.ecoPoints >= 200 ? `${500 - profile.ecoPoints} more points to become Eco Champion!` :
             profile.ecoPoints >= 50 ? `${200 - profile.ecoPoints} more points to become Green Warrior!` :
             `${50 - profile.ecoPoints} more points to become Eco Starter!`}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
