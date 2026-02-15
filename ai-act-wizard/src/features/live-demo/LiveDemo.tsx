import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function LiveDemo() {
  const NOVA_GREEN = "#3FB292";
  const NOVA_DARK = "#183939";
  const location = useLocation();
  const fromMockup = location.state?.fromMockup;

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

  function InfoTooltip({ text }: { text: string }) {
    const [show, setShow] = useState(false);
    return (
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          position: "relative",
          cursor: "help",
          color: NOVA_GREEN,
          fontWeight: "bold",
          marginLeft: "4px",
        }}
      >
        ?
        {show && (
          <div
            style={{
              position: "absolute",
              top: "-40px",
              left: "-50px",
              background: NOVA_DARK,
              color: "white",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: "12px",
              whiteSpace: "nowrap",
              zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            {text}
          </div>
        )}
      </span>
    );
  }

  return (
    <motion.div 
      layoutId="dashboard-card"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0 }}
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa 0%, #f0f7f5 100%)" }}
    >
      {/* Header */}
      <motion.header
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0 }}
        style={{
          background: "white",
          borderBottom: "1px solid #e0e4ea",
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
              background: `linear-gradient(135deg, ${NOVA_GREEN}, #2d9d7f)`,
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
            <div style={{ fontWeight: 700, color: NOVA_DARK }}>NOVA Live Demo</div>
            <div style={{ fontSize: "11px", color: "#999" }}>Interaktive Vorschau</div>
          </div>
        </div>
        <Link
          to="/login"
          style={{
            padding: "10px 20px",
            background: `linear-gradient(135deg, ${NOVA_GREEN}, #2d9d7f)`,
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "14px",
          }}
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
          style={{
            background: "white",
            borderRadius: 16,
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h1 style={{ margin: "0 0 0.5rem", fontSize: "2.2rem", color: NOVA_DARK }}>
            Willkommen, Demo-User! 👋
          </h1>
          <p style={{ margin: 0, fontSize: "16px", color: "#666" }}>
            Das ist eine interaktive Vorschau Ihres Datenschutz-Dashboards.
          </p>
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#e3f2fd",
              border: "1px solid #90caf9",
              borderRadius: 12,
              fontSize: "14px",
              color: "#1565c0",
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
          style={{
            background: "white",
            borderRadius: 16,
            padding: "1rem",
            marginBottom: "1rem",
            display: "flex",
            gap: "0.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
              style={{
                flex: 1,
                padding: "0.75rem",
                background: selectedTab === tab.id ? `linear-gradient(135deg, ${NOVA_GREEN}, #2d9d7f)` : "white",
                color: selectedTab === tab.id ? "white" : NOVA_DARK,
                border: selectedTab === tab.id ? "none" : "1px solid #e0e4ea",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
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
            style={{
              background: "white",
              borderRadius: 16,
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ margin: "0 0 1.5rem", fontSize: "18px", color: NOVA_DARK }}>
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
                  <span style={{ fontSize: "14px", color: NOVA_GREEN, fontWeight: 600 }}>
                    {statusData.datenschutzMassnahmen}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "#e0e4ea",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${statusData.datenschutzMassnahmen}%`,
                      background: `linear-gradient(90deg, ${NOVA_GREEN}, #2d9d7f)`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Stat Cards */}
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "1rem",
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: 700, color: NOVA_GREEN }}>
                  {statusData.vorfallMeldungen}
                </div>
                <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
                  Vorfälle dokumentiert <InfoTooltip text="DSGVO Art. 33 Meldungen" />
                </div>
              </div>

              <div
                style={{
                  background: "#f8f9fa",
                  padding: "1rem",
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: 700, color: NOVA_GREEN }}>
                  {statusData.risikoAnalysen}
                </div>
                <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
                  Risikoanalysen <InfoTooltip text="DSFAs (Datenschutz-Folgenabschätzungen)" />
                </div>
              </div>

              <div
                style={{
                  background: "#f8f9fa",
                  padding: "1rem",
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "14px", color: "#666" }}>{statusData.letzterCheckup}</div>
                <div style={{ fontSize: "13px", color: "#999", marginTop: "4px" }}>
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
            style={{
              background: "white",
              borderRadius: 16,
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ margin: "0 0 1rem", fontSize: "18px", color: NOVA_DARK }}>
              ⚠️ Das fehlt dir noch
            </h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {gaps.map((gap, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#f8f9fa",
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
                    <div style={{ fontWeight: 600, fontSize: "15px", color: NOVA_DARK }}>
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
            style={{
              background: "white",
              borderRadius: 16,
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ margin: "0 0 1.5rem", fontSize: "18px", color: NOVA_DARK }}>
              ✅ Das solltest du jetzt tun
            </h2>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              {nextSteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#f8f9fa",
                    padding: "1.5rem",
                    borderRadius: 12,
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                    border: "1px solid #e0e4ea",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: `linear-gradient(135deg, ${NOVA_GREEN}, #2d9d7f)`,
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
                    <div style={{ fontWeight: 600, fontSize: "16px", color: NOVA_DARK }}>
                      {step.action}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
                      {step.description}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
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
            background: `linear-gradient(135deg, ${NOVA_GREEN}, #2d9d7f)`,
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
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "white",
              color: NOVA_GREEN,
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
