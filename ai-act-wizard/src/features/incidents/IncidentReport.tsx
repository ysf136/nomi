import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast, useToast } from "../../components/common/Toast";

const STORAGE_KEY = "nova_incident_last_result_v1";
const DRAFT_KEY = "nova_incident_draft_v1";

interface IncidentData {
  description: string;
  incidentType: string;
  affectedPeople: string;
  severity: "low" | "medium" | "high" | "critical";
  actionsTaken: string;
  date: string;
  time: string;
}

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ position: "relative", cursor: "help", color: "#3FB292", fontWeight: "bold", marginLeft: "4px" }}
    >
      ?
      {show && (
        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: "-50px",
            background: "#183939",
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

export default function IncidentReport() {
  const navigate = useNavigate();
  const { messages, addToast, dismissToast } = useToast();

  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [formData, setFormData] = useState<IncidentData>({
    description: "",
    incidentType: "datenleck",
    affectedPeople: "",
    severity: "medium",
    actionsTaken: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Draft Auto-Save
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.description || formData.affectedPeople || formData.actionsTaken) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      }
    }, 5000); // Alle 5 Sekunden speichern

    return () => clearInterval(interval);
  }, [formData]);

  // Draft beim Laden prüfen
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Nur laden, wenn noch nichts eingegeben wurde
        if (!formData.description && !formData.affectedPeople && !formData.actionsTaken) {
          setShowDraftDialog(true);
        }
      } catch (e) {
        console.error("Draft parsing failed", e);
      }
    }
  }, []);

  const handleChange = (field: keyof IncidentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.description.trim()) {
      setErr("Bitte beschreiben Sie den Vorfall detailliert.");
      addToast("Bitte beschreiben Sie den Vorfall detailliert.", "error");
      return;
    }
    if (!formData.affectedPeople.trim()) {
      setErr("Bitte geben Sie an, wie viele Personen betroffen sind.");
      addToast("Bitte geben Sie an, wie viele Personen betroffen sind.", "error");
      return;
    }

    setErr("");
    setLoading(true);
    let timeoutId: NodeJS.Timeout;

    try {
      const payload = `
Art des Vorfalls: ${formData.incidentType}
Zeitpunkt: ${formData.date} um ${formData.time} Uhr
Betroffene Personen: ${formData.affectedPeople}
Schweregrad: ${formData.severity}
Beschreibung: ${formData.description}
Bereits ergriffene Maßnahmen: ${formData.actionsTaken || "Keine"}
      `.trim();

      // Timeout nach 15 Sekunden
      const timeoutPromise = new Promise((_, reject) =>
        (timeoutId = setTimeout(
          () => reject(new Error("Analyse-Timeout (15s)")),
          15000
        ))
      );

      const fetchPromise = fetch("/api/incident-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: payload }),
      });

      const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      // Speichern + Draft löschen
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ input: formData, result, createdAt: Date.now() })
      );
      localStorage.removeItem(DRAFT_KEY);

      // Toast zeigen + navigieren
      addToast("✓ Analyse erfolgreich! Lade Ergebnisse...", "success", 2000);
      setTimeout(() => navigate("/vorfall-bewertung"), 2000);
    } catch (e) {
      clearTimeout(timeoutId!);
      const errorMsg = e instanceof Error ? e.message : "Unbekannter Fehler";
      console.error("Submit error:", e);

      if (errorMsg.includes("Timeout")) {
        setErr("Analyse dauert länger als erwartet. Bitte versuchen Sie es später erneut.");
        addToast("Analyse-Timeout. Bitte versuchen Sie es später erneut.", "warning", 5000);
      } else if (errorMsg.includes("Failed to fetch")) {
        setErr("Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.");
        addToast("Netzwerkfehler. Bitte Internetverbindung überprüfen.", "error");
      } else {
        setErr(`Auswertung fehlgeschlagen: ${errorMsg}. Bitte erneut versuchen.`);
        addToast("Auswertung fehlgeschlagen. Bitte erneut versuchen.", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  const NOVA_GREEN = "#3FB292";
  const NOVA_DARK = "#183939";

  const handleRestoreDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
        addToast("Entwurf wiederhergestellt", "success");
      } catch (e) {
        console.error("Draft restore failed", e);
      }
    }
    setShowDraftDialog(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa 0%, #f0f7f5 100%)", padding: "2rem 1rem" }}>
      <Toast messages={messages} onDismiss={dismissToast} />

      {/* Draft Dialog */}
      {showDraftDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "2rem",
              maxWidth: 500,
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ margin: "0 0 1rem", color: NOVA_DARK }}>
              💾 Entwurf gefunden
            </h2>
            <p style={{ margin: "0 0 1.5rem", color: "#666", lineHeight: 1.5 }}>
              Sie haben einen ungespeicherten Entwurf eines Vorfallberichts.
              Möchten Sie diesen fortsetzen?
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleRestoreDraft}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: `linear-gradient(135deg, ${NOVA_GREEN}, #2d9d7f)`,
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Fortsetzen
              </button>
              <button
                onClick={() => {
                  setShowDraftDialog(false);
                  localStorage.removeItem(DRAFT_KEY);
                }}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "white",
                  border: "1px solid #e0e4ea",
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: NOVA_DARK,
                }}
              >
                Neu starten
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem" }}>
        {/* Linke Sidebar - Sticky Guidelines */}
        <div
          style={{
            position: "sticky",
            top: "2rem",
            height: "fit-content",
            background: "white",
            borderRadius: 16,
            padding: "1.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: "0 0 1rem", fontSize: "14px", fontWeight: 700, color: NOVA_DARK, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            💡 Tipps
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "13px", lineHeight: 1.6, color: "#666" }}>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: NOVA_DARK }}>Genau sein</strong> – KI-Analyse nutzt alle Details
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: NOVA_DARK }}>Platzhalter</strong> statt echter Daten ([Name], [Email])
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: NOVA_DARK }}>Alle Datenarten</strong> erwähnen (Namen, Adressen, IBAN)
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: NOVA_DARK }}>⏰ Zeitpunkt</strong> exakt: 72h-Frist ab Kenntnisnahme
            </li>
            <li>
              <strong style={{ color: NOVA_DARK }}>DSGVO Art. 33</strong> – Meldung an Datenschutzamt erforderlich
            </li>
          </ul>
          
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f0f7f5", borderRadius: 8, borderLeft: `4px solid ${NOVA_GREEN}` }}>
            <div style={{ fontSize: "12px", color: NOVA_GREEN, fontWeight: 700, marginBottom: "0.5rem" }}>
              ✓ WIR HELFEN
            </div>
            <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.5 }}>
              NOMI analysiert Ihren Fall und gibt Ihnen konkrete Handlungsempfehlungen – Sie sind nicht allein.
            </div>
          </div>
        </div>

        {/* Rechte Spalte - Formular */}
        <div>
        {/* Header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1 style={{ margin: "0 0 0.5rem", fontSize: "2.2rem", color: NOVA_DARK }}>
            🚨 Datenschutzvorfall melden
          </h1>
          <p style={{ margin: 0, fontSize: "16px", color: "#666", marginBottom: "1rem" }}>
            NOMI analysiert Ihren Vorfall sofort und gibt Ihnen eine Risikoeinschätzung.
          </p>
          <div style={{ fontSize: "13px", color: "#999" }}>
            ⏱️ Dauert ca. 2-3 Minuten | 🔒 Ihre Daten bleiben privat
          </div>
        </div>

        {/* Info Box */}
        <div
          style={{
            background: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: 12,
            padding: "1rem",
            marginBottom: "2rem",
            fontSize: "14px",
            color: "#333",
          }}
        >
          💡 <strong>Wichtig:</strong> Verwenden Sie Platzhalter (z.B. [Name], [Kundennr.]) statt echter Daten.
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: "white", borderRadius: 16, padding: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            {/* Zeitstempel */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "8px", color: NOVA_DARK }}>
                Datum und Uhrzeit des Vorfalls <InfoTooltip text="Genauer Zeitpunkt: DSGVO Art. 33 (72h Frist ab Kenntnisnahme)" />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "8px", alignItems: "flex-end" }}>
                <div>
                  <small style={{ color: "#999", display: "block", marginBottom: "4px" }}>Datum</small>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e0e4ea",
                      borderRadius: 8,
                      fontSize: "14px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <div>
                  <small style={{ color: "#999", display: "block", marginBottom: "4px" }}>Uhrzeit</small>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e0e4ea",
                      borderRadius: 8,
                      fontSize: "14px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    handleChange("date", now.toISOString().split("T")[0]);
                    handleChange("time", now.toTimeString().slice(0, 5));
                  }}
                  title="Aktuelles Datum und Uhrzeit einfügen"
                  style={{
                    padding: "10px 14px",
                    background: "white",
                    border: "1px solid #e0e4ea",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: NOVA_GREEN,
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(63, 178, 146, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "white";
                  }}
                >
                  ⏱️ Jetzt
                </button>
              </div>
            </div>

            {/* Art des Vorfalls */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "8px", color: NOVA_DARK }}>
                Art des Vorfalls <InfoTooltip text="Welche Art von Datenschutzvorfall ist aufgetreten?" />
              </label>
              <select
                value={formData.incidentType}
                onChange={(e) => handleChange("incidentType", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e4ea",
                  borderRadius: 8,
                  fontSize: "14px",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="datenleck">📧 Datenleck (E-Mail, Dateifreigabe, etc.)</option>
                <option value="unbefugter-zugriff">🔓 Unbefugter Zugriff</option>
                <option value="malware">🦠 Malware / Ransomware</option>
                <option value="physischer-diebstahl">🚗 Physischer Diebstahl (Gerät, Dokumente)</option>
                <option value="insider-threat">👤 Insider-Bedrohung</option>
                <option value="verlust">📱 Datenverlust (versehentlich gelöscht)</option>
                <option value="sonstiges">❓ Sonstiges</option>
              </select>
            </div>

            {/* Schweregrad */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "8px", color: NOVA_DARK }}>
                Eingeschätzter Schweregrad <InfoTooltip text="Wie kritisch ist der Vorfall?" />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                {(["low", "medium", "high", "critical"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange("severity", level)}
                    style={{
                      padding: "12px 8px",
                      border: `2px solid ${formData.severity === level ? NOVA_GREEN : "#e0e4ea"}`,
                      background: formData.severity === level ? "rgba(63, 178, 146, 0.1)" : "white",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: NOVA_DARK,
                      transition: "all 0.2s",
                    }}
                  >
                    {level === "low" && "🟢 Gering"}
                    {level === "medium" && "🟡 Mittel"}
                    {level === "high" && "🔴 Hoch"}
                    {level === "critical" && "🔥 Kritisch"}
                  </button>
                ))}
              </div>
            </div>

            {/* Betroffene Personen */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "8px", color: NOVA_DARK }}>
                Anzahl betroffener Personen <InfoTooltip text="Wie viele Personen sind betroffen?" />
              </label>
              <input
                type="text"
                placeholder="z.B. ~500, unbekannt, 1-10, etc."
                value={formData.affectedPeople}
                onChange={(e) => handleChange("affectedPeople", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e4ea",
                  borderRadius: 8,
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Hauptbeschreibung */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "8px", color: NOVA_DARK }}>
                Detaillierte Beschreibung des Vorfalls <InfoTooltip text="Je detaillierter, desto besser kann NOMI helfen" />
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={10}
                placeholder="Beispiel: Am 24.09.2025 wurde eine E-Mail mit Kundendaten versehentlich an [externe-Person] gesendet. Die E-Mail enthielt [Datentyp] von etwa [Anzahl] [Betroffene Gruppe]..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #e0e4ea",
                  borderRadius: 8,
                  fontFamily: "inherit",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Bereits ergriffene Maßnahmen */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "8px", color: NOVA_DARK }}>
                Bereits ergriffene Maßnahmen (optional) <InfoTooltip text="Was haben Sie bereits getan?" />
              </label>
              <textarea
                value={formData.actionsTaken}
                onChange={(e) => handleChange("actionsTaken", e.target.value)}
                rows={4}
                placeholder="z.B. E-Mail wurde zurückgerufen, Passwort wurde geändert, externe Person wurde kontaktiert, etc."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #e0e4ea",
                  borderRadius: 8,
                  fontFamily: "inherit",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Fehler */}
            {err && (
              <div
                style={{
                  background: "#ffebee",
                  border: "1px solid #ff6b6b",
                  borderRadius: 8,
                  padding: "1rem",
                  color: "#c92a2a",
                  marginBottom: "1.5rem",
                  fontSize: "14px",
                }}
              >
                ❌ {err}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={loading || !formData.description.trim() || !formData.affectedPeople.trim()}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  background: loading
                    ? "#ccc"
                    : `linear-gradient(135deg, ${NOVA_GREEN}, #2d9d7f)`,
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!loading)
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                {loading ? "⏳ Analysiert..." : "Vorfall analysieren"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    description: "",
                    incidentType: "datenleck",
                    affectedPeople: "",
                    severity: "medium",
                    actionsTaken: "",
                    date: new Date().toISOString().split("T")[0],
                    time: new Date().toTimeString().slice(0, 5),
                  })
                }
                style={{
                  padding: "14px 20px",
                  background: "white",
                  border: `1px solid #d4e8e0`,
                  borderRadius: 8,
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  color: "#7cbaaa",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#f0f7f5";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#a8d5c8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "white";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#d4e8e0";
                }}
              >
                Zurücksetzen
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}