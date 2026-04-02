// ─── User ────────────────────────────────────────────────────────────────
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
}

// ─── League ──────────────────────────────────────────────────────────────
export interface League {
  id: string;
  name: string;
  code: string; // 6-char invite code
  ownerId: string;
  members: string[]; // user UIDs
  maxMembers: number; // default 20
  rounds: 1 | 2; // 1 = Round 1 only, 2 = Rounds 1 & 2
  createdAt: Date;
  draftYear: number;
  isLocked: boolean; // locked once draft starts
}

// ─── Prospect ────────────────────────────────────────────────────────────
export type Position =
  | "QB" | "RB" | "WR" | "TE"
  | "OT" | "OG" | "OC" | "OL" | "C"
  | "EDGE" | "DT" | "DL"
  | "LB" | "CB" | "S"
  | "K" | "P";

export interface Prospect {
  id: number;
  name: string;
  pos: Position;
  school: string;
  headshot?: string; // URL to headshot image
}

// ─── Draft Pick (real NFL result) ────────────────────────────────────────
export interface DraftSlot {
  pick: number;
  team: string;
  abbr: string;
  color: string;
  note?: string; // e.g. "from Falcons"
}

export interface DraftResult {
  pick: number;
  team: string;
  playerId: number;
  playerName: string;
  position: Position;
  school: string;
  tradedFrom?: string; // original team if trade happened
  tradedTo?: string;   // team that traded up
  timestamp: Date;
}

// ─── User Mock Draft ─────────────────────────────────────────────────────
export interface MockDraft {
  id: string;
  userId: string;
  leagueId: string;
  picks: Record<number, MockPick>; // pick number -> prediction
  trades: TradePrediction[];
  confidencePoints: Record<number, number>; // pick number -> confidence (1-32 or 1-64)
  submittedAt?: Date;
  isSubmitted: boolean;
  totalScore: number;
}

export interface MockPick {
  pickNumber: number;
  prospectId: number;
  prospectName: string;
  position: Position;
}

export interface TradePrediction {
  id: string;
  teamTradingUp: string;   // team acquiring the higher pick
  teamTradingDown: string;  // team giving up the higher pick
}

// ─── Scoring ─────────────────────────────────────────────────────────────
export interface ScoreBreakdown {
  userId: string;
  leagueId: string;
  pickScores: PickScore[];
  tradeScores: TradeScore[];
  totalPoints: number;
  correctPicks: number;
  correctTrades: number;
}

export interface PickScore {
  pickNumber: number;
  points: number; // 100 for correct pick
  confidenceMultiplier?: number;
  isCorrect: boolean;
}

export interface TradeScore {
  tradeId: string;
  points: number; // 400 for correct trade + both players
  isCorrectTeams: boolean;
  isCorrectPlayers: boolean;
}

// ─── Chat Message ────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  leagueId: string;
  userId: string;
  userName: string;
  message: string;
  type: "user" | "system" | "pick-alert";
  timestamp: Date;
}

// ─── Scoring Rules ───────────────────────────────────────────────────────
export const SCORING_RULES = {
  CORRECT_PICK: 100,        // exact player at exact pick
  CORRECT_TRADE: 400,       // correct trade teams + both players correct
  TRADE_TEAMS_ONLY: 100,    // correct trade teams, wrong players
} as const;
