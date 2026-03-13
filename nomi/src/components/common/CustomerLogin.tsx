// src/components/CustomerLogin.tsx
import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CustomerLogin() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("kunde1@nova.com");
  const [password, setPassword] = useState("NOVA123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      nav("/welcome");
    } catch (e: any) {
      setErr(e?.message ?? "Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "6px 10px", border: "1px solid #e0e4ea", borderRadius: 8 }}
        required
      />
      <input
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "6px 10px", border: "1px solid #e0e4ea", borderRadius: 8 }}
        required
      />
      <button
        type="submit"
        disabled={loading}
        style={{ padding: "6px 12px", borderRadius: 8 }}
      >
        {loading ? "Wird gesendet..." : "Kunden-Login"}
      </button>
      {err && <span style={{ color: "#b91c1c", marginLeft: 8 }}>{err}</span>}
    </form>
  );
}
