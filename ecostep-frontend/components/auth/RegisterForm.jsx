"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2, User, ShieldCheck } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine(val => val === true, "You must agree to the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterForm({ onError }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password", "");

  const getPasswordStrength = (pw) => {
    if (!pw) return 0;
    let strength = 0;
    if (pw.length > 7) strength += 1;
    if (/[A-Z]/.test(pw)) strength += 1;
    if (/[0-9]/.test(pw)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pw)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(passwordValue);

  const renderStrengthBars = () => {
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-emerald-500"];
    const labels = ["Weak", "Fair", "Good", "Strong"];
    
    return (
      <div className="mt-2">
        <div className="flex gap-1 h-1.5 w-full">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`flex-1 rounded-full transition-colors duration-300 ${
                strength >= level ? colors[strength - 1] : "bg-zinc-800"
              }`}
            />
          ))}
        </div>
        {passwordValue && (
           <p className={`text-xs mt-1 font-medium ${strength >= 4 ? 'text-emerald-400' : strength >= 3 ? 'text-yellow-400' : strength >= 2 ? 'text-orange-400' : 'text-red-400'}`}>
             {labels[strength === 0 ? 0 : strength - 1]} password
           </p>
        )}
      </div>
    );
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://ecostep-backend.onrender.com/api'}/auth/register`, {
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      const { token, user } = response.data;
      
      Cookies.set("ecostep_token", token, { expires: 7 });
      localStorage.setItem("ecostep_user", JSON.stringify(user));
      
      toast.success("Account created! Welcome to EcoStep 🌿");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
      if (onError) onError();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Live region for form submission announcements */}
      <div className="sr-only" role="status" aria-live="polite">
        {isSubmitting ? "Creating your account, please wait..." : ""}
      </div>

      <div className="space-y-1">
        <label htmlFor="name-input" className="text-sm font-medium text-zinc-400 block mb-1">Full name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            id="name-input"
            {...register("name")}
            type="text"
            placeholder="Rahul Sharma"
            autoComplete="name"
            disabled={isSubmitting}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`block w-full pl-10 pr-3 py-3 bg-white/5 border ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-emerald-500'} text-white placeholder:text-zinc-600 rounded-xl focus:outline-none focus:ring-1 transition-colors`}
          />
        </div>
        {errors.name && <p id="name-error" className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email-input" className="text-sm font-medium text-zinc-400 block mb-1">Email address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            id="email-input"
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`block w-full pl-10 pr-3 py-3 bg-white/5 border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-emerald-500'} text-white placeholder:text-zinc-600 rounded-xl focus:outline-none focus:ring-1 transition-colors`}
          />
        </div>
        {errors.email && <p id="email-error" className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="password-input" className="text-sm font-medium text-zinc-400 block mb-1">Create password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            id="password-input"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            disabled={isSubmitting}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`block w-full pl-10 pr-10 py-3 bg-white/5 border ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-emerald-500'} text-white placeholder:text-zinc-600 rounded-xl focus:outline-none focus:ring-1 transition-colors`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isSubmitting}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {renderStrengthBars()}
        {errors.password && <p id="password-error" className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword-input" className="text-sm font-medium text-zinc-400 block mb-1">Confirm password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ShieldCheck className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            id="confirmPassword-input"
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            autoComplete="new-password"
            disabled={isSubmitting}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            className={`block w-full pl-10 pr-10 py-3 bg-white/5 border ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-emerald-500'} text-white placeholder:text-zinc-600 rounded-xl focus:outline-none focus:ring-1 transition-colors`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isSubmitting}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p id="confirmPassword-error" className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <div className="flex items-start gap-2 pt-2 pb-2">
        <input
          {...register("terms")}
          id="terms"
          type="checkbox"
          disabled={isSubmitting}
          aria-invalid={errors.terms ? "true" : "false"}
          aria-describedby={errors.terms ? "terms-error" : undefined}
          className="mt-1 w-4 h-4 bg-zinc-900 border-white/20 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-950"
        />
        <label htmlFor="terms" className="text-sm text-zinc-400 leading-tight">
          I agree to the <a href="#" className="underline hover:text-white">Terms of Service</a> and <a href="#" className="underline hover:text-white">Privacy Policy</a>
        </label>
      </div>
      {errors.terms && <p id="terms-error" className="text-xs text-red-400 -mt-2 mb-2">{errors.terms.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 px-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.25)]"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>Create account &rarr;</>
        )}
      </button>
    </form>
  );
}
