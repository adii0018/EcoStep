"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Filter, Download, Trash2, Pencil, X, Check, History } from "lucide-react";
import api from "@/lib/api";

const CATEGORIES = ["all", "travel", "food", "energy", "shopping"];
const CATEGORY_COLORS = { travel: "text-blue-400 bg-blue-500/10", food: "text-orange-400 bg-orange-500/10", energy: "text-yellow-400 bg-yellow-500/10", shopping: "text-purple-400 bg-purple-500/10" };
const CATEGORY_EMOJI = { travel: "🚗", food: "🍽️", energy: "⚡", shopping: "🛍️" };

function EditModal({ activity, onSave, onClose }) {
  const [form, setForm] = useState({ category: activity.category, type: activity.type, quantity: activity.quantity, date: activity.date?.split("T")[0] || "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/activities/${activity._id}`, form);
      toast.success("Activity updated!");
      onSave();
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white font-bold text-lg">Edit Activity</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm">
              {["travel","food","energy","shopping"].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Type</label>
            <input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Quantity</label>
            <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-colors flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function exportCSV(activities) {
  const headers = ["Date","Category","Type","Quantity","CO2 (kg)"];
  const rows = activities.map(a => [
    new Date(a.date).toLocaleDateString("en-IN"),
    a.category, a.type, a.quantity, a.co2.toFixed(2)
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "ecostep_activities.csv"; a.click();
  URL.revokeObjectURL(url);
  toast.success("CSV downloaded!");
}

export default function HistoryClient() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "all", from: "", to: "" });
  const [editTarget, setEditTarget] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category !== "all") params.category = filters.category;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      const { data } = await api.get("/activities", { params });
      setActivities(data.activities || []);
      setTotal(data.total || 0);
    } catch { toast.error("Failed to load activities"); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this activity?")) return;
    try {
      await api.delete(`/activities/${id}`);
      toast.success("Deleted!");
      fetchActivities();
    } catch { toast.error("Delete failed"); }
  };

  const totalCo2 = activities.reduce((s, a) => s + a.co2, 0);

  return (
    <div className="space-y-6 pt-4 md:pt-0">
      {editTarget && <EditModal activity={editTarget} onSave={() => { setEditTarget(null); fetchActivities(); }} onClose={() => setEditTarget(null)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1 flex items-center gap-3">
            <History className="w-7 h-7 text-emerald-400" /> Activity History
          </h1>
          <p className="text-zinc-400">{total} activities · {totalCo2.toFixed(1)} kg CO₂ total</p>
        </div>
        <button onClick={() => exportCSV(activities)} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-wrap gap-3 items-end">
        <Filter className="w-4 h-4 text-zinc-500 self-center" />
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Category</label>
          <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-1.5 text-sm">
            {CATEGORIES.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">From</label>
          <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">To</label>
          <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-1.5 text-sm" />
        </div>
        {(filters.category !== "all" || filters.from || filters.to) && (
          <button onClick={() => setFilters({ category: "all", from: "", to: "" })} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors mt-auto">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
        ) : activities.length === 0 ? (
          <div className="py-16 text-center text-zinc-500">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium text-white">No activities found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Category</th>
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-right px-5 py-3">Qty</th>
                  <th className="text-right px-5 py-3">CO₂ (kg)</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {activities.map((a, i) => (
                    <motion.tr key={a._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                      className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 text-zinc-400 whitespace-nowrap">{new Date(a.date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[a.category]}`}>
                          {CATEGORY_EMOJI[a.category]} {a.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-white capitalize">{a.type}</td>
                      <td className="px-5 py-3 text-right text-zinc-400">{a.quantity}</td>
                      <td className="px-5 py-3 text-right font-bold text-emerald-400">{a.co2.toFixed(2)}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditTarget(a)} className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(a._id)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
              <tfoot>
                <tr className="bg-zinc-800/30">
                  <td colSpan={4} className="px-5 py-3 text-zinc-400 text-xs font-medium">Total ({activities.length} activities)</td>
                  <td className="px-5 py-3 text-right font-bold text-emerald-400">{totalCo2.toFixed(2)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
