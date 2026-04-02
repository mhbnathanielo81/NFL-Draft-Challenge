"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PlayerAvatar, PosBadge, ScoreBadge } from "@/components/ui/badges";
import { PROSPECTS_2026 } from "@/data/prospects";
import { DRAFT_ORDER_2026 } from "@/data/draft-order";
import { Zap, Send } from "lucide-react";

export default function LivePage() {
  const { user } = useAuth();
  const [currentPick, setCurrentPick] = useState(1);
  const [revealed, setRevealed] = useState<
    { pick: number; player: (typeof PROSPECTS_2026)[0]; team: (typeof DRAFT_ORDER_2026)[1][0] }[]
  >([]);
  const [chat, setChat] = useState([
    { user: "System", msg: "Draft Night Live is starting! 🏈", time: "8:00 PM" },
    { user: "SarahMock26", msg: "LET'S GOOO!", time: "8:01 PM" },
    { user: "DraftGuru", msg: "Mendoza #1 lock 🔒", time: "8:01 PM" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [tab, setTab] = useState<"picks" | "chat">("picks");

  const simulatePick = () => {
    if (currentPick > 32) return;
    const prospect = PROSPECTS_2026[currentPick - 1];
    const team = DRAFT_ORDER_2026[1][currentPick - 1];
    setRevealed((prev) => [...prev, { pick: currentPick, player: prospect, team }]);
    setChat((prev) => [
      ...prev,
      {
        user: "System",
        msg: `🚨 #${currentPick}: ${team.team} → ${prospect.name} (${prospect.pos})`,
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      },
    ]);
    setCurrentPick((prev) => prev + 1);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChat((prev) => [
      ...prev,
      {
        user: user?.displayName || "You",
        msg: chatInput,
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      },
    ]);
    setChatInput("");
  };

  return (
    <div className="px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-xl font-bold tracking-wide">DRAFT NIGHT</h1>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8514922] rounded-full border border-[#f8514944]">
          <div className="w-2 h-2 rounded-full bg-[#f85149] animate-[pulse_1.5s_infinite]" />
          <span className="font-mono text-[11px] font-bold text-[#f85149]">LIVE</span>
        </div>
      </div>

      {/* On the Clock */}
      <div
        className="rounded-xl p-5 text-center mb-4 border border-[var(--border)]"
        style={{
          background: "var(--card)",
          boxShadow: "0 0 30px #00e87b22",
        }}
      >
        <p className="font-mono text-[11px] text-accent tracking-[2px]">ON THE CLOCK</p>
        <p className="font-display text-2xl font-bold mt-1.5">
          {currentPick <= 32
            ? DRAFT_ORDER_2026[1][currentPick - 1]?.team
            : "DRAFT COMPLETE"}
        </p>
        <p className="font-mono text-sm text-[var(--muted)] mt-1">
          Pick #{currentPick <= 32 ? currentPick : "--"} · Round 1
        </p>
        {currentPick <= 32 && (
          <button
            onClick={simulatePick}
            className="mt-3.5 bg-accent text-black font-display font-semibold px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-2"
          >
            <Zap size={16} /> Simulate Pick
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 bg-[var(--surface)] rounded-lg p-0.5">
        {(["picks", "chat"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-md font-display font-semibold text-sm capitalize transition-colors"
            style={{
              background: tab === t ? "var(--accent)" : "transparent",
              color: tab === t ? "#000" : "var(--muted-foreground)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "chat" ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="max-h-[360px] overflow-y-auto p-3.5 space-y-2.5">
            {chat.map((m, i) => (
              <div key={i}>
                <div className="flex gap-1.5 items-baseline">
                  <span
                    className="font-display font-bold text-[13px]"
                    style={{
                      color:
                        m.user === "System"
                          ? "var(--accent)"
                          : m.user === (user?.displayName || "You")
                          ? "#3498db"
                          : "var(--foreground)",
                    }}
                  >
                    {m.user}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--muted)]">{m.time}</span>
                </div>
                <p
                  className="font-display text-[13px] mt-0.5"
                  style={{
                    color: m.user === "System" ? "var(--foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {m.msg}
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-3 border-t border-[var(--border)]">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Trash talk..."
              className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm font-display outline-none focus:border-accent/50"
            />
            <button
              onClick={sendChat}
              className="bg-accent text-black px-3 py-2.5 rounded-lg"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div>
          {[...revealed].reverse().map((rp) => (
            <div
              key={rp.pick}
              className="flex items-center gap-2.5 px-3 py-2.5 mb-1.5 rounded-xl bg-[var(--card)] border border-[var(--border)]"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-accent/20 font-mono text-sm font-bold text-accent">
                {rp.pick}
              </div>
              <PlayerAvatar name={rp.player.name} pos={rp.player.pos} size={34} />
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-sm truncate">
                  {rp.player.name}
                </div>
                <div className="font-mono text-[11px] text-[var(--muted)]">
                  {rp.team.team}
                </div>
              </div>
              <PosBadge pos={rp.player.pos} />
              <ScoreBadge points={100} />
            </div>
          ))}
          {revealed.length === 0 && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 text-center">
              <p className="text-3xl mb-2">⏳</p>
              <p className="font-display text-sm text-[var(--muted-foreground)]">
                Waiting for picks...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
