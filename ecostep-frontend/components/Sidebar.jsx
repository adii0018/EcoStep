"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Lightbulb, Leaf, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/log", label: "Log Activity", icon: PlusCircle },
  { href: "/tips", label: "AI Tips", icon: Lightbulb },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* ── Desktop sidebar ────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-zinc-950/50 backdrop-blur-xl border-r border-white/10 py-6 px-4 fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">EcoStep</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
                )}
              >
                <Icon
                  className={cn("w-5 h-5", active ? "text-emerald-400" : "text-zinc-500")}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="pt-4 border-t border-white/10 mt-auto">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-zinc-500 truncate">{user?.email || ""}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom nav ──────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-t border-white/10 flex pb-safe">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors gap-1",
                active ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon className={cn("w-5 h-5", active ? "text-emerald-400" : "text-zinc-500")} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium text-zinc-500 hover:text-red-400 gap-1 transition-colors"
        >
          <LogOut className="w-5 h-5 text-zinc-500" />
          Logout
        </button>
      </nav>
    </>
  );
}
