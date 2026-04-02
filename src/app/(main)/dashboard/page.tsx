"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { PlayerAvatar, PosBadge } from "@/components/ui/badges";
import { PROSPECTS_2026 } from "@/data/prospects";
import { ClipboardList, Users, Trophy, Zap } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const draftDate = new Date("2026-04-23T20:00:00-04:00");
  const now = new Date();
  const diff = draftDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / 86400000));
  const hrs = Math.max(0, Math.floor((diff % 86400000) / 3600000));

  const actions = [
    { icon: ClipboardList, label: "My Mock Draft", sub: "Build predictions", href: "/draft" },
    { icon: Users, label: "My Leagues", sub: "Manage groups", href: "/leagues" },
    { icon: Trophy, label: "Leaderboard", sub: "View standings", href: "/leaderboard" },
    { icon: Zap, label: "Draft Night", sub: "Live mode", href: "/live" },
  ];

  return (
    <div className="px-4">
      {/* Countdown Hero */}
      <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[#111d2b] p-6 relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full bg-accent/10 blur-[40px]" />
        <p className="font-mono text-[11px] text-accent tracking-[3px]">
          DRAFT NIGHT COUNTDOWN
        </p>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="font-display text-[48px] font-bold leading-none">{days}</span>
          <span className="font-mono text-sm text-[var(--muted-foreground)]">days</span>
          <span className="font-display text-[48px] font-bold leading-none ml-2">{hrs}</span>
          <span className="font-mono text-sm text-[var(--muted-foreground)]">hrs</span>
        </div>
        <p className="font-mono text-xs text-[var(--muted)] mt-1">
          April 23, 2026 · Pittsburgh, PA
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        {actions.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-left hover:border-accent/30 transition-colors"
          >
            <item.icon size={20} className="text-accent" />
            <div className="mt-2">
              <div className="font-display font-semibold text-sm">{item.label}</div>
              <div className="font-mono text-[11px] text-[var(--muted)] mt-0.5">
                {item.sub}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Top Prospects */}
      <h2 className="font-display text-lg font-bold tracking-wide mt-6 mb-3">
        TOP PROSPECTS
      </h2>
      {PROSPECTS_2026.slice(0, 10).map((p, i) => (
        <div
          key={p.id}
          className="flex items-center gap-3 py-2.5"
          style={{
            borderBottom: i < 9 ? "1px solid var(--border)" : "none",
          }}
        >
          <span className="font-mono text-sm text-[var(--muted)] w-6 text-right">
            {i + 1}
          </span>
          <PlayerAvatar name={p.name} pos={p.pos} size={40} />
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold text-sm truncate">
              {p.name}
            </div>
            <div className="font-mono text-[11px] text-[var(--muted)]">
              {p.school}
            </div>
          </div>
          <PosBadge pos={p.pos} />
        </div>
      ))}
    </div>
  );
}
