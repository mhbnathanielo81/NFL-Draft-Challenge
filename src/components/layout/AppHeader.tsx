"use client";

import { useAuth } from "@/hooks/useAuth";
import { Bell } from "lucide-react";

export function AppHeader() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between py-3 px-4 sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)]">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-green-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,232,123,0.15)]">
          <span className="text-sm">🏈</span>
        </div>
        <span className="font-display font-bold text-[15px] tracking-wide">
          NFL DRAFT CHALLENGE
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-display font-bold text-sm text-accent">
          {user?.displayName?.[0] || "U"}
        </div>
      </div>
    </div>
  );
}
