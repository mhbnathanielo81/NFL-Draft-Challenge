import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { League, MockDraft, MockPick, TradePrediction, ChatMessage } from "@/types";

// ─── League Operations ───────────────────────────────────────────────────

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createLeague(
  name: string,
  ownerId: string,
  rounds: 1 | 2
): Promise<League> {
  const leagueRef = doc(collection(db, "leagues"));
  const code = generateCode();

  const league: Omit<League, "id"> = {
    name,
    code,
    ownerId,
    members: [ownerId],
    maxMembers: 20,
    rounds,
    createdAt: new Date(),
    draftYear: 2026,
    isLocked: false,
  };

  await setDoc(leagueRef, {
    ...league,
    createdAt: serverTimestamp(),
  });

  return { ...league, id: leagueRef.id };
}

export async function joinLeague(code: string, userId: string): Promise<League | null> {
  const q = query(collection(db, "leagues"), where("code", "==", code));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const leagueDoc = snap.docs[0];
  const data = leagueDoc.data();

  if (data.members.length >= data.maxMembers) {
    throw new Error("League is full (max 20 members)");
  }

  if (data.members.includes(userId)) {
    throw new Error("Already a member of this league");
  }

  await updateDoc(leagueDoc.ref, {
    members: arrayUnion(userId),
  });

  return { ...data, id: leagueDoc.id, members: [...data.members, userId] } as League;
}

export async function getUserLeagues(userId: string): Promise<League[]> {
  const q = query(
    collection(db, "leagues"),
    where("members", "array-contains", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as League));
}

export function subscribeToLeague(leagueId: string, callback: (league: League) => void): Unsubscribe {
  return onSnapshot(doc(db, "leagues", leagueId), (snap) => {
    if (snap.exists()) {
      callback({ ...snap.data(), id: snap.id } as League);
    }
  });
}

// ─── Mock Draft Operations ───────────────────────────────────────────────

export async function saveMockDraft(draft: MockDraft): Promise<void> {
  const ref = doc(db, "mockDrafts", draft.id);
  await setDoc(ref, {
    ...draft,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getMockDraft(userId: string, leagueId: string): Promise<MockDraft | null> {
  const q = query(
    collection(db, "mockDrafts"),
    where("userId", "==", userId),
    where("leagueId", "==", leagueId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { ...snap.docs[0].data(), id: snap.docs[0].id } as MockDraft;
}

export async function submitMockDraft(draftId: string): Promise<void> {
  await updateDoc(doc(db, "mockDrafts", draftId), {
    isSubmitted: true,
    submittedAt: serverTimestamp(),
  });
}

// ─── Leaderboard (realtime) ──────────────────────────────────────────────

export function subscribeToLeaderboard(
  leagueId: string,
  callback: (drafts: MockDraft[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "mockDrafts"),
    where("leagueId", "==", leagueId),
    where("isSubmitted", "==", true),
    orderBy("totalScore", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id } as MockDraft)));
  });
}

// ─── Live Draft Results ──────────────────────────────────────────────────

export function subscribeToDraftResults(
  callback: (results: any[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "draftResults"),
    orderBy("pick", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
  });
}

// ─── Chat Messages ───────────────────────────────────────────────────────

export async function sendChatMessage(
  leagueId: string,
  userId: string,
  userName: string,
  message: string
): Promise<void> {
  const ref = doc(collection(db, "leagues", leagueId, "chat"));
  await setDoc(ref, {
    userId,
    userName,
    message,
    type: "user",
    timestamp: serverTimestamp(),
  });
}

export function subscribeToChatMessages(
  leagueId: string,
  callback: (messages: ChatMessage[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "leagues", leagueId, "chat"),
    orderBy("timestamp", "asc"),
    limit(100)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id } as ChatMessage)));
  });
}
