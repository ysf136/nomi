// src/routes/WelcomePage.tsx
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { usePlanAccess } from "./hooks/usePlanAccess";
import { tokens } from "./styles/tokens";
import GlassCard from "./components/ui/GlassCard";
import { Reveal, StaggerReveal } from "./hooks/useScrollReveal";

// Tooltip using CSS data-tooltip from nova design system
function InfoTooltip({ text }: { text: string }) {
  return (
    <span data-tooltip={text} style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: 4 }}>
      ?
    </span>
  );
}

export default function WelcomePage() {
  const { user } = useAuth();
  const { isDemo, plan } = usePlanAccess();

  // Demo-User sofort zur Live-Demo weiterleiten
  if (isDemo) return <Navigate to="/live-demo" replace />;

  const statusData = {
    datenschutzMassnahmen: 65,
    vorfallMeldungen: 8,
    risikoAnalysen: 3,
    letzterCheckup: "vor 14 Tagen",
  };

  const gaps = [
    { title: "DSFA-Dokumentation", priority: "hoch", icon: "⚠️" },
    { title: "Mitarbeiter-Schulungen", priority: "mittel", icon: "📋" },
    { title: "Processor-Verträge", priority: "mittel", icon: "📄" },
  ];

  const nextSteps = [
    { order: 1, action: "Datenschutzbeauftragter konsultieren", description: "Für die fehlende DSFA-Dokumentation", time: "~30 min", link: "/Gespraech-vereinbaren" },
    { order: 2, action: "Schulungsmodul starten", description: "Datenschutz für Mitarbeiter (Compliance)", time: "~45 min", link: "/schulungen" },
    { order: 3, action: "Neue Risikoanalyse", description: "Für ein weiteres kritisches Projekt", time: "~1-2 Stunden", link: "/risikoanalysen" },
  ];

  return (
    <div className="nova-container" style={{ padding: "2rem 1.5rem" }}>
      {/* Hero Section */}
      <Reveal variant="up">
        <header style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ margin: "0 0 0.5rem", fontSize: "2rem", color: tokens.colors.neutral[900], fontWeight: 700, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            Willkommen{user?.displayName ? `, ${user.displayName}` : ""}! 👋
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 999,
              background: plan === "enterprise"
                ? "linear-gradient(135deg, #6366F1, #4F46E5)"
                : "linear-gradient(135deg, #3FB292, #2d9d7f)",
              color: "#fff",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              {plan}
            </span>
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: tokens.colors.neutral[500], marginBottom: "1.5rem" }}>
            Hier siehst du deinen aktuellen Datenschutz-Status, was fehlt und was du als Nächstes tun solltest.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
            <Link to="/vorfall-melden" className="nova-btn nova-btn-danger" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span>🚨</span> Datenschutzvorfall melden
            </Link>
            <Link to="/avv-check" className="nova-btn nova-btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span>📄</span> AV-Vertrag prüfen
            </Link>
          </div>
        </header>
      </Reveal>

      {/* Status-Übersicht */}
      <Reveal variant="up" delay={0.05}>
        <GlassCard padding="lg" style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 1.5rem", fontSize: 18, fontWeight: 600, color: tokens.colors.neutral[800] }}>📊 Dein Datenschutz-Status</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {/* Progress bar */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: tokens.colors.neutral[700] }}>Datenschutz-Maßnahmen</span>
                <span style={{ fontSize: 14, color: tokens.colors.brand.primary, fontWeight: 600 }}>{statusData.datenschutzMassnahmen}%</span>
              </div>
              <div style={{ width: "100%", height: 8, background: tokens.colors.neutral[200], borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${statusData.datenschutzMassnahmen}%`, background: `linear-gradient(90deg, ${tokens.colors.brand.primary}, ${tokens.colors.brand.secondary})`, transition: "width 0.6s ease", borderRadius: 4 }} />
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(6px)", padding: "1rem", borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.brand.primary }}>{statusData.vorfallMeldungen}</div>
              <div style={{ fontSize: 13, color: tokens.colors.neutral[500], marginTop: 4 }}>
                Vorfälle dokumentiert <InfoTooltip text="DSGVO Art. 33 Meldungen" />
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(6px)", padding: "1rem", borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.brand.primary }}>{statusData.risikoAnalysen}</div>
              <div style={{ fontSize: 13, color: tokens.colors.neutral[500], marginTop: 4 }}>
                Risikoanalysen <InfoTooltip text="DSFAs (Datenschutz-Folgenabschätzungen)" />
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(6px)", padding: "1rem", borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: 14, color: tokens.colors.neutral[600] }}>{statusData.letzterCheckup}</div>
              <div style={{ fontSize: 13, color: tokens.colors.neutral[400], marginTop: 4 }}>Letzter Compliance-Check</div>
            </div>
          </div>
        </GlassCard>
      </Reveal>

      {/* Lückenanalyse */}
      <Reveal variant="up" delay={0.1}>
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: 18, fontWeight: 600, color: tokens.colors.neutral[800] }}>⚠️ Das fehlt dir noch</h2>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {gaps.map((gap, idx) => (
              <GlassCard key={idx} flat padding="md" style={{ display: "flex", alignItems: "center", gap: "1rem", borderLeft: `3px solid ${gap.priority === "hoch" ? tokens.colors.status.error : tokens.colors.status.warning}` }}>
                <span style={{ fontSize: 20 }}>{gap.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: tokens.colors.neutral[800] }}>{gap.title}</div>
                  <div style={{ fontSize: 12, color: gap.priority === "hoch" ? tokens.colors.status.error : tokens.colors.status.warning, fontWeight: 600, marginTop: 2 }}>
                    {gap.priority === "hoch" ? "🔴 Höchste Priorität" : "🟡 Mittlere Priorität"}
                  </div>
                </div>
              </GlassCard>
            ))}

            <Link to="/customer-profile" className="nova-btn nova-btn-primary" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem 1.5rem", width: "100%" }}>
              <span style={{ fontSize: 20 }}>👤</span>
              <div style={{ textAlign: "left" }}>
                <div>Profil vervollständigen</div>
                <div style={{ fontSize: 12, fontWeight: 400, marginTop: 2, opacity: 0.9 }}>Unternehmensdetails & Datenschutzkontakte</div>
              </div>
            </Link>
          </div>
        </section>
      </Reveal>

      {/* Empfohlene Aktionen */}
      <Reveal variant="up" delay={0.15}>
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 1.5rem", fontSize: 18, fontWeight: 600, color: tokens.colors.neutral[800] }}>✅ Das solltest du jetzt tun</h2>
          <StaggerReveal style={{ display: "grid", gap: "1rem" }}>
            {nextSteps.map((step, idx) => (
              <Link key={idx} to={step.link} style={{ textDecoration: "none", color: "inherit" }}>
                <GlassCard padding="md" style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: "1.5rem", alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${tokens.colors.brand.primary}, ${tokens.colors.brand.secondary})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 22, fontWeight: 700, boxShadow: `0 4px 12px ${tokens.colors.brand.primary}30` }}>
                    {step.order}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: tokens.colors.neutral[800] }}>{step.action}</div>
                    <div style={{ fontSize: 14, color: tokens.colors.neutral[500] }}>{step.description}</div>
                  </div>
                  <span className="nova-badge nova-badge-success" style={{ whiteSpace: "nowrap" }}>{step.time}</span>
                </GlassCard>
              </Link>
            ))}
          </StaggerReveal>
        </section>
      </Reveal>

      {/* Schnellzugriffe */}
      <Reveal variant="up" delay={0.2}>
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: 16, fontWeight: 600, color: tokens.colors.neutral[800] }}>🚀 Schnellzugriffe</h2>
          <StaggerReveal style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            <QuickLink to="/dashboard" emoji="📈" title="Dashboard" subtitle="Alle KPIs auf einen Blick" />
            <QuickLink to="/projekte" emoji="📁" title="Projekte" subtitle="Verwalten & Überwachen" />
            <QuickLink to="/risikoanalysen" emoji="🔍" title="Analysen" subtitle="Neue DSFA starten" />
            <QuickLink to="/ai-act" emoji="🤖" title="AI-Act Wizard" subtitle="Assessment durchführen" />
          </StaggerReveal>
        </section>
      </Reveal>
    </div>
  );
}

function QuickLink({ to, emoji, title, subtitle }: { to: string; emoji: string; title: string; subtitle: string }) {
  return (
    <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
      <GlassCard padding="md" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: "0.5rem" }}>{emoji}</div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: tokens.colors.neutral[800] }}>{title}</div>
        <div style={{ fontSize: 12, color: tokens.colors.neutral[500] }}>{subtitle}</div>
      </GlassCard>
    </Link>
  );
}
