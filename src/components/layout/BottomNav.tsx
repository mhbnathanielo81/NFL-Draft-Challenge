"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ClipboardList,
  Users,
  Trophy,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "/dashboard", icon: Home, label: "Home" },
  { id: "/draft", icon: ClipboardList, label: "Draft" },
  { id: "/leagues", icon: Users, label: "Leagues" },
  { id: "/leaderboard", icon: Trophy, label: "Board" },
  { id: "/live", icon: Zap, label: "Live" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg flex bg-[var(--card)] border-t border-[var(--border)] z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 12px)", paddingTop: "8px" }}
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.id;
        return (
          <button
            key={item.id}
            onClick={() => router.push(item.id)}
            className="flex-1 flex flex-col items-center gap-1 transition-colors"
            style={{ color: active ? "var(--accent, #00e87b)" : "var(--muted, #484f58)" }}
          >
            <item.icon size={20} style={{ opacity: active ? 1 : 0.5 }} />
            <span className="font-mono text-[9px] font-semibold tracking-wider">
              {item.label}
            </span>
            {active && (
              <div className="w-4 h-0.5 rounded-full bg-accent mt-0.5" />
            )}
          </button>
        );
      })}
    </div>
  );
}
