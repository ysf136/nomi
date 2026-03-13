import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast, useToast } from "../../components/common/Toast";
import AIPoweredBadge from "../../components/common/AIPoweredBadge";
import { analyzeIncident } from "../../services/ai.service";
import { incidentSchema } from "../../lib/validation-schemas";
import { validateSchema } from "../../lib/validators";
import { sanitizeMultiline, sanitizeText } from "../../lib/sanitizers";
import { useAuth } from "../../auth/AuthContext";
import { tokens } from "../../styles/tokens";

const STORAGE_KEY = "nova_incident_last_result_v1";
const DRAFT_KEY = "nova_incident_draft_v1";
const NOVA_DARK = tokens.colors.neutral[800];

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
  return (
    <span data-tooltip={text} style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: "4px" }}>
      ?
    </span>
  );
}

export default function IncidentReport() {
  const navigate = useNavigate();
  const { messages, addToast, dismissToast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<IncidentData>;
      const merged: IncidentData = {
        description: parsed.description ?? "",
        incidentType: parsed.incidentType ?? "datenleck",
        affectedPeople: parsed.affectedPeople ?? "",
        severity: parsed.severity ?? "medium",
        actionsTaken: parsed.actionsTaken ?? "",
        date: parsed.date ?? new Date().toISOString().split("T")[0],
        time: parsed.time ?? new Date().toTimeString().slice(0, 5),
      };

      const validation = validateSchema(incidentSchema, merged);
      if (!validation.success) {
        addToast("Import fehlgeschlagen: Daten unvollstaendig.", "error");
        return;
      }

      setFormData(merged);
      addToast("Formular aus JSON importiert.", "success");
    } catch (error) {
      console.error("Import error", error);
      addToast("Import fehlgeschlagen: Datei ist ungueltig.", "error");
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sanitized = {
      description: sanitizeMultiline(formData.description),
      incidentType: sanitizeText(formData.incidentType),
      affectedPeople: sanitizeText(formData.affectedPeople),
      severity: formData.severity,
      actionsTaken: sanitizeMultiline(formData.actionsTaken),
      date: sanitizeText(formData.date),
      time: sanitizeText(formData.time),
    };

    const validation = validateSchema(incidentSchema, sanitized);
    if (!validation.success) {
      const message = validation.errors[0] ?? "Eingaben sind unvollstaendig.";
      setErr(message);
      addToast(message, "error");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const payload = `
Art des Vorfalls: ${sanitized.incidentType}
Zeitpunkt: ${sanitized.date} um ${sanitized.time} Uhr
Betroffene Personen: ${sanitized.affectedPeople}
Schweregrad: ${sanitized.severity}
Beschreibung: ${sanitized.description}
Bereits ergriffene Maßnahmen: ${sanitized.actionsTaken || "Keine"}
      `.trim();

      const result = await analyzeIncident({
        description: payload,
        incident: sanitized,
        userId: user?.uid,
        incidentId: `incident-${Date.now()}`,
      });

      // Speichern + Draft löschen
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          input: sanitized,
          inputText: payload,
          result,
          createdAt: Date.now(),
        })
      );
      localStorage.removeItem(DRAFT_KEY);

      // Toast zeigen + navigieren
      addToast("✓ Analyse erfolgreich! Lade Ergebnisse...", "success", 2000);
      setTimeout(() => navigate("/vorfall-bewertung"), 2000);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Unbekannter Fehler";
      console.error("Submit error:", e);

      if (errorMsg.includes("Timeout") || errorMsg.includes("timed out")) {
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
    <div style={{ padding: "2rem 1rem" }}>
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
            className="nova-glass"
            style={{
              borderRadius: 20,
              padding: "2rem",
              maxWidth: 500,
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            }}
          >
            <h2 style={{ margin: "0 0 1rem", color: "#1a1a2e" }}>
              💾 Entwurf gefunden
            </h2>
            <p style={{ margin: "0 0 1.5rem", color: "#6b7280", lineHeight: 1.5 }}>
              Sie haben einen ungespeicherten Entwurf eines Vorfallberichts.
              Möchten Sie diesen fortsetzen?
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleRestoreDraft}
                className="nova-btn nova-btn-primary"
                style={{ flex: 1 }}
              >
                Fortsetzen
              </button>
              <button
                onClick={() => {
                  setShowDraftDialog(false);
                  localStorage.removeItem(DRAFT_KEY);
                }}
                className="nova-btn nova-btn-secondary"
                style={{ flex: 1 }}
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
          className="nova-glass-static"
          style={{
            position: "sticky",
            top: "2rem",
            height: "fit-content",
            borderRadius: 16,
            padding: "1.5rem",
          }}
        >
          <h3 style={{ margin: "0 0 1rem", fontSize: "14px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            💡 Tipps
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "13px", lineHeight: 1.6, color: "#666" }}>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "#1a1a2e" }}>Genau sein</strong> – KI-Analyse nutzt alle Details
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "#1a1a2e" }}>Platzhalter</strong> statt echter Daten ([Name], [Email])
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "#1a1a2e" }}>Alle Datenarten</strong> erwähnen (Namen, Adressen, IBAN)
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "#1a1a2e" }}>⏰ Zeitpunkt</strong> exakt: 72h-Frist ab Kenntnisnahme
            </li>
            <li>
              <strong style={{ color: "#1a1a2e" }}>DSGVO Art. 33</strong> – Meldung an Datenschutzamt erforderlich
            </li>
          </ul>
          
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(63,178,146,0.06)", borderRadius: 8, borderLeft: "4px solid #3FB292" }}>
            <div style={{ fontSize: "12px", color: "#3FB292", fontWeight: 700, marginBottom: "0.5rem" }}>
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
          <h1 style={{ margin: "0 0 0.5rem", fontSize: "2rem", color: "#1a1a2e", fontWeight: 700, letterSpacing: "-0.02em" }}>
            🚨 Datenschutzvorfall melden
          </h1>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <AIPoweredBadge tooltip="NOMI KI analysiert Art. 33/34 DSGVO automatisch" />
          </div>
          <p style={{ margin: 0, fontSize: "16px", color: "#666", marginBottom: "1rem" }}>
            NOMI analysiert Ihren Vorfall sofort und gibt Ihnen eine Risikoeinschätzung.
          </p>
          <div style={{ fontSize: "13px", color: "#999" }}>
            ⏱️ Dauert ca. 2-3 Minuten | 🔒 Ihre Daten bleiben privat
          </div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: 12 }}>
            <button
              type="button"
              className="nova-btn nova-btn-secondary nova-btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              JSON importieren
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleImport(file);
                  event.currentTarget.value = "";
                }
              }}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Info Box */}
        <div
          style={{
            background: "rgba(255,243,205,0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,193,7,0.4)",
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
          <div className="nova-glass-static" style={{ borderRadius: 16, padding: "2rem" }}>
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
                    className="nova-input"
                  />
                </div>
                <div>
                  <small style={{ color: "#999", display: "block", marginBottom: "4px" }}>Uhrzeit</small>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                    className="nova-input"
                  />
                </div>
                <button
                  type="button"
                  className="nova-btn nova-btn-ghost nova-btn-sm"
                  onClick={() => {
                    const now = new Date();
                    handleChange("date", now.toISOString().split("T")[0]);
                    handleChange("time", now.toTimeString().slice(0, 5));
                  }}
                  title="Aktuelles Datum und Uhrzeit einfügen"
                  style={{ whiteSpace: "nowrap" }}
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
                className="nova-input"
                style={{ cursor: "pointer" }}
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
                    className={`nova-btn ${formData.severity === level ? "nova-btn-primary" : "nova-btn-ghost"}`}
                    style={{
                      padding: "12px 8px",
                      fontSize: "13px",
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
                className="nova-input"
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
                className="nova-input"
                style={{ resize: "vertical" }}
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
                className="nova-input"
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Fehler */}
            {err && (
              <div
                style={{
                  background: "rgba(255,235,238,0.8)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,107,107,0.4)",
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
                className="nova-btn nova-btn-primary nova-btn-lg"
                style={{ flex: 1 }}
              >
                {loading ? "⏳ Analysiert..." : "Vorfall analysieren"}
              </button>
              <button
                type="button"
                className="nova-btn nova-btn-secondary"
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