import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { tokens } from '../../styles/tokens';

export default function LiveDemo() {

  const [selectedTab, setSelectedTab] = useState<"status" | "gaps" | "actions">("status");

  const statusData = {
    datenschutzMassnahmen: 65,
    vorfallMeldungen: 8,
    risikoAnalysen: 3,
    letzterCheckup: "14 Tage",
  };

  const gaps = [
    { icon: "📋", title: "DSFA für Hochrisiko-Projekt fehlt", priority: "hoch" as const },
    { icon: "🎓", title: "Mitarbeiterschulungen veraltet", priority: "mittel" as const },
    { icon: "📝", title: "Auftragsverarbeiter-Verträge unvollständig", priority: "mittel" as const },
  ];

  const nextSteps = [
    {
      order: 1,
      action: "Datenschutzbeauftragter konsultieren",
      description: "Für die fehlende DSFA-Dokumentation",
      time: "~30 min",
    },
    {
      order: 2,
      action: "Schulungsmodul starten",
      description: "Datenschutz für Mitarbeiter (Compliance)",
      time: "~45 min",
    },
    {
      order: 3,
      action: "Neue Risikoanalyse",
      description: "Für ein weiteres kritisches Projekt",
      time: "~1-2 Stunden",
    },
  ];

  return (
    <motion.div 
      layoutId="dashboard-card"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0 }}
    >
      {/* Header */}
      <motion.header
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0 }}
        className="nova-glass-static"
        style={{
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: `linear-gradient(135deg, ${tokens.colors.brand.primary}, #2d9d7f)`,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: "20px",
            }}
          >
            N
          </div>
          <div>
            <div style={{ fontWeight: 700, color: tokens.colors.neutral[900] }}>NOVA Live Demo</div>
            <div style={{ fontSize: "11px", color: tokens.colors.neutral[400] }}>Interaktive Vorschau</div>
          </div>
        </div>
        <Link
          to="/login"
          className="nova-btn nova-btn-primary"
          style={{ textDecoration: "none" }}
        >
          Jetzt registrieren
        </Link>
      </motion.header>

      {/* Main Content */}
      <motion.div 
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}
      >
        {/* Hero */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0 }}
          className="nova-glass-static"
          style={{ borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}
        >
          <h1 style={{ margin: "0 0 0.5rem", fontSize: "2.2rem", color: tokens.colors.neutral[900] }}>
            Willkommen, Demo-User! 👋
          </h1>
          <p style={{ margin: 0, fontSize: "16px", color: tokens.colors.neutral[500] }}>
            Das ist eine interaktive Vorschau Ihres Datenschutz-Dashboards.
          </p>
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "rgba(63, 178, 146, 0.08)",
              border: `1px solid ${tokens.colors.brand.primary}44`,
              borderRadius: 12,
              fontSize: "14px",
              color: tokens.colors.brand.primary,
            }}
          >
            💡 <strong>Demo-Modus:</strong> Alle Daten sind Beispiele. Nach der Registrierung erhalten Sie
            Zugriff auf Ihr echtes Dashboard mit KI-gestützten Analysen.
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0 }}
          className="nova-glass-static"
          style={{
            borderRadius: 16,
            padding: "1rem",
            marginBottom: "1rem",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          {[
            { id: "status" as const, label: "📊 Status" },
            { id: "gaps" as const, label: "⚠️ Lücken" },
            { id: "actions" as const, label: "✅ Aktionen" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={selectedTab === tab.id ? "nova-btn nova-btn-primary" : "nova-btn nova-btn-ghost"}
              style={{ flex: 1 }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        {selectedTab === "status" && (
          <motion.section
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0 }}
            className="nova-glass-static"
            style={{ borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}
          >
            <h2 style={{ margin: "0 0 1.5rem", fontSize: "18px", color: tokens.colors.neutral[900] }}>
              📊 Dein Datenschutz-Status
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {/* Fortschrittsbalken */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "15px" }}>Datenschutz-Maßnahmen</span>
                  <span style={{ fontSize: "14px", color: tokens.colors.brand.primary, fontWeight: 600 }}>
                    {statusData.datenschutzMassnahmen}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "rgba(0,0,0,0.08)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${statusData.datenschutzMassnahmen}%`,
                      background: `linear-gradient(90deg, ${tokens.colors.brand.primary}, #2d9d7f)`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Stat Cards */}
              <div
                style={{
                  background: "rgba(0,0,0,0.03)",
                  padding: "1rem",
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: 700, color: tokens.colors.brand.primary }}>
                  {statusData.vorfallMeldungen}
                </div>
                <div style={{ fontSize: "13px", color: tokens.colors.neutral[500], marginTop: "4px" }}>
                  Vorfälle dokumentiert <span data-tooltip="DSGVO Art. 33 Meldungen" style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: 4 }}>?</span>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(0,0,0,0.03)",
                  padding: "1rem",
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: 700, color: tokens.colors.brand.primary }}>
                  {statusData.risikoAnalysen}
                </div>
                <div style={{ fontSize: "13px", color: tokens.colors.neutral[500], marginTop: "4px" }}>
                  Risikoanalysen <span data-tooltip="DSFAs (Datenschutz-Folgenabschätzungen)" style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: 4 }}>?</span>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(0,0,0,0.03)",
                  padding: "1rem",
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "14px", color: tokens.colors.neutral[500] }}>{statusData.letzterCheckup}</div>
                <div style={{ fontSize: "13px", color: tokens.colors.neutral[400], marginTop: "4px" }}>
                  Letzter Compliance-Check
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {selectedTab === "gaps" && (
          <motion.section
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0 }}
            className="nova-glass-static"
            style={{ borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}
          >
            <h2 style={{ margin: "0 0 1rem", fontSize: "18px", color: tokens.colors.neutral[900] }}>
              ⚠️ Das fehlt dir noch
            </h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {gaps.map((gap, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(0,0,0,0.03)",
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
                    <div style={{ fontWeight: 600, fontSize: "15px", color: tokens.colors.neutral[900] }}>
                      {gap.title}
                    </div>
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
            </div>
          </motion.section>
        )}

        {selectedTab === "actions" && (
          <motion.section
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0 }}
            className="nova-glass-static"
            style={{ borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}
          >
            <h2 style={{ margin: "0 0 1.5rem", fontSize: "18px", color: tokens.colors.neutral[900] }}>
              ✅ Das solltest du jetzt tun
            </h2>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              {nextSteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(0,0,0,0.03)",
                    padding: "1.5rem",
                    borderRadius: 12,
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: `linear-gradient(135deg, ${tokens.colors.brand.primary}, ${tokens.colors.brand.secondary})`,
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    {step.order}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "16px", color: tokens.colors.neutral[900] }}>
                      {step.action}
                    </div>
                    <div style={{ fontSize: "14px", color: tokens.colors.neutral[500], marginTop: "4px" }}>
                      {step.description}
                    </div>
                    <div style={{ fontSize: "12px", color: tokens.colors.neutral[400], marginTop: "8px" }}>
                      ⏱️ {step.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA Footer */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0 }}
          style={{
            background: `linear-gradient(135deg, ${tokens.colors.brand.primary}, #2d9d7f)`,
            borderRadius: 16,
            padding: "2rem",
            textAlign: "center",
            color: "white",
          }}
        >
          <h2 style={{ margin: "0 0 1rem", fontSize: "24px" }}>Überzeugt? 🚀</h2>
          <p style={{ margin: "0 0 1.5rem", fontSize: "16px", opacity: 0.95 }}>
            Erstellen Sie jetzt Ihr kostenloses Konto und nutzen Sie die volle KI-Power von NOMI für Ihr
            Unternehmen.
          </p>
          <Link
            to="/login"
            className="nova-btn"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "white",
              color: tokens.colors.brand.primary,
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Kostenlos starten →
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
