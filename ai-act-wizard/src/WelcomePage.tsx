// src/routes/WelcomePage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

// Tooltip/Infobox-Komponente
function InfoTooltip({ text }: { text: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "help",
        borderBottom: "1px dotted #3FB292",
        marginLeft: "4px",
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span style={{ fontSize: "14px", color: "#3FB292", fontWeight: "bold" }}>?</span>
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "125%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#183939",
            color: "white",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: "12px",
            fontWeight: 400,
            whiteSpace: "nowrap",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            pointerEvents: "none",
          }}
        >
          {text}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #183939",
            }}
          />
        </div>
      )}
    </span>
  );
}

export default function WelcomePage() {
  const { user } = useAuth();
  const NOVA_GREEN = "#3FB292";
  const NOVA_DARK = "#183939";

  // Mock-Daten: Kundenstatus
  const statusData = {
    datenschutzMassnahmen: 65, // Prozent
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
    {
      order: 1,
      action: "Datenschutzbeauftragter konsultieren",
      description: "Für die fehlende DSFA-Dokumentation",
      time: "~30 min",
      link: "/Gespraech-vereinbaren",
    },
    {
      order: 2,
      action: "Schulungsmodul starten",
      description: "Datenschutz für Mitarbeiter (Compliance)",
      time: "~45 min",
      link: "/schulungen",
    },
    {
      order: 3,
      action: "Neue Risikoanalyse",
      description: "Für ein weiteres kritisches Projekt",
      time: "~1-2 Stunden",
      link: "/risikoanalysen",
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      {/* Hero Section */}
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ margin: "0 0 0.5rem", fontSize: "2.2rem", color: NOVA_DARK }}>
          Willkommen{user?.displayName ? `, ${user.displayName}` : ""}! 👋
        </h1>
        <p style={{ margin: 0, fontSize: "16px", color: "#666", marginBottom: "1.5rem" }}>
          Hier siehst du deinen aktuellen Datenschutz-Status, was fehlt und was du als Nächstes tun solltest.
        </p>

        {/* Prominente CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <Link
            to="/vorfall-melden"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 24px",
              background: "linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(255, 107, 107, 0.3)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(255, 107, 107, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 107, 107, 0.3)";
            }}
          >
            <span style={{ fontSize: "18px" }}>🚨</span>
            Datenschutzvorfall melden
          </Link>

          <Link
            to="/avv-check"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 24px",
              background: "linear-gradient(135deg, #3FB292 0%, #2d9d7f 100%)",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(63, 178, 146, 0.3)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(63, 178, 146, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(63, 178, 146, 0.3)";
            }}
          >
            <span style={{ fontSize: "18px" }}>📄</span>
            AV-Vertrag prüfen
          </Link>
        </div>
      </header>

      {/* Status-Übersicht */}
      <section
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #f0f7f5 100%)",
          borderRadius: 16,
          padding: "2rem",
          marginBottom: "2rem",
          border: "1px solid #e0e4ea",
        }}
      >
        <h2 style={{ margin: "0 0 1.5rem", fontSize: "18px", color: NOVA_DARK }}>📊 Dein Datenschutz-Status</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          {/* Fortschrittsbalken */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: 600, fontSize: "15px" }}>Datenschutz-Maßnahmen</span>
              <span style={{ fontSize: "14px", color: "#3FB292", fontWeight: 600 }}>{statusData.datenschutzMassnahmen}%</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "#e0e4ea", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${statusData.datenschutzMassnahmen}%`,
                  background: `linear-gradient(90deg, #3FB292, #2d9d7f)`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ background: "white", padding: "1rem", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 700, color: NOVA_GREEN }}>{statusData.vorfallMeldungen}</div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
              Vorfälle dokumentiert <InfoTooltip text="DSGVO Art. 33 Meldungen" />
            </div>
          </div>

          <div style={{ background: "white", padding: "1rem", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 700, color: NOVA_GREEN }}>{statusData.risikoAnalysen}</div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
              Risikoanalysen <InfoTooltip text="DSFAs (Datenschutz-Folgenabschätzungen)" />
            </div>
          </div>

          <div style={{ background: "white", padding: "1rem", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: "14px", color: "#666" }}>{statusData.letzterCheckup}</div>
            <div style={{ fontSize: "13px", color: "#999", marginTop: "4px" }}>Letzter Compliance-Check</div>
          </div>
        </div>
      </section>

      {/* Lückenanalyse */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "18px", color: NOVA_DARK }}>⚠️ Das fehlt dir noch</h2>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {gaps.map((gap, idx) => (
            <div
              key={idx}
              style={{
                background: "white",
                padding: "1rem 1.5rem",
                borderRadius: 12,
                border: `2px solid ${gap.priority === "hoch" ? "#ff6b6b" : "#ffa940"}`,
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span style={{ fontSize: "20px" }}>{gap.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "15px", color: NOVA_DARK }}>{gap.title}</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: gap.priority === "hoch" ? "#ff6b6b" : "#ffa940",
                    fontWeight: 600,
                    marginTop: "2px",
                  }}
                >
                  {gap.priority === "hoch" ? "🔴 Höchste Priorität" : "🟡 Mittlere Priorität"}
                </div>
              </div>
            </div>
          ))}

          {/* Profil vervollständigen Button */}
          <Link
            to="/customer-profile"
            style={{
              background: "linear-gradient(135deg, #3FB292 0%, #2d9d7f 100%)",
              color: "white",
              padding: "1.25rem 1.5rem",
              borderRadius: 12,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              fontWeight: 600,
              fontSize: "15px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 16px rgba(63, 178, 146, 0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: "20px" }}>👤</span>
            <div>
              <div>Profil vervollständigen</div>
              <div style={{ fontSize: "12px", fontWeight: 400, marginTop: "2px", opacity: 0.9 }}>
                Unternehmensdetails & Datenschutzkontakte
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Empfohlene Aktionen */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ margin: "0 0 1.5rem", fontSize: "18px", color: NOVA_DARK }}>✅ Das solltest du jetzt tun</h2>
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {nextSteps.map((step, idx) => (
            <Link
              key={idx}
              to={step.link}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: 12,
                border: "2px solid #e0e4ea",
                textDecoration: "none",
                color: NOVA_DARK,
                display: "grid",
                gridTemplateColumns: "60px 1fr auto",
                gap: "1.5rem",
                alignItems: "center",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = NOVA_GREEN;
                e.currentTarget.style.boxShadow = `0 4px 12px rgba(63, 178, 146, 0.1)`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e0e4ea";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Nummern-Badge */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: `linear-gradient(135deg, ${NOVA_GREEN}, #2d9d7f)`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "24px",
                  fontWeight: 700,
                }}
              >
                {step.order}
              </div>

              {/* Inhalt */}
              <div>
                <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "4px" }}>{step.action}</div>
                <div style={{ fontSize: "14px", color: "#666" }}>{step.description}</div>
              </div>

              {/* Zeit-Badge */}
              <div
                style={{
                  background: "#f0f7f5",
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: NOVA_GREEN,
                  whiteSpace: "nowrap",
                }}
              >
                {step.time}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Schnellzugriffe */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "16px", color: NOVA_DARK }}>🚀 Schnellzugriffe</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          <QuickLink to="/dashboard" emoji="📈" title="Dashboard" subtitle="Alle KPIs auf einen Blick" />
          <QuickLink to="/projekte" emoji="📁" title="Projekte" subtitle="Verwalten & Überwachen" />
          <QuickLink to="/risikoanalysen" emoji="🔍" title="Analysen" subtitle="Neue DSFA starten" />
          <QuickLink to="/ai-act" emoji="🤖" title="AI-Act Wizard" subtitle="Assessment durchführen" />
        </div>
      </section>
    </div>
  );
}

function QuickLink({ to, emoji, title, subtitle }: { to: string; emoji: string; title: string; subtitle: string }) {
  return (
    <Link
      to={to}
      style={{
        padding: "1.25rem",
        background: "white",
        border: "1px solid #e0e4ea",
        borderRadius: 12,
        textDecoration: "none",
        color: "#183939",
        transition: "all 0.2s ease",
        textAlign: "center",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: "28px", marginBottom: "0.5rem" }}>{emoji}</div>
      <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{title}</div>
      <div style={{ fontSize: "12px", color: "#666" }}>{subtitle}</div>
    </Link>
  );
}
