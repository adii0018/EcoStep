'use client';

// React core
import { useEffect, useState, useCallback, useMemo, memo } from 'react';

// Third-party libraries
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import { Loader2, Filter, Download, Trash2, Pencil, X, Check, History } from 'lucide-react';

// Services
import { updateActivity, deleteActivity as deleteActivityApi, getActivities } from '@/services/activityService';

// Utils
import { downloadActivitiesAsCsv } from '@/utils/csv-exporter';
import { formatActivityDate } from '@/utils/date-formatter';

// Constants
import { APP_CONFIG } from '@/constants/appConfig';

const FILTER_CATEGORIES = ['all', ...APP_CONFIG.CATEGORIES];
const DEFAULT_FILTERS = { category: 'all', from: '', to: '' };

// ─── Sub-Component: EditModal ─────────────────────────────────────────────────

const EditModal = memo(function EditModal({ activity, onSave, onClose }) {
  const [form, setForm] = useState({
    category: activity.category,
    type: activity.type,
    quantity: activity.quantity,
    date: activity.date?.split('T')[0] ?? '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const updateFormField = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      await updateActivity(activity._id, form);
      toast.success('Activity updated!');
      onSave();
    } catch {
      toast.error('Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white font-bold text-lg">Edit Activity</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <ModalField label="Category">
            <select
              value={form.category}
              onChange={updateFormField('category')}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm"
            >
              {APP_CONFIG.CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </ModalField>
          <ModalField label="Type">
            <input
              value={form.type}
              onChange={updateFormField('type')}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm"
            />
          </ModalField>
          <ModalField label="Quantity">
            <input
              type="number"
              value={form.quantity}
              onChange={updateFormField('quantity')}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm"
            />
          </ModalField>
          <ModalField label="Date">
            <input
              type="date"
              value={form.date}
              onChange={updateFormField('date')}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm"
            />
          </ModalField>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
});

EditModal.propTypes = {
  activity: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    date: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

// ─── Sub-Component: ModalField (label + children wrapper) ────────────────────

function ModalField({ label, children }) {
  return (
    <div>
      <label className="text-xs text-zinc-400 mb-1 block">{label}</label>
      {children}
    </div>
  );
}

ModalField.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// ─── Sub-Component: ActivityTableRow ─────────────────────────────────────────

function ActivityTableRow({ activity, index, onEdit, onDelete }) {
  const categoryColorClass = APP_CONFIG.CATEGORY_COLORS[activity.category] ?? '';
  const categoryEmoji = APP_CONFIG.CATEGORY_EMOJIS[activity.category] ?? '';

  return (
    <motion.tr
      key={activity._id}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-colors"
    >
      <td className="px-5 py-3 text-zinc-400 whitespace-nowrap">
        {formatActivityDate(activity.date)}
      </td>
      <td className="px-5 py-3">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${categoryColorClass}`}>
          {categoryEmoji} {activity.category}
        </span>
      </td>
      <td className="px-5 py-3 text-white capitalize">{activity.type}</td>
      <td className="px-5 py-3 text-right text-zinc-400">{activity.quantity}</td>
      <td className="px-5 py-3 text-right font-bold text-emerald-400">
        {activity.co2.toFixed(2)}
      </td>
      <td className="px-5 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(activity)}
            className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(activity._id)}
            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

ActivityTableRow.propTypes = {
  activity: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    co2: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HistoryClient() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editTarget, setEditTarget] = useState(null);
  const [totalActivityCount, setTotalActivityCount] = useState(0);

  const hasActiveFilters =
    filters.category !== 'all' || filters.from !== '' || filters.to !== '';

  /** Constructs query params from non-default filter values. */
  const buildFilterParams = useCallback(() => {
    const params = {};
    if (filters.category !== 'all') params.category = filters.category;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    return params;
  }, [filters]);

  const fetchActivities = useCallback(async (signal) => {
    setIsLoading(true);
    try {
      const params = buildFilterParams();
      const data = await getActivities(params, signal);
      setActivities(data.activities ?? []);
      setTotalActivityCount(data.total ?? 0);
    } catch (error) {
      const isCancelled = error.name === 'CanceledError' || error.message === 'canceled';
      if (!isCancelled) toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  }, [buildFilterParams]);

  useEffect(() => {
    const controller = new AbortController();
    fetchActivities(controller.signal);
    return () => controller.abort();
  }, [fetchActivities]);

  const handleDeleteActivity = async (activityId) => {
    if (!confirm('Delete this activity?')) return;
    try {
      await deleteActivityApi(activityId);
      toast.success('Deleted!');
      fetchActivities();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleEditSave = () => {
    setEditTarget(null);
    fetchActivities();
  };

  // Memoize to avoid recalculating total on every render
  const totalCo2 = useMemo(
    () => activities.reduce((total, activity) => total + activity.co2, 0),
    [activities]
  );

  return (
    <div className="space-y-6 pt-4 md:pt-0">
      {editTarget && (
        <EditModal
          activity={editTarget}
          onSave={handleEditSave}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1 flex items-center gap-3">
            <History className="w-7 h-7 text-emerald-400" /> Activity History
          </h1>
          <p className="text-zinc-400">
            {totalActivityCount} activities · {totalCo2.toFixed(1)} kg CO₂ total
          </p>
        </div>
        <button
          onClick={() => downloadActivitiesAsCsv(activities)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-wrap gap-3 items-end">
        <Filter className="w-4 h-4 text-zinc-500 self-center" />
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-1.5 text-sm"
          >
            {FILTER_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">From</label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">To</label>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors mt-auto"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Activity Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        )}

        {!isLoading && activities.length === 0 && (
          <div className="py-16 text-center text-zinc-500">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium text-white">No activities found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}

        {!isLoading && activities.length > 0 && (
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
                  {activities.map((activity, index) => (
                    <ActivityTableRow
                      key={activity._id}
                      activity={activity}
                      index={index}
                      onEdit={setEditTarget}
                      onDelete={handleDeleteActivity}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
              <tfoot>
                <tr className="bg-zinc-800/30">
                  <td colSpan={4} className="px-5 py-3 text-zinc-400 text-xs font-medium">
                    Total ({activities.length} activities)
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-emerald-400">
                    {totalCo2.toFixed(2)}
                  </td>
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
