'use client';

// React core
import { useEffect, useState } from 'react';

// Third-party libraries
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import { Loader2, MapPin, Star, Flame, Calendar, Pencil, Check, X } from 'lucide-react';

// Services
import { getUserProfile, updateUserProfile } from '@/services/userService';

// Utils
import { formatMemberSinceDate } from '@/utils/date-formatter';
import { getNameInitials, resolveEcoTier, getTierProgressMessage } from '@/utils/eco-tier';

// ─── Sub-Components ───────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
    </div>
  );
}

function ProfileAvatar({ initials }) {
  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
      {initials}
    </div>
  );
}

ProfileAvatar.propTypes = {
  initials: PropTypes.string.isRequired,
};

function ProfileEditForm({ form, isSaving, onChange, onSave, onCancel }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-zinc-400 mb-1 block">Full Name</label>
        <input
          value={form.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="text-xs text-zinc-400 mb-1 block">City</label>
        <input
          value={form.city}
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="e.g. Mumbai"
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-400 border border-zinc-700 rounded-lg hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg transition-colors"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Save
        </button>
      </div>
    </div>
  );
}

ProfileEditForm.propTypes = {
  form: PropTypes.shape({ name: PropTypes.string, city: PropTypes.string }).isRequired,
  isSaving: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

function ProfileInfoDisplay({ profile, memberSince, onEditClick }) {
  return (
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
        <button
          onClick={onEditClick}
          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500">
        <Calendar className="w-3 h-3" /> Member since {memberSince}
      </div>
    </>
  );
}

ProfileInfoDisplay.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    city: PropTypes.string,
  }).isRequired,
  memberSince: PropTypes.string.isRequired,
  onEditClick: PropTypes.func.isRequired,
};

function StatCard({ label, value, icon, colorClass, backgroundClass }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3"
    >
      <div className={`w-9 h-9 rounded-xl ${backgroundClass} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
        <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
      </div>
    </motion.div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  colorClass: PropTypes.string.isRequired,
  backgroundClass: PropTypes.string.isRequired,
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfileClient() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', city: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    loadProfileData(controller.signal);
    return () => controller.abort();
  }, []);

  async function loadProfileData(signal) {
    try {
      const data = await getUserProfile(signal);
      setProfile(data.user);
      setStats(data.stats);
      setEditForm({ name: data.user.name, city: data.user.city ?? '' });
    } catch (error) {
      const isCancelled = error.name === 'CanceledError' || error.message === 'canceled';
      if (!isCancelled) toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const data = await updateUserProfile(editForm);
      setProfile(data.user);

      // Sync name update into localStorage for Sidebar display
      const storedUser = JSON.parse(localStorage.getItem('ecostep_user') ?? '{}');
      localStorage.setItem('ecostep_user', JSON.stringify({ ...storedUser, name: data.user.name }));

      setIsEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormFieldChange = (field, value) => {
    setEditForm((previous) => ({ ...previous, [field]: value }));
  };

  if (isLoading) return <LoadingSpinner />;

  const userInitials = getNameInitials(profile?.name);
  const memberSince = formatMemberSinceDate(profile?.createdAt);
  const ecoTier = resolveEcoTier(profile?.ecoPoints ?? 0);
  const tierMessage = getTierProgressMessage(profile?.ecoPoints ?? 0);

  const statCards = [
    { label: 'EcoPoints', value: profile.ecoPoints, icon: <Star className="w-5 h-5 text-yellow-400" />, colorClass: 'text-yellow-400', backgroundClass: 'bg-yellow-500/10' },
    { label: 'Day Streak', value: `${profile.streak} 🔥`, icon: <Flame className="w-5 h-5 text-orange-400" />, colorClass: 'text-orange-400', backgroundClass: 'bg-orange-500/10' },
    { label: 'Total CO₂', value: `${stats?.totalCo2 ?? 0} kg`, icon: <span className="text-lg">🌿</span>, colorClass: 'text-emerald-400', backgroundClass: 'bg-emerald-500/10' },
    { label: 'Activities', value: stats?.totalActivities ?? 0, icon: <span className="text-lg">📊</span>, colorClass: 'text-blue-400', backgroundClass: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-6 pt-4 md:pt-0 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">My Profile</h1>
        <p className="text-zinc-400">Manage your account and view your eco journey</p>
      </div>

      {/* Avatar + Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6"
      >
        <div className="flex items-start gap-5">
          <ProfileAvatar initials={userInitials} />
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <ProfileEditForm
                form={editForm}
                isSaving={isSaving}
                onChange={handleFormFieldChange}
                onSave={handleSaveProfile}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <ProfileInfoDisplay
                profile={profile}
                memberSince={memberSince}
                onEditClick={() => setIsEditing(true)}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((statCard) => (
          <StatCard key={statCard.label} {...statCard} />
        ))}
      </div>

      {/* Eco Tier Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4"
      >
        <div className="text-4xl">{ecoTier.icon}</div>
        <div>
          <p className="text-white font-bold">{ecoTier.title}</p>
          <p className="text-zinc-400 text-sm">{tierMessage}</p>
        </div>
      </motion.div>
    </div>
  );
}
