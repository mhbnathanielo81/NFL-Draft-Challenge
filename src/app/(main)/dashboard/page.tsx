"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const draftDate = new Date("2026-04-23T20:00:00-04:00");
  const now = new Date();
  const diff = draftDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / 86400000));
  const hrs = Math.max(0, Math.floor((diff % 86400000) / 3600000));

  return (
    <div className="min-h-screen bg-[var(--background)] max-w-lg mx-auto px-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between py-4 sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black font-bold text-sm">
            DC
          </div>
          <span className="font-display font-bold text-base tracking-wide">
            NFL DRAFT CHALLENGE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-display font-bold text-sm text-accent">
            {user.displayName?.[0] || "U"}
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full bg-accent/10 blur-[40px]" />
        <p className="font-mono text-xs text-accent tracking-widest">DRAFT NIGHT COUNTDOWN</p>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="font-display text-5xl font-bold">{days}</span>
          <span className="font-mono text-sm text-[var(--muted-foreground)]">days</span>
          <span className="font-display text-5xl font-bold ml-2">{hrs}</span>
          <span className="font-mono text-sm text-[var(--muted-foreground)]">hrs</span>
        </div>
        <p className="font-mono text-xs text-[var(--muted)] mt-1">
          April 23, 2026 · Pittsburgh, PA
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {[
          { label: "My Mock Draft", sub: "Build predictions", href: "/draft", emoji: "📋" },
          { label: "My Leagues", sub: "Manage groups", href: "/leagues", emoji: "👥" },
          { label: "Leaderboard", sub: "View standings", href: "/leaderboard", emoji: "🏆" },
          { label: "Draft Night", sub: "Live mode", href: "/live", emoji: "⚡" },
        ].map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-left hover:border-accent/30 transition-colors"
          >
            <span className="text-2xl">{item.emoji}</span>
            <div className="mt-2">
              <div className="font-display font-semibold text-sm">{item.label}</div>
              <div className="font-mono text-xs text-[var(--muted)] mt-0.5">{item.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Welcome message */}
      <div className="mt-6 bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 text-center">
        <p className="text-3xl mb-2">🏈</p>
        <p className="font-display font-semibold text-base">
          Welcome, {user.displayName || "Draft King"}!
        </p>
        <p className="font-mono text-xs text-[var(--muted)] mt-2">
          Create a league and start building your mock draft.
        </p>
      </div>
    </div>
  );
}
