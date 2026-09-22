import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { isFirestoreConfigured, firebaseConfig } from "./auditStorage";

function getAuthInstance() {
  if (!isFirestoreConfigured) {
    return null;
  }

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return getAuth(app);
}

export function subscribeToAdminAuth(callback: (user: User | null) => void) {
  const auth = getAuthInstance();

  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

export async function signInAdmin(email: string, password: string) {
  const auth = getAuthInstance();

  if (!auth) {
    throw new Error("Firebase is not configured in this environment.");
  }

  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutAdmin() {
  const auth = getAuthInstance();

  if (!auth) {
    return;
  }

  await signOut(auth);
}
