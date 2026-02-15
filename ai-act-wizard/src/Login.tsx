import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Login erfolgreich!");
      nav("/welcome"); // nach erfolgreichem Login direkt zur WelcomePage
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: userCred.user.email,
        createdAt: new Date(),
      });
      setSuccess("Registrierung erfolgreich! Bitte jetzt einloggen.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="container content"
      style={{ maxWidth: 420, margin: "3rem auto" }}
    >
      <div className="card" style={{ padding: 24 }}>
        <h1 className="title" style={{ marginBottom: 12 }}>Login</h1>
        <form onSubmit={handleLogin}>
          <label className="block text-sm">E-Mail</label>
          <input
            className="w-full border rounded px-3 py-2 mb-3"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="block text-sm">Passwort</label>
          <input
            className="w-full border rounded px-3 py-2 mb-3"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>}
          {success && <div style={{ color: "#15803d", marginBottom: 8 }}>{success}</div>}
          <button
            className="button"
            style={{ padding: "10px 16px", width: "100%" }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Wird gesendet..." : "Einloggen"}
          </button>
        </form>
        <hr style={{ margin: "16px 0" }} />
        <button
          className="button secondary"
          onClick={handleRegister}
          style={{ padding: "8px 12px", width: "100%" }}
          disabled={loading}
        >
          {loading ? "Bitte warten..." : "Registrieren"}
        </button>
      </div>
    </main>
  );
}
