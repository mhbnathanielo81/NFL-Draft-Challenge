import type { DraftSlot } from "@/types";

/**
 * Renders a styled team logo badge using the team abbreviation and color.
 * Displays the abbreviation in a circle with the team's brand color.
 */
export function TeamLogo({
  abbr,
  color,
  size = 28,
}: {
  abbr: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      className="flex items-center justify-center font-display font-bold shrink-0"
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        color: "#fff",
        fontSize: size * 0.32,
        letterSpacing: 0.3,
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        boxShadow: `0 0 0 2px ${color}44`,
      }}
    >
      {abbr}
    </div>
  );
}
