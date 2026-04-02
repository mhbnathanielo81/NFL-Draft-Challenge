"use client";

import { useAuth } from "@/hooks/useAuth";

export default function LeaderboardPage() {
  const { user } = useAuth();

  const players = [
    { name: user?.displayName || "You", score: 400, correct: 4, av: "🏈" },
    { name: "SarahMock26", score: 300, correct: 3, av: "🎯" },
    { name: "DraftGuru", score: 200, correct: 2, av: "🏆" },
    { name: "BearsFanMike", score: 200, correct: 2, av: "🐻" },
    { name: "PickMaster", score: 100, correct: 1, av: "⚡" },
    { name: "RookieScout", score: 100, correct: 1, av: "🔍" },
    { name: "GridironGal", score: 0, correct: 0, av: "🌟" },
    { name: "TDTommy", score: 0, correct: 0, av: "🏟️" },
  ];

  return (
    <div className="px-4">
      <h1 className="font-display text-xl font-bold tracking-wide mb-5">LEADERBOARD</h1>

      {/* Podium */}
      <div className="flex justify-center items-end gap-2 mb-6 px-2">
        {[1, 0, 2].map((idx) => {
          const p = players[idx];
          const isFirst = idx === 0;
          return (
            <div
              key={idx}
              className="flex-1 text-center rounded-2xl overflow-hidden"
              style={{
                background: isFirst
                  ? "linear-gradient(180deg, #00e87b33, var(--card))"
                  : "var(--card)",
                border: `1px solid ${isFirst ? "var(--accent)" : "var(--border)"}`,
                padding: isFirst ? "20px 8px" : "16px 8px",
                boxShadow: isFirst ? "0 0 30px #00e87b22" : "none",
              }}
            >
              <div className="text-3xl mb-1">{p.av}</div>
              <div
                className="font-display font-bold truncate"
                style={{
                  fontSize: isFirst ? 15 : 13,
                  color: isFirst ? "var(--accent)" : "var(--foreground)",
                }}
              >
                {p.name}
              </div>
              <div
                className="font-mono font-bold my-1"
                style={{ fontSize: isFirst ? 22 : 18 }}
              >
                {p.score}
              </div>
              <div className="font-mono text-[10px] text-[var(--muted)]">
                {p.correct} correct
              </div>
              <div
                className="inline-flex items-center justify-center w-6 h-6 rounded-full mt-2 font-mono text-xs font-bold text-black"
                style={{
                  background: idx === 0 ? "#FFD700" : idx === 1 ? "#C0C0C0" : "#CD7F32",
                }}
              >
                {idx + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest */}
      {players.slice(3).map((p, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3.5 py-3 mb-1 rounded-xl bg-[var(--card)] border border-[var(--border)]"
        >
          <span className="font-mono text-sm font-bold text-[var(--muted)] w-6 text-center">
            {i + 4}
          </span>
          <span className="text-xl">{p.av}</span>
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold text-sm truncate">{p.name}</div>
            <div className="font-mono text-[11px] text-[var(--muted)]">
              {p.correct} correct
            </div>
          </div>
          <span className="font-mono text-base font-bold">{p.score}</span>
        </div>
      ))}
    </div>
  );
}
