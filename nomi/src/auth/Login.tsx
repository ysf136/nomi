// src/routes/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("kunde1@nova.com");
  const [password, setPassword] = useState("NOVA");
  const [error, setError] = useState<string | null>(null);

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
    <main style={{ maxWidth: 420, margin: "3rem auto", padding: "0 1rem" }}>
      <div className="nova-glass-static" style={{ padding: 32, borderRadius: 16 }}>
        <h1 style={{ marginBottom: 12, fontSize: "1.6rem", fontWeight: 700, color: "var(--nova-text)" }}>Login</h1>
        <form onSubmit={onSubmit}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "var(--nova-text)" }}>Benutzername</label>
          <input className="nova-input" style={{ marginBottom: 12 }}
                 value={username} onChange={(e) => setUsername(e.target.value)} />
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "var(--nova-text)" }}>Passwort</label>
          <input className="nova-input" style={{ marginBottom: 12 }} type="password"
                 value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div style={{ color: "var(--nova-error)", marginBottom: 8, fontSize: 14 }}>{error}</div>}
          <button className="nova-btn nova-btn-primary" style={{ width: "100%" }} type="submit">Einloggen</button>
        </form>

        <div className="nova-divider" style={{ margin: "16px 0" }} />

        <div style={{ fontSize: 13, color: "var(--nova-text-muted)" }}>
          <b>Schnelltest:</b> <code style={{ background: "rgba(0,0,0,0.06)", padding: "2px 6px", borderRadius: 4 }}>kunde1</code> / <code style={{ background: "rgba(0,0,0,0.06)", padding: "2px 6px", borderRadius: 4 }}>passwort1</code>
        </div>
      </div>
    </main>
  );
}
