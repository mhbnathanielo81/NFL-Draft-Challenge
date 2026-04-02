import { POS_COLORS, getInitials } from "@/lib/utils";
import type { Position } from "@/types";

// ─── Player Avatar with position-colored initials ────────────────────────
export function PlayerAvatar({
  name,
  pos,
  size = 40,
}: {
  name: string;
  pos: string;
  size?: number;
}) {
  const color = POS_COLORS[pos] || "#666";
  const initials = getInitials(name);

  return (
    <div
      className="flex items-center justify-center font-display font-bold relative overflow-hidden"
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: size * 0.28,
        background: `linear-gradient(135deg, ${color}44, ${color}22)`,
        border: `2px solid ${color}66`,
        fontSize: size * 0.36,
        color,
        letterSpacing: 0.5,
      }}
    >
      <div
        className="absolute"
        style={{
          bottom: -2,
          right: -2,
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: "50%",
          background: `${color}11`,
          filter: "blur(6px)",
        }}
      />
      <span className="relative z-10">{initials}</span>
    </div>
  );
}

// ─── Position Badge ──────────────────────────────────────────────────────
export function PosBadge({ pos }: { pos: string }) {
  const color = POS_COLORS[pos] || "#666";
  return (
    <span
      className="font-mono text-[11px] font-bold tracking-wider"
      style={{
        background: `${color}22`,
        color,
        padding: "2px 8px",
        borderRadius: 4,
        border: `1px solid ${color}44`,
      }}
    >
      {pos}
    </span>
  );
}

// ─── Pick Number Badge ───────────────────────────────────────────────────
export function PickBadge({
  pick,
  filled = false,
}: {
  pick: number;
  filled?: boolean;
}) {
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[13px] font-bold"
      style={{
        background: filled ? "var(--accent-dim, #00e87b33)" : "#21262d",
        color: filled ? "var(--accent, #00e87b)" : "var(--muted, #484f58)",
      }}
    >
      {pick}
    </div>
  );
}

// ─── Score Badge ─────────────────────────────────────────────────────────
export function ScoreBadge({
  points,
  variant = "positive",
}: {
  points: number;
  variant?: "positive" | "neutral";
}) {
  return (
    <div
      className="px-2 py-1 rounded-md font-mono text-xs font-bold"
      style={{
        background: variant === "positive" ? "#00e87b22" : "#48505822",
        color: variant === "positive" ? "#00e87b" : "#8b949e",
        border: `1px solid ${variant === "positive" ? "#00e87b44" : "#48505844"}`,
      }}
    >
      +{points}
    </div>
  );
}
