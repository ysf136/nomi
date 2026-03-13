import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { tokens } from "./styles/tokens";

function firebaseLoginError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    case "auth/user-disabled":
      return "Dieses Konto wurde deaktiviert.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-Mail oder Passwort ist falsch.";
    case "auth/too-many-requests":
      return "Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.";
    default:
      return "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.";
  }
}

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const primaryButtonStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    marginBottom: 12,
    borderRadius: 999,
    minHeight: 37,
    padding: "9px 14px",
    boxSizing: "border-box",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.01em",
    background: "linear-gradient(135deg, #3FB292, #2d9d7f)",
    boxShadow: "0 10px 22px rgba(63,178,146,0.26)",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    minHeight: 37,
    padding: "9px 14px",
    boxSizing: "border-box",
    borderRadius: 999,
    border: `1.5px solid ${tokens.colors.brand.primary}`,
    background: "rgba(255,255,255,0.76)",
    color: tokens.colors.brand.primary,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.01em",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.65 : 1,
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    boxShadow: "0 6px 16px rgba(63,178,146,0.12)",
    backdropFilter: "blur(6px)",
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        setEmailNotVerified(true);
      }
      setSuccess("Login erfolgreich!");
      nav("/welcome");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      setError(firebaseLoginError(code));
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Bitte geben Sie Ihre E-Mail-Adresse ein.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess("Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet.");
      setResetMode(false);
    } catch {
      // Aus Sicherheitsgründen keine Unterscheidung ob E-Mail existiert
      setSuccess("Falls ein Konto mit dieser E-Mail existiert, erhalten Sie eine E-Mail zum Zurücksetzen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--nova-bg-gradient)",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 462,
          ...tokens.glass.card,
          borderRadius: 20,
          padding: "2.75rem 2.2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle glow orb */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${tokens.colors.brand.primary}25, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <h1 style={{ fontSize: 26, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 4, letterSpacing: "-0.02em" }}>
          {resetMode ? "Passwort zurücksetzen" : "Willkommen"}
        </h1>
        <p style={{ color: tokens.colors.neutral[500], fontSize: 14, marginBottom: 24 }}>
          {resetMode
            ? "Geben Sie Ihre E-Mail ein, um einen Reset-Link zu erhalten."
            : "Melden Sie sich bei NOVA an"}
        </p>

        <form onSubmit={resetMode ? handlePasswordReset : handleLogin}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: tokens.colors.neutral[600], marginBottom: 6 }}>
            E-Mail
          </label>
          <input
            className="nova-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: 16 }}
          />

          {!resetMode && (
            <>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: tokens.colors.neutral[600], marginBottom: 6 }}>
                Passwort
              </label>
              <input
                className="nova-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ marginBottom: 8 }}
              />
              <div style={{ textAlign: "right", marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => { setResetMode(true); setError(null); setSuccess(null); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: tokens.colors.brand.primary,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "inherit",
                  }}
                >
                  Passwort vergessen?
                </button>
              </div>
            </>
          )}

          {error && (
            <div style={{ color: tokens.colors.status.error, fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "rgba(239,68,68,0.06)", borderRadius: 8 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ color: tokens.colors.status.success, fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "rgba(16,185,129,0.06)", borderRadius: 8 }}>
              {success}
            </div>
          )}
          {emailNotVerified && (
            <div style={{ color: "#D97706", fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "rgba(217,119,6,0.06)", borderRadius: 8 }}>
              Ihre E-Mail-Adresse wurde noch nicht bestätigt. Bitte prüfen Sie Ihren Posteingang.
            </div>
          )}

          <button
            className="nova-btn nova-btn-primary"
            type="submit"
            disabled={loading}
            style={primaryButtonStyle}
          >
            {loading
              ? "Wird gesendet…"
              : resetMode
                ? "Reset-Link senden"
                : "Einloggen"}
          </button>
        </form>

        {resetMode && (
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button
              type="button"
              onClick={() => { setResetMode(false); setError(null); setSuccess(null); }}
              style={{
                background: "none",
                border: "none",
                color: tokens.colors.brand.primary,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Zurück zum Login
            </button>
          </div>
        )}

        {!resetMode && (
          <>
            <div className="nova-divider" style={{ margin: "16px 0" }} />

            <button
              className="nova-btn"
              onClick={() => nav("/register")}
              disabled={loading}
              style={secondaryButtonStyle}
            >
              Registrieren
            </button>
          </>
        )}
      </div>
    </main>
  );
}
