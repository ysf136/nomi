// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export type PlanId = "demo" | "pro" | "enterprise";
export type RoleId = "user" | "reviewer" | "admin";

type UserRecord = {
  uid: string;
  email: string | null;
  displayName: string | null;
  plan: PlanId | null;
  role: RoleId;
  companyName: string | null;
};

type AuthCtx = {
  user: UserRecord | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  login: async () => false,
  logout: async () => {},
  resetPassword: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [init, setInit] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // Firestore Profil laden (plan, role, companyName)
        let plan: PlanId | null = null;
        let role: RoleId = "user";
        let companyName: string | null = null;
        let displayName = fbUser.displayName ?? fbUser.email;

        try {
          const snap = await getDoc(doc(db, "users", fbUser.uid));
          if (snap.exists()) {
            const data = snap.data();
            plan = (data.plan as PlanId) || null;
            role = (data.role as RoleId) || "user";
            companyName = data.companyName || null;
            if (data.displayName) displayName = data.displayName;
          }
        } catch {
          // Firestore nicht erreichbar → Default-Werte
        }

        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName,
          plan,
          role,
          companyName,
        });
      } else {
        setUser(null);
      }
      setInit(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  if (init) return <div style={{ padding: 24 }}>Lade…</div>;

  return <Ctx.Provider value={{ user, login, logout, resetPassword }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
