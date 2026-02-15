// src/routes/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { generateCredentials, addUser } from "../auth/credentials";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("kunde1@nova.com");
  const [password, setPassword] = useState("NOVA");
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<{username: string; password: string} | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const ok = await login(username.trim(), password);
    if (ok) {
      nav("/"); // -> Landing
    } else {
      setError("Login fehlgeschlagen. Bitte prüfen.");
    }
  }

  return (
    <main className="container content" style={{ maxWidth: 420, margin: "3rem auto" }}>
      <div className="card" style={{ padding: 24 }}>
        <h1 className="title" style={{ marginBottom: 12 }}>Login</h1>
        <form onSubmit={onSubmit}>
          <label className="block text-sm">Benutzername</label>
          <input className="w-full border rounded px-3 py-2 mb-3"
                 value={username} onChange={(e) => setUsername(e.target.value)} />
          <label className="block text-sm">Passwort</label>
          <input className="w-full border rounded px-3 py-2 mb-3" type="password"
                 value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>}
          <button className="button" style={{ padding: "10px 16px" }} type="submit">Einloggen</button>
        </form>

        <hr style={{ margin: "16px 0" }} />

        <div className="text-sm" style={{ color: "var(--body)" }}>
          <b>Schnelltest:</b> <code>kunde1</code> / <code>passwort1</code>
        </div>

  {/* Demo-Logik entfernt, da jetzt Firebase Auth verwendet wird */}
      </div>
    </main>
  );
}
