"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PlayerAvatar, PosBadge, PickBadge } from "@/components/ui/badges";
import { TeamLogo } from "@/components/ui/TeamLogo";
import { PROSPECTS_2026 } from "@/data/prospects";
import { DRAFT_ORDER_2026, getAllTeams } from "@/data/draft-order";
import { POS_COLORS } from "@/lib/utils";
import {
  Search,
  X,
  ArrowUpDown,
  Star,
  Send,
  Save,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import type { Prospect, DraftSlot } from "@/types";

export default function DraftPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const leagueId = searchParams.get("leagueId");
  const leagueName = searchParams.get("leagueName");
  const leagueRounds = parseInt(searchParams.get("rounds") || "1", 10) as 1 | 2;

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
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const totalRounds = leagueRounds || 1;

  // Build a trade lookup map to swap team logos when trades are predicted
  const tradeMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of trades) {
      map.set(t.from, t.to);
      map.set(t.to, t.from);
    }
    return map;
  }, [trades]);

  // Apply trade swaps to get the effective slot info (team logo swaps)
  const getEffectiveSlot = useCallback(
    (slot: DraftSlot): DraftSlot => {
      const swappedTeam = tradeMap.get(slot.team);
      if (!swappedTeam) return slot;
      // Find the other slot that has the swapped team to get its logo info
      const allRoundSlots = Object.values(DRAFT_ORDER_2026).flat();
      const otherSlot = allRoundSlots.find((s) => s.team === swappedTeam);
      if (!otherSlot) return slot;
      return {
        ...slot,
        team: otherSlot.team,
        abbr: otherSlot.abbr,
        color: otherSlot.color,
      };
    },
    [tradeMap]
  );

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

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    // Simulate save delay (replace with real Firestore call when auth is wired)
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSubmit = async () => {
    if (filled < total) return;
    setSubmitting(true);
    // Simulate submit delay (replace with real Firestore call when auth is wired)
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    if (leagueId) {
      router.push("/leagues");
    }
  };

  return (
    <div className="px-4">
      {/* Header */}
      {leagueId && (
        <button
          onClick={() => router.push("/leagues")}
          className="flex items-center gap-1.5 font-mono text-xs text-[var(--muted)] mb-2 hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} /> Back to Leagues
        </button>
      )}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="font-display text-xl font-bold tracking-wide">
            MOCK DRAFT
          </h1>
          {leagueName && (
            <p className="font-mono text-[11px] text-accent mt-0.5">
              {leagueName}
            </p>
          )}
        </div>
        <div>
          <span className="font-mono text-sm text-accent">{filled}/{total}</span>
          <span className="font-mono text-sm text-[var(--muted)] ml-1">picks</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 rounded-full bg-[var(--surface)] mb-4 overflow-hidden mt-3">
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
                <div className="flex items-center gap-2.5">
                  {(() => {
                    const rawSlot = allSlots.find((s) => s.pick === activePick);
                    const slot = rawSlot ? getEffectiveSlot(rawSlot) : null;
                    return slot ? (
                      <TeamLogo abbr={slot.abbr} color={slot.color} size={38} />
                    ) : null;
                  })()}
                  <div>
                    <p className="font-mono text-[11px] text-accent tracking-[2px]">
                      PICK #{activePick}
                    </p>
                    <p className="font-display text-base font-bold mt-1">
                      {(() => {
                        const rawSlot = allSlots.find((s) => s.pick === activePick);
                        return rawSlot ? getEffectiveSlot(rawSlot).team : "";
                      })()}
                    </p>
                  </div>
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
      {currentSlots.map((rawSlot) => {
        const slot = getEffectiveSlot(rawSlot);
        const player = picks[rawSlot.pick];
        return (
          <div
            key={rawSlot.pick}
            onClick={() => setActivePick(rawSlot.pick)}
            className="flex items-center gap-2.5 px-3 py-2.5 mb-1.5 rounded-xl cursor-pointer transition-colors active:bg-[var(--surface)]"
            style={{
              background: player ? "var(--card)" : "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <PickBadge pick={rawSlot.pick} filled={!!player} />
            {player ? (
              <PlayerAvatar name={player.name} pos={player.pos} size={34} />
            ) : (
              <TeamLogo abbr={slot.abbr} color={slot.color} size={34} />
            )}
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
                    Select player&hellip;
                  </div>
                  <div className="font-mono text-[11px] text-[var(--muted)]">
                    {slot.team}
                    {rawSlot.note ? ` (${rawSlot.note})` : ""}
                  </div>
                </>
              )}
            </div>
            {player && <PosBadge pos={player.pos} />}
            {showConf && player && (
              <select
                onClick={(e) => e.stopPropagation()}
                value={confidence[rawSlot.pick] || ""}
                onChange={(e) =>
                  setConfidence((p) => ({
                    ...p,
                    [rawSlot.pick]: parseInt(e.target.value),
                  }))
                }
                className="bg-[var(--surface)] border border-[var(--border)] rounded-md px-1.5 py-1 font-mono text-xs font-bold w-[52px]"
                style={{
                  color: confidence[rawSlot.pick]
                    ? "var(--accent)"
                    : "var(--muted)",
                }}
              >
                <option value="">-</option>
                {Array.from({ length: total }, (_, i) => i + 1)
                  .filter((n) => !usedConf.has(n) || n === confidence[rawSlot.pick])
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

      {/* Save & Submit */}
      <div className="sticky bottom-20 pt-3 space-y-2">
        {/* Save button - always visible when there are picks */}
        {filled > 0 && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-display font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors hover:border-accent/30"
            style={{
              opacity: saving ? 0.6 : 1,
              background: saveSuccess ? "#00e87b22" : undefined,
              borderColor: saveSuccess ? "#00e87b44" : undefined,
            }}
          >
            <Save size={16} />
            {saving ? "SAVING..." : saveSuccess ? "SAVED ✓" : "SAVE PROGRESS"}
          </button>
        )}
        {/* Submit button - visible when all picks are filled */}
        {filled === total && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-accent text-black font-display font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,232,123,0.2)]"
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            <Send size={16} />
            {submitting
              ? "SUBMITTING..."
              : leagueId
                ? "SUBMIT TO LEAGUE"
                : "SUBMIT MOCK DRAFT"}
          </button>
        )}
      </div>
    </div>
  );
}
