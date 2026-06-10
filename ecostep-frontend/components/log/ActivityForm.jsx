'use client';

// React core
import { useState, useEffect, useCallback, memo } from 'react';

// Third-party libraries
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Zap } from 'lucide-react';
import PropTypes from 'prop-types';

// Internal components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Utils / Constants
import { getTypesForCategory, calculateCO2 } from '@/lib/carbonFactors';
import { APP_CONFIG } from '@/constants/appConfig';

// ─── Static Constants (Memory Optimization) ───────────────────────────────────

const CATEGORY_LABELS = {
  travel: '🚗 Travel',
  food: '🍽️ Food',
  energy: '⚡ Energy',
  shopping: '🛍️ Shopping',
};

// ─── Main Component ───────────────────────────────────────────────────────────

function ActivityForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const quantity = watch('quantity');

  // Update CO2 preview live
  useEffect(() => {
    const q = parseFloat(quantity);
    if (selectedCategory && selectedType && q > 0) {
      setPreview(calculateCO2(selectedCategory, selectedType, q));
    } else {
      setPreview(null);
    }
  }, [selectedCategory, selectedType, quantity]);

  const handleCategoryChange = useCallback((val) => {
    setSelectedCategory(val);
    setSelectedType('');
    setPreview(null);
  }, []);

  const onSubmit = useCallback(
    async ({ quantity }) => {
      if (!selectedCategory || !selectedType) {
        toast.error('Please select a category and type.');
        return;
      }
      setLoading(true);
      try {
        await onSuccess({
          category: selectedCategory,
          type: selectedType,
          quantity: parseFloat(quantity),
        });
        toast.success('Activity logged! 🌱');
        reset();
        setSelectedCategory('');
        setSelectedType('');
        setPreview(null);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to log activity.');
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, selectedType, onSuccess, reset]
  );

  const types = getTypesForCategory(selectedCategory);

  return (
    <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

      <div className="mb-6">
        <h3 className="text-white font-semibold text-lg">Log New Activity</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-zinc-300">Category</Label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="bg-zinc-950/50 border-zinc-800 text-white focus:ring-emerald-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                {APP_CONFIG.CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="focus:bg-zinc-800 focus:text-white">
                    {CATEGORY_LABELS[cat] || cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-zinc-300">Type</Label>
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
              disabled={!selectedCategory}
            >
              <SelectTrigger className="bg-zinc-950/50 border-zinc-800 text-white focus:ring-emerald-500 disabled:opacity-50 disabled:bg-zinc-900">
                <SelectValue
                  placeholder={selectedCategory ? 'Select type' : 'Pick category first'}
                />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                {types.map((t) => (
                  <SelectItem key={t} value={t} className="focus:bg-zinc-800 focus:text-white">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <Label htmlFor="quantity" className="text-zinc-300">
              Quantity{' '}
              <span className="text-zinc-500 font-normal">
                (km / meals / kWh / items)
              </span>
            </Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g. 20"
              {...register('quantity', {
                required: 'Quantity is required',
                min: { value: 0.01, message: 'Must be positive' },
              })}
              className={`bg-zinc-950/50 border-zinc-800 text-white focus-visible:ring-emerald-500 ${
                errors.quantity ? 'border-red-500/50 focus-visible:ring-red-500' : ''
              }`}
            />
            {errors.quantity && (
              <p className="text-xs text-red-400">{errors.quantity.message}</p>
            )}
          </div>
        </div>

        {/* Live CO2 preview */}
        {preview !== null && (
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mt-4">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-100 font-medium">
              Estimated emission:{' '}
              <strong className="text-emerald-400">{preview.toFixed(3)} kg CO₂</strong>
            </span>
          </div>
        )}

        <Button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all mt-4 w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            'Log Activity'
          )}
        </Button>
      </form>
    </div>
  );
}

ActivityForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

// Memoize to prevent unnecessary re-renders
export default memo(ActivityForm);
