"use client";

import { useState, useMemo } from "react";
import { PlayerAvatar, PosBadge, PickBadge } from "@/components/ui/badges";
import { PROSPECTS_2026 } from "@/data/prospects";
import { DRAFT_ORDER_2026, getAllTeams } from "@/data/draft-order";
import { POS_COLORS } from "@/lib/utils";
import {
  Search,
  X,
  ArrowUpDown,
  Star,
  Send,
  ChevronRight,
} from "lucide-react";
import type { Prospect } from "@/types";

export default function DraftPage() {
  const [picks, setPicks] = useState<Record<number, Prospect>>({});
  const [confidence, setConfidence] = useState<Record<number, number>>({});
  const [activePick, setActivePick] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("ALL");
  const [showConf, setShowConf] = useState(false);
  const [trades, setTrades] = useState<{ id: number; from: string; to: string }[]>([]);
  const [showTrade, setShowTrade] = useState(false);
  const [tradeFrom, setTradeFrom] = useState("");
  const [tradeTo, setTradeTo] = useState("");
  const [activeRound, setActiveRound] = useState(1);

  const totalRounds = 1; // Will be configurable per league
  const currentSlots = DRAFT_ORDER_2026[activeRound] || [];
  const allSlots = useMemo(() => {
    const slots = [];
    for (let r = 1; r <= totalRounds; r++) slots.push(...(DRAFT_ORDER_2026[r] || []));
    return slots;
  }, [totalRounds]);

  const usedIds = new Set(Object.values(picks).map((p) => p.id));
  const positions = ["ALL", ...new Set(PROSPECTS_2026.map((p) => p.pos))];
  const available = PROSPECTS_2026.filter(
    (p) =>
      !usedIds.has(p.id) &&
      (posFilter === "ALL" || p.pos === posFilter) &&
      (search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.school.toLowerCase().includes(search.toLowerCase()))
  );
  const usedConf = new Set(Object.values(confidence));
  const filled = Object.keys(picks).length;
  const total = allSlots.length;
  const allTeams = getAllTeams();

  return (
    <div className="px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="font-display text-xl font-bold tracking-wide">
          MOCK DRAFT
        </h1>
        <div>
          <span className="font-mono text-sm text-accent">{filled}/{total}</span>
          <span className="font-mono text-sm text-[var(--muted)] ml-1">picks</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 rounded-full bg-[var(--surface)] mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${(filled / total) * 100}%`,
            background:
              filled === total
                ? "var(--accent)"
                : "linear-gradient(90deg, #00e87b, #00b862)",
          }}
        />
      </div>

      {/* Round tabs + actions */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map((r) => (
          <button
            key={r}
            onClick={() => setActiveRound(r)}
            className="px-4 py-1.5 rounded-md font-display font-semibold text-sm transition-colors"
            style={{
              background: activeRound === r ? "var(--accent)" : "var(--surface)",
              color: activeRound === r ? "#000" : "var(--muted-foreground)",
            }}
          >
            R{r}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setShowTrade(!showTrade)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-display font-semibold text-sm bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] transition-colors"
        >
          <ArrowUpDown size={14} /> Trade
        </button>
        <button
          onClick={() => setShowConf(!showConf)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-display font-semibold text-sm transition-colors"
          style={{
            background: showConf ? "var(--accent)" : "var(--surface)",
            color: showConf ? "#000" : "var(--foreground)",
            border: showConf ? "none" : "1px solid var(--border)",
          }}
        >
          <Star size={14} /> Pts
        </button>
      </div>

      {/* Trade Panel */}
      {showTrade && (
        <div className="bg-[#f39c1209] border border-[#f39c1244] rounded-xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpDown size={16} />
            <span className="font-display font-bold text-sm">PREDICT A TRADE</span>
          </div>
          <p className="font-mono text-[11px] text-[var(--muted)] mb-3">
            Correct trade + both players = 400 pts!
          </p>
          <div className="space-y-2">
            <select
              value={tradeFrom}
              onChange={(e) => setTradeFrom(e.target.value)}
              className="w-full bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] rounded-lg px-3 py-2.5 font-display text-sm"
            >
              <option value="">Team trading UP...</option>
              {allTeams.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <p className="text-center font-mono text-[11px] text-accent">
              ↕ SWAPS WITH ↕
            </p>
            <select
              value={tradeTo}
              onChange={(e) => setTradeTo(e.target.value)}
              className="w-full bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] rounded-lg px-3 py-2.5 font-display text-sm"
            >
              <option value="">Team trading DOWN...</option>
              {allTeams.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button
              onClick={() => {
                if (tradeFrom && tradeTo && tradeFrom !== tradeTo) {
                  setTrades((p) => [...p, { id: Date.now(), from: tradeFrom, to: tradeTo }]);
                  setTradeFrom("");
                  setTradeTo("");
                }
              }}
              className="w-full bg-accent text-black font-display font-semibold py-2.5 rounded-lg text-sm"
            >
              Add Trade Prediction
            </button>
          </div>
          {trades.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {trades.map((tr) => (
                <div
                  key={tr.id}
                  className="flex items-center gap-2 px-3 py-2 bg-[var(--surface)] rounded-lg"
                >
                  <span className="font-display text-xs text-accent font-semibold">
                    {tr.to}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--muted)]">↔</span>
                  <span className="font-display text-xs text-[#f39c12] font-semibold">
                    {tr.from}
                  </span>
                  <button
                    onClick={() => setTrades((p) => p.filter((t) => t.id !== tr.id))}
                    className="ml-auto text-[var(--danger)]"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Player Picker Modal */}
      {activePick !== null && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col">
          <div className="bg-[var(--card)] flex-1 flex flex-col rounded-t-2xl mt-10 overflow-hidden">
            {/* Picker Header */}
            <div className="px-4 pt-4 pb-3 border-b border-[var(--border)]">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-mono text-[11px] text-accent tracking-[2px]">
                    PICK #{activePick}
                  </p>
                  <p className="font-display text-base font-bold mt-1">
                    {allSlots.find((s) => s.pick === activePick)?.team}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActivePick(null);
                    setSearch("");
                    setPosFilter("ALL");
                  }}
                  className="bg-[var(--surface)] rounded-lg p-2 text-[var(--muted-foreground)]"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2.5 text-sm font-display outline-none focus:border-accent/50"
                />
              </div>
              <div className="flex gap-1 mt-2.5 overflow-x-auto pb-1">
                {positions.slice(0, 12).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosFilter(pos)}
                    className="px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold whitespace-nowrap transition-colors"
                    style={{
                      background: posFilter === pos ? "var(--accent)" : "var(--surface)",
                      color: posFilter === pos ? "#000" : "var(--muted-foreground)",
                    }}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
            {/* Player List */}
            <div className="flex-1 overflow-y-auto px-4">
              {available.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setPicks((prev) => ({ ...prev, [activePick]: p }));
                    setActivePick(null);
                    setSearch("");
                    setPosFilter("ALL");
                  }}
                  className="flex items-center gap-3 py-2.5 border-b border-[var(--border)] cursor-pointer active:bg-[var(--surface)] transition-colors"
                >
                  <PlayerAvatar name={p.name} pos={p.pos} size={36} />
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
          </div>
        </div>
      )}

      {/* Pick List */}
      {currentSlots.map((slot) => {
        const player = picks[slot.pick];
        return (
          <div
            key={slot.pick}
            onClick={() => setActivePick(slot.pick)}
            className="flex items-center gap-2.5 px-3 py-2.5 mb-1.5 rounded-xl cursor-pointer transition-colors active:bg-[var(--surface)]"
            style={{
              background: player ? "var(--card)" : "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <PickBadge pick={slot.pick} filled={!!player} />
            {player && <PlayerAvatar name={player.name} pos={player.pos} size={34} />}
            <div className="flex-1 min-w-0">
              {player ? (
                <>
                  <div className="font-display font-semibold text-sm truncate">
                    {player.name}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--muted)]">
                    {player.school} · {player.pos}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-display font-medium text-sm text-[var(--muted)]">
                    Select player...
                  </div>
                  <div className="font-mono text-[11px] text-[var(--muted)]">
                    {slot.team}
                    {slot.note ? ` (${slot.note})` : ""}
                  </div>
                </>
              )}
            </div>
            {player && <PosBadge pos={player.pos} />}
            {showConf && player && (
              <select
                onClick={(e) => e.stopPropagation()}
                value={confidence[slot.pick] || ""}
                onChange={(e) =>
                  setConfidence((p) => ({
                    ...p,
                    [slot.pick]: parseInt(e.target.value),
                  }))
                }
                className="bg-[var(--surface)] border border-[var(--border)] rounded-md px-1.5 py-1 font-mono text-xs font-bold w-[52px]"
                style={{
                  color: confidence[slot.pick]
                    ? "var(--accent)"
                    : "var(--muted)",
                }}
              >
                <option value="">-</option>
                {Array.from({ length: total }, (_, i) => i + 1)
                  .filter((n) => !usedConf.has(n) || n === confidence[slot.pick])
                  .map((n) => (
                    <option key={n} value={n}>
                      {n}pt
                    </option>
                  ))}
              </select>
            )}
            <ChevronRight size={16} className="text-[var(--muted)]" />
          </div>
        );
      })}

      {/* Submit */}
      {filled === total && (
        <div className="sticky bottom-20 pt-3">
          <button className="w-full bg-accent text-black font-display font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,232,123,0.2)]">
            <Send size={16} /> SUBMIT MOCK DRAFT
          </button>
        </div>
      )}
    </div>
  );
}
