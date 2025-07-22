"use client";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  BarChart3,
  Home,
  Receipt,
  Shield,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Policies", icon: Shield, href: "/dashboard/policies" },
  { label: "Predictions", icon: Zap, href: "/dashboard/predictions" },
  { label: "Business", icon: Home, href: "/dashboard" },
  { label: "Revenue", icon: TrendingUp, href: "/dashboard/revenue" },
  { label: "Wages", icon: Wallet, href: "/dashboard/wages" },
  { label: "Costs", icon: Receipt, href: "/dashboard/costs" },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();

  const readableDate = user?.lastSignInAt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-medium">
          Please sign in to access the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <aside className="relative w-64 bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/50 flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            BizRipple
          </div>
        </div>

        <nav className="flex flex-col space-y-2">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-slate-800/50 hover:translate-x-1",
                  isActive &&
                    "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-blue-400"
                      : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span
                  className={cn(
                    "font-medium transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-300 group-hover:text-white"
                  )}
                >
                  {label}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="space-y-1 mb-3">
            <div className="flex items-center text-sm space-x-3">
              <UserButton />
              <span className="text-slate-300">{user.fullName}</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 mb-2">Last Login:</div>
          <div className="space-y-1">
            <span className="text-slate-300 text-sm">{readableDate}</span>
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <header className="relative w-full bg-slate-900/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="text-xl font-semibold text-white">Dashboard</div>
            <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
              <span className="text-sm text-blue-400 font-medium">
                Live Data
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">System Online</span>
            </div>
            <UserButton />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto relative">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
