import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { tokens } from "./styles/tokens";

/* ── Plan-Definitionen ─────────────────────────────────────── */
type PlanId = "demo" | "pro" | "enterprise";

interface PlanFeature {
  label: string;
  included: boolean;
}

interface Plan {
  id: PlanId;
  name: string;
  badge?: string;
  price: string;
  priceNote: string;
  description: string;
  icon: string;
  features: PlanFeature[];
  cta: string;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "demo",
    name: "Demo",
    price: "0 €",
    priceNote: "Kostenlos & unverbindlich",
    description: "Lernen Sie NOVA kennen — interaktive Vorschau mit Beispieldaten.",
    icon: "🔍",
    cta: "Demo starten",
    features: [
      { label: "Interaktive Plattform-Vorschau", included: true },
      { label: "Beispiel-Dashboard mit Demo-Daten", included: true },
      { label: "KI-Analyse Demo", included: true },
      { label: "Einblick in alle Module", included: true },
      { label: "Eigene Daten & Projekte", included: false },
      { label: "Vollständige KI-Analysen", included: false },
      { label: "Human in the Loop", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Beliebteste",
    price: "Auf Anfrage",
    priceNote: "Individuelles Angebot",
    description: "Alle Kernfunktionen für professionellen Datenschutz mit KI-Unterstützung.",
    icon: "⚡",
    cta: "Pro wählen",
    highlight: true,
    features: [
      { label: "Dashboard & Berichte", included: true },
      { label: "Vorfall-Meldung & KI-Bewertung", included: true },
      { label: "AI Act Wizard & DSFA", included: true },
      { label: "AV-Prüfung & AVV-Management", included: true },
      { label: "Risikoanalysen & Projekte", included: true },
      { label: "Schulungen & Verarbeitungstätigkeiten", included: true },
      { label: "Eigene Daten & Projekte", included: true },
      { label: "Human in the Loop", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Individuell",
    priceNote: "Maßgeschneidert für Ihr Unternehmen",
    description: "Maximale Kontrolle mit Human-in-the-Loop, Audit-Trail & dediziertem Support.",
    icon: "🏢",
    cta: "Enterprise anfragen",
    features: [
      { label: "Alles aus Pro", included: true },
      { label: "Human in the Loop — Freigaben", included: true },
      { label: "Reviewer-Dashboard & Vier-Augen-Prinzip", included: true },
      { label: "Vollständiger Audit-Trail", included: true },
      { label: "Multi-User & Rollenverwaltung", included: true },
      { label: "Priorisierter Support", included: true },
      { label: "Dedizierter Ansprechpartner", included: true },
    ],
  },
];

/* ── Firebase-Fehlermeldungen (deutsch) ─────────────────────── */
function firebaseErrorMsg(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Diese E-Mail-Adresse wird bereits verwendet.";
    case "auth/invalid-email":
      return "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    case "auth/weak-password":
      return "Das Passwort muss mindestens 6 Zeichen lang sein.";
    case "auth/operation-not-allowed":
      return "Die Registrierung ist derzeit nicht verfügbar.";
    case "auth/too-many-requests":
      return "Zu viele Anfragen. Bitte versuchen Sie es später erneut.";
    default:
      return "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.";
  }
}

/* ── Komponente ─────────────────────────────────────────────── */
export default function Register() {
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  // Form state
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function selectPlan(id: PlanId) {
    setSelectedPlan(id);
    setStep(2);
    setError(null);
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }
    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen haben.");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          email: cred.user.email,
          displayName: name.trim() || cred.user.email,
          companyName: company.trim() || null,
          plan: selectedPlan,
          role: "user",
          createdAt: new Date(),
          notifications: {
            newIncident: true,
            deadlineReminder: true,
            weeklyReport: false,
          },
        },
        { merge: true },
      );
      // E-Mail-Verifizierung senden
      await sendEmailVerification(cred.user);
      nav(selectedPlan === "demo" ? "/live-demo" : "/welcome");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      setError(firebaseErrorMsg(code));
    } finally {
      setLoading(false);
    }
  }

  const planObj = PLANS.find((p) => p.id === selectedPlan);

  /* ── Styles ──────────────────────────────────────────────── */
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: tokens.colors.neutral[600],
    marginBottom: 6,
  };

  const primaryBtn: React.CSSProperties = {
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
    color: "#fff",
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.65 : 1,
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  };

  /* ── STEP 1: Plan-Auswahl ────────────────────────────────── */
  if (step === 1) {
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
        <style>{`
          .nova-plan-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            width: 100%;
          }
          @media (max-width: 900px) {
            .nova-plan-grid {
              grid-template-columns: 1fr;
              max-width: 400px;
              margin: 0 auto;
            }
          }
          .nova-plan-card {
            transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s ease;
          }
          .nova-plan-card:hover {
            transform: translateY(-6px);
          }
        `}</style>

        <div style={{ width: "100%", maxWidth: 1000 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: "linear-gradient(135deg, #183939, #0F2828)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 20,
                  boxShadow: "0 4px 16px rgba(24,57,57,0.3)",
                }}
              >
                N
              </div>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: tokens.colors.neutral[900],
                  letterSpacing: "0.04em",
                }}
              >
                NOVA
              </span>
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: tokens.colors.neutral[900],
                marginBottom: 8,
                letterSpacing: "-0.02em",
              }}
            >
              Wählen Sie Ihren Plan
            </h1>
            <p
              style={{
                color: tokens.colors.neutral[500],
                fontSize: 16,
                maxWidth: 520,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Starten Sie mit NOVA — der KI-gestützten Datenschutz-Plattform
              für DSGVO, AI Act &amp; mehr.
            </p>
          </div>

          {/* Plan Cards */}
          <div className="nova-plan-grid">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="nova-plan-card"
                style={{
                  ...tokens.glass.card,
                  borderRadius: 20,
                  padding: "2rem 1.5rem",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  border: plan.highlight
                    ? "2px solid #3FB292"
                    : "1px solid rgba(255,255,255,0.18)",
                  boxShadow: plan.highlight
                    ? "0 8px 32px rgba(63,178,146,0.18), 0 0 0 1px rgba(63,178,146,0.1)"
                    : tokens.shadows.card,
                }}
              >
                {/* Glow orb */}
                <div
                  style={{
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background: plan.highlight
                      ? "radial-gradient(circle, rgba(63,178,146,0.2), transparent 70%)"
                      : "radial-gradient(circle, rgba(63,178,146,0.08), transparent 70%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Badge */}
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      background: "linear-gradient(135deg, #3FB292, #2d9d7f)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 999,
                      letterSpacing: "0.02em",
                      boxShadow: "0 2px 8px rgba(63,178,146,0.3)",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Icon + Name */}
                <div style={{ fontSize: 32, marginBottom: 8 }}>{plan.icon}</div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: tokens.colors.neutral[900],
                    marginBottom: 4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {plan.name}
                </h2>

                {/* Price */}
                <div style={{ marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: plan.highlight
                        ? tokens.colors.brand.primary
                        : tokens.colors.neutral[800],
                    }}
                  >
                    {plan.price}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: tokens.colors.neutral[400],
                    marginBottom: 4,
                    fontWeight: 500,
                  }}
                >
                  {plan.priceNote}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontSize: 14,
                    color: tokens.colors.neutral[600],
                    lineHeight: 1.5,
                    marginBottom: 20,
                    minHeight: 42,
                  }}
                >
                  {plan.description}
                </p>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)",
                    marginBottom: 20,
                  }}
                />

                {/* Features */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    marginBottom: 24,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontSize: 13,
                        color: f.included
                          ? tokens.colors.neutral[700]
                          : tokens.colors.neutral[400],
                        lineHeight: 1.4,
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          marginTop: 1,
                          background: f.included
                            ? "rgba(63,178,146,0.12)"
                            : "rgba(0,0,0,0.04)",
                          color: f.included
                            ? tokens.colors.brand.primary
                            : tokens.colors.neutral[400],
                        }}
                      >
                        {f.included ? "✓" : "—"}
                      </span>
                      <span style={{ textDecoration: f.included ? "none" : "line-through" }}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className="nova-btn"
                  onClick={() => selectPlan(plan.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    borderRadius: 999,
                    minHeight: 44,
                    padding: "10px 16px",
                    boxSizing: "border-box",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: plan.highlight
                      ? "none"
                      : `1.5px solid ${tokens.colors.brand.primary}`,
                    background: plan.highlight
                      ? "linear-gradient(135deg, #3FB292, #2d9d7f)"
                      : "rgba(255,255,255,0.76)",
                    color: plan.highlight ? "#fff" : tokens.colors.brand.primary,
                    boxShadow: plan.highlight
                      ? "0 10px 22px rgba(63,178,146,0.26)"
                      : "0 4px 12px rgba(63,178,146,0.08)",
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Footer Link */}
          <div
            style={{
              textAlign: "center",
              marginTop: 32,
              fontSize: 14,
              color: tokens.colors.neutral[500],
            }}
          >
            Bereits ein Konto?{" "}
            <Link
              to="/login"
              style={{
                color: tokens.colors.brand.primary,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Einloggen
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── STEP 2: Registrierungsformular ──────────────────────── */
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
          maxWidth: 480,
          ...tokens.glass.card,
          borderRadius: 20,
          padding: "2.5rem 2.2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow orb */}
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

        {/* Back button */}
        <button
          onClick={() => { setStep(1); setError(null); }}
          style={{
            background: "none",
            border: "none",
            color: tokens.colors.neutral[500],
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            padding: "4px 0",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "inherit",
          }}
        >
          ← Zurück zur Planauswahl
        </button>

        {/* Selected plan badge */}
        {planObj && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(63,178,146,0.08)",
              border: "1px solid rgba(63,178,146,0.2)",
              borderRadius: 999,
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 16 }}>{planObj.icon}</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: tokens.colors.brand.primary,
              }}
            >
              {planObj.name}
            </span>
            <span
              style={{
                fontSize: 12,
                color: tokens.colors.neutral[500],
                fontWeight: 500,
              }}
            >
              — {planObj.price}
            </span>
          </div>
        )}

        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: tokens.colors.neutral[900],
            marginBottom: 4,
            letterSpacing: "-0.02em",
          }}
        >
          Konto erstellen
        </h1>
        <p
          style={{
            color: tokens.colors.neutral[500],
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          Registrieren Sie sich, um NOVA zu nutzen.
        </p>

        <form onSubmit={onRegister}>
          <label style={labelStyle}>Firma / Organisation</label>
          <input
            className="nova-input"
            type="text"
            placeholder="Musterfirma GmbH (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{ marginBottom: 14 }}
          />

          <label style={labelStyle}>Vollständiger Name</label>
          <input
            className="nova-input"
            type="text"
            placeholder="Max Mustermann"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginBottom: 14 }}
          />

          <label style={labelStyle}>E-Mail-Adresse</label>
          <input
            className="nova-input"
            type="email"
            placeholder="max@firma.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: 14 }}
          />

          <label style={labelStyle}>Passwort</label>
          <input
            className="nova-input"
            type="password"
            placeholder="Mindestens 8 Zeichen"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: 14 }}
          />

          <label style={labelStyle}>Passwort bestätigen</label>
          <input
            className="nova-input"
            type="password"
            placeholder="Passwort wiederholen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ marginBottom: 20 }}
          />

          {error && (
            <div
              style={{
                color: tokens.colors.status.error,
                fontSize: 13,
                marginBottom: 14,
                padding: "10px 14px",
                background: "rgba(239,68,68,0.06)",
                borderRadius: 10,
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <button
            className="nova-btn nova-btn-primary"
            type="submit"
            disabled={loading}
            style={primaryBtn}
          >
            {loading ? "Konto wird erstellt…" : "Registrieren"}
          </button>
        </form>

        <div className="nova-divider" style={{ margin: "16px 0" }} />

        <div
          style={{
            textAlign: "center",
            fontSize: 13,
            color: tokens.colors.neutral[600],
          }}
        >
          Bereits ein Konto?{" "}
          <Link
            to="/login"
            style={{
              color: tokens.colors.brand.primary,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Einloggen
          </Link>
        </div>
      </div>
    </main>
  );
}
