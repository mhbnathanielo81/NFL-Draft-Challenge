import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { User } from "@/types";

const googleProvider = new GoogleAuthProvider();

// ─── Create user document in Firestore ───────────────────────────────────
async function createUserDoc(firebaseUser: FirebaseUser, displayName?: string) {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: displayName || firebaseUser.displayName || "Draft Player",
      photoURL: firebaseUser.photoURL || null,
      createdAt: serverTimestamp(),
    });
  }
}

// ─── Email/Password Sign Up ──────────────────────────────────────────────
export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await createUserDoc(credential.user, displayName);
  return credential.user;
}

// ─── Email/Password Sign In ──────────────────────────────────────────────
export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ─── Google Sign In ──────────────────────────────────────────────────────
export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  await createUserDoc(credential.user);
  return credential.user;
}

// ─── Sign Out ────────────────────────────────────────────────────────────
export async function signOut() {
  return firebaseSignOut(auth);
}

// ─── Auth State Observer ─────────────────────────────────────────────────
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
