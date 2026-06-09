"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { carbonFactors, getTypesForCategory, calculateCO2, categories } from "@/lib/carbonFactors";

const categoryLabels = {
  travel: "🚗 Travel",
  food: "🍽️ Food",
  energy: "⚡ Energy",
  shopping: "🛍️ Shopping",
};

export default function ActivityForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const quantity = watch("quantity");

  // Update CO2 preview live
  useEffect(() => {
    const q = parseFloat(quantity);
    if (selectedCategory && selectedType && q > 0) {
      setPreview(calculateCO2(selectedCategory, selectedType, q));
    } else {
      setPreview(null);
    }
  }, [selectedCategory, selectedType, quantity]);

  const onSubmit = async ({ quantity }) => {
    if (!selectedCategory || !selectedType) {
      toast.error("Please select a category and type.");
      return;
    }
    setLoading(true);
    try {
      await onSuccess({ category: selectedCategory, type: selectedType, quantity: parseFloat(quantity) });
      toast.success("Activity logged! 🌱");
      reset();
      setSelectedCategory("");
      setSelectedType("");
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log activity.");
    } finally {
      setLoading(false);
    }
  };

  const types = getTypesForCategory(selectedCategory);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800">
          Log New Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  setSelectedCategory(val);
                  setSelectedType("");
                  setPreview(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
                disabled={!selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedCategory ? "Select type" : "Pick category first"} />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <Label htmlFor="quantity">
                Quantity{" "}
                <span className="text-gray-400 font-normal">
                  (km / meals / kWh / items)
                </span>
              </Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 20"
                {...register("quantity", {
                  required: "Quantity is required",
                  min: { value: 0.01, message: "Must be positive" },
                })}
                className={errors.quantity ? "border-red-400" : ""}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          {/* Live CO2 preview */}
          {preview !== null && (
            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                Estimated emission:{" "}
                <strong>{preview.toFixed(3)} kg CO₂</strong>
              </span>
            </div>
          )}

          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Log Activity"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
