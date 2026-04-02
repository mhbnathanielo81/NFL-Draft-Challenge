"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, FileText } from "lucide-react";

interface LocalLeague {
  id: number;
  name: string;
  code: string;
  members: number;
  maxMembers: number;
  rounds: 1 | 2;
  owner: boolean;
}

export default function LeaguesPage() {
  const router = useRouter();
  const [leagues, setLeagues] = useState<LocalLeague[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [leagueName, setLeagueName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [rounds, setRounds] = useState<1 | 2>(1);

  const createLeague = () => {
    if (!leagueName.trim()) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setLeagues((p) => [
      ...p,
      { id: Date.now(), name: leagueName, code, members: 1, maxMembers: 20, rounds, owner: true },
    ]);
    setLeagueName("");
    setShowCreate(false);
  };

  const joinLeague = () => {
    if (!joinCode.trim()) return;
    setLeagues((p) => [
      ...p,
      { id: Date.now(), name: "Friend's League", code: joinCode, members: 8, maxMembers: 20, rounds: 1, owner: false },
    ]);
    setJoinCode("");
  };

  return (
    <div className="px-4">
      <h1 className="font-display text-xl font-bold tracking-wide mb-4">LEAGUES</h1>

      {/* Join */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 mb-4">
        <p className="font-display font-semibold text-sm mb-2.5">Join with Code</p>
        <div className="flex gap-2">
          <input
            placeholder="Enter league code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm font-display outline-none focus:border-accent/50"
          />
          <button
            onClick={joinLeague}
            className="bg-accent text-black font-display font-semibold px-4 py-2.5 rounded-lg text-sm"
          >
            JOIN
          </button>
        </div>
      </div>

      {/* Create */}
      {!showCreate ? (
        <button
          onClick={() => setShowCreate(true)}
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-3 font-display font-semibold text-sm flex items-center justify-center gap-2 text-[var(--foreground)] mb-5 hover:border-accent/30 transition-colors"
        >
          <Plus size={16} /> Create New League
        </button>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 mb-5">
          <p className="font-display font-semibold text-sm mb-3">New League</p>
          <div className="space-y-3">
            <input
              placeholder="League name"
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm font-display outline-none focus:border-accent/50"
            />
            <div>
              <p className="font-mono text-[11px] text-[var(--muted)] mb-1.5">ROUNDS</p>
              <div className="flex gap-2">
                {([1, 2] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRounds(r)}
                    className="flex-1 py-2.5 rounded-lg font-display font-semibold text-sm transition-colors"
                    style={{
                      background: rounds === r ? "var(--accent)" : "var(--surface)",
                      color: rounds === r ? "#000" : "var(--muted-foreground)",
                    }}
                  >
                    {r === 1 ? "Round 1 Only" : "Rounds 1 & 2"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-display text-[var(--muted-foreground)]"
              >
                Cancel
              </button>
              <button
                onClick={createLeague}
                className="flex-1 bg-accent text-black font-display font-semibold py-2.5 rounded-lg text-sm"
              >
                CREATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* League List */}
      {leagues.map((l) => (
        <div key={l.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 mb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-display font-bold text-base">{l.name}</div>
              <div className="font-mono text-[11px] text-[var(--muted)] mt-1">
                {l.members}/{l.maxMembers} · {l.rounds === 2 ? "2 rounds" : "R1"}
              </div>
            </div>
            {l.owner && (
              <span className="font-mono text-[10px] text-accent bg-accent/20 px-2 py-0.5 rounded font-bold">
                OWNER
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-[var(--surface)] rounded-lg">
            <span className="font-mono text-xs text-[var(--muted)]">Code:</span>
            <span className="font-mono text-sm font-bold text-accent tracking-[2px]">
              {l.code}
            </span>
          </div>
          <button
            onClick={() =>
              router.push(
                `/draft?leagueId=${l.id}&leagueName=${encodeURIComponent(l.name)}&rounds=${l.rounds}`
              )
            }
            className="w-full mt-3 bg-accent text-black font-display font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,232,123,0.15)] hover:shadow-[0_0_30px_rgba(0,232,123,0.25)] transition-shadow"
          >
            <FileText size={16} /> Add Bracket
          </button>
        </div>
      ))}

      {leagues.length === 0 && !showCreate && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 text-center">
          <p className="text-3xl mb-2">🏟️</p>
          <p className="font-display text-[var(--muted-foreground)] text-sm">
            No leagues yet. Create one or join with a code!
          </p>
        </div>
      )}
    </div>
  );
}
