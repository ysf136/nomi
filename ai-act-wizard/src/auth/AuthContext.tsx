// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";

type UserRecord = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type AuthCtx = {
  user: UserRecord | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  login: async () => false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [init, setInit] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName ?? fbUser.email,
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
    // onAuthStateChanged setzt dann user
    return true;
  };

  const logout = async () => {
    await signOut(auth);
    // onAuthStateChanged setzt user auf null
  };

  // Optional: ein einfacher Splash, bis Firebase init fertig
  if (init) return <div style={{ padding: 24 }}>Lade…</div>;

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
