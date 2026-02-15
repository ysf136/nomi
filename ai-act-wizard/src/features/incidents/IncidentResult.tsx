// src/routes/IncidentResult.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Toast, useToast } from "../../components/common/Toast";

const STORAGE_KEY = "nova_incident_last_result_v1";
const HISTORY_KEY = "nova_incident_history_v1";

type Result = {
  summary: string;
  data_categories: string[];
  data_subjects: { gruppen: string[]; anzahl: string };
  cia_impact: { confidentiality: string; integrity: string; availability: string };
  tom_relevance: string[];
  risk_level: "niedrig" | "mittel" | "hoch";
  art33_required: boolean;
  art33_reasoning: string;
  art34_required: boolean;
  art34_reasoning: string;
  measures: string[];
  open_points: string[];
  legal_analysis: string;
  doc_text: string;
};

export default function IncidentResult() {
  const navigate = useNavigate();
  const { messages, addToast, dismissToast } = useToast();
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  const [createdAt, setCreatedAt] = useState<number | null>(null);
  const [incidentDate, setIncidentDate] = useState<string>("");
  const [incidentTime, setIncidentTime] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isCritical, setIsCritical] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Initial Load + Toast
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setInput(parsed.input || "");
      setResult(parsed.result || null);
      setCreatedAt(parsed.createdAt || null);
      
      // Extract incident date/time from input
      if (parsed.input?.date && parsed.input?.time) {
        setIncidentDate(parsed.input.date);
        setIncidentTime(parsed.input.time);
      }

      // Load history
      const historyRaw = localStorage.getItem(HISTORY_KEY);
      if (historyRaw) {
        const hist = JSON.parse(historyRaw);
        setHistory(hist);
      } else {
        setHistory([]);
      }

      // Show success toast
      addToast("✓ Analyse erfolgreich abgeschlossen", "success", 3000);
    } catch (e) {
      console.error("Initial load error", e);
    }
  }, []);

  // 72h Countdown Calculator
  useEffect(() => {
    if (!incidentDate || !incidentTime) return;

    const interval = setInterval(() => {
      const [year, month, day] = incidentDate.split("-");
      const [hours, minutes] = incidentTime.split(":");
      const incidentTimestamp = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`).getTime();
      const deadline = incidentTimestamp + 72 * 60 * 60 * 1000;
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeRemaining("⛔ DEADLINE ABGELAUFEN");
        setIsCritical(true);
      } else {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        const hrs = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

        setTimeRemaining(`${days}d ${hrs}h ${mins}m`);
        setIsCritical(diff < 24 * 60 * 60 * 1000); // < 24 Stunden
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [incidentDate, incidentTime]);

  // Save to history on mount (after result is loaded)
  useEffect(() => {
    if (result && incidentDate && incidentTime) {
      const newEntry = {
        id: Date.now(),
        incidentDate,
        incidentTime,
        summary: result.summary,
        riskLevel: result.risk_level,
        createdAt: new Date().toLocaleString(),
      };

      const hist = localStorage.getItem(HISTORY_KEY);
      const historyArray = hist ? JSON.parse(hist) : [];
      historyArray.unshift(newEntry);
      // Keep only last 10
      if (historyArray.length > 10) historyArray.pop();
      localStorage.setItem(HISTORY_KEY, JSON.stringify(historyArray));
      setHistory(historyArray);
    }
  }, [result]);

  async function handleDownloadPDF() {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = canvas.height * (imgWidth / canvas.width);
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft - imgHeight;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save("NOVA-Datenschutzvorfall-Bewertung.pdf");
  }

  async function handleHumanLoop() {
    const contact = prompt("Optional: Kontakt für Rückruf/E-Mail (Name/Telefon/E-Mail) eingeben oder leer lassen:");
    try {
      await fetch("/api/hitl-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: contact || "",
          payload: { input, result, createdAt },
        }),
      });
      alert("Anfrage übermittelt. Ein menschlicher Reviewer meldet sich.");
    } catch {
      alert("Konnte die Anfrage nicht übermitteln. Bitte später erneut versuchen.");
    }
  }

  if (!result) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
        <h1>Datenschutzrechtliche Bewertung</h1>
        <div style={{ color: "#b00020", marginTop: 8 }}>
          Kein Ergebnis gefunden. Bitte starten Sie eine neue Meldung.
        </div>
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => navigate("/vorfall-melden")}
            style={{ background: "#fff", border: "1px solid #d9e2ec", borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}
          >
            Zurück zur Eingabe
          </button>
        </div>
      </div>
    );
  }

  const NOVA_GREEN = "#3FB292";
  const NOVA_DARK = "#183939";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa 0%, #f0f7f5 100%)", padding: "2rem 1rem" }}>
      <Toast messages={messages} onDismiss={dismissToast} />
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header mit 72h-Countdown */}
        <div style={{ background: "white", borderRadius: 16, padding: "2rem", marginBottom: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem" }}>
            <div>
              <h1 style={{ margin: "0 0 0.5rem", color: NOVA_DARK, fontSize: "2rem" }}>
                ✓ Datenschutzrechtliche Bewertung
              </h1>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                Vorfall gemeldet am {incidentDate} um {incidentTime} Uhr
              </p>
            </div>
            
            {/* 72h Frist Anzeige */}
            <div
              style={{
                background: isCritical ? "#fff3cd" : "#d4edda",
                border: `2px solid ${isCritical ? "#ffc107" : NOVA_GREEN}`,
                borderRadius: 12,
                padding: "1rem",
                textAlign: "center",
                minWidth: 200,
              }}
            >
              <div style={{ fontSize: "12px", color: isCritical ? "#856404" : "#155724", fontWeight: 600, marginBottom: "0.5rem" }}>
                ⏰ DSGVO ART. 33 FRIST
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: isCritical ? "#d39e00" : NOVA_GREEN,
                }}
              >
                {timeRemaining}
              </div>
              <div style={{ fontSize: "11px", color: isCritical ? "#856404" : "#155724", marginTop: "0.5rem" }}>
                Meldung an Aufsicht erforderlich
              </div>
            </div>
          </div>
        </div>

        {/* Risiko-Alert Box */}
        {result.risk_level === "hoch" && (
          <div
            style={{
              background: "#ffebee",
              border: "2px solid #ff6b6b",
              borderRadius: 12,
              padding: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <strong style={{ color: "#c92a2a", fontSize: "16px" }}>🚨 HOHES RISIKO</strong>
            <p style={{ margin: "0.5rem 0 0", color: "#721c24", fontSize: "14px" }}>
              Dieser Vorfall erfordert sofortige Aufmerksamkeit und dringliche Maßnahmen.
            </p>
          </div>
        )}

        {/* Main Content */}
        <div ref={pdfRef} style={{ background: "white", borderRadius: 16, padding: "2rem", marginBottom: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <h2 style={{ marginTop: 0 }}>Kurzfassung</h2>
        <p style={{ marginTop: 0 }}>{result.summary}</p>

        <h3>Ihre Eingabe (Kurz)</h3>
        <div style={{ whiteSpace: "pre-wrap", background: "#f7f9fb", padding: 12, borderRadius: 8, border: "1px solid #e6e9ed" }}>
          {input}
        </div>

        <h3>Datenkategorien</h3>
        <p>{result.data_categories?.join(", ") || "–"}</p>

        <h3>Betroffene</h3>
        <p>Gruppen: {result.data_subjects?.gruppen?.join(", ") || "–"} | Anzahl: {result.data_subjects?.anzahl || "–"}</p>

        <h3>Schutzgüter (C/I/A)</h3>
        <p>
          Vertraulichkeit: {result.cia_impact?.confidentiality || "–"} · Integrität: {result.cia_impact?.integrity || "–"} · Verfügbarkeit: {result.cia_impact?.availability || "–"}
        </p>

        <h3>Relevante TOMs</h3>
        <ul>{(result.tom_relevance || []).map((t, i) => <li key={i}>{t}</li>)}</ul>

        <h3>Risiko</h3>
        <p style={{ fontWeight: 600, marginTop: 0 }}>{(result.risk_level || "–").toUpperCase?.()}</p>

        <h3>Art. 33 – Meldung an Aufsicht</h3>
        <p>{result.art33_required ? "Erforderlich" : "Nicht erforderlich"}</p>
        <p style={{ whiteSpace: "pre-wrap" }}>{result.art33_reasoning}</p>

        <h3>Art. 34 – Benachrichtigung Betroffener</h3>
        <p>{result.art34_required ? "Erforderlich" : "Nicht erforderlich"}</p>
        <p style={{ whiteSpace: "pre-wrap" }}>{result.art34_reasoning}</p>

        <h3>Sofortmaßnahmen</h3>
        <ul>{(result.measures || []).map((m, i) => <li key={i}>{m}</li>)}</ul>

        {result.open_points?.length ? (
          <>
            <h3>Offene Punkte / Rückfragen</h3>
            <ul>{result.open_points.map((o, i) => <li key={i}>{o}</li>)}</ul>
          </>
        ) : null}

        <h3>Rechtliche Analyse</h3>
        <div style={{ whiteSpace: "pre-wrap" }}>{result.legal_analysis}</div>

        <h3>Dokumentationstext</h3>
        <div style={{ whiteSpace: "pre-wrap" }}>{result.doc_text}</div>
        </div>

        {/* Incident History */}
        {history.length > 1 && (
          <div style={{ background: "white", borderRadius: 16, padding: "2rem", marginBottom: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{
                width: "100%",
                padding: "1rem",
                background: "white",
                border: `2px solid ${NOVA_GREEN}`,
                borderRadius: 8,
                fontWeight: 600,
                color: NOVA_GREEN,
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {showHistory ? "▼ Vorfallhistorie verbergen" : "▶ Vorfallhistorie anzeigen"} ({history.length - 1} weitere)
            </button>
            {showHistory && (
              <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {history.slice(1).map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "1rem",
                      background: "#f8fafc",
                      borderRadius: 8,
                      border: "1px solid #e0e4ea",
                      fontSize: "13px",
                    }}
                  >
                    <strong>{idx + 1}. Vorfall</strong> – {item.incidentDate} um {item.incidentTime} Uhr
                    <br />
                    <span style={{ color: "#666" }}>Risiko: {item.riskLevel.toUpperCase()} · {item.createdAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={handleDownloadPDF}
          style={{
            flex: "1 1 auto",
            minWidth: 150,
            padding: "14px 20px",
            background: `linear-gradient(135deg, ${NOVA_GREEN}, #2d9d7f)`,
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          📥 PDF herunterladen
        </button>
        <button
          onClick={handleHumanLoop}
          style={{
            flex: "1 1 auto",
            minWidth: 150,
            padding: "14px 20px",
            background: "white",
            border: `1px solid ${NOVA_GREEN}`,
            borderRadius: 8,
            fontWeight: 600,
            color: NOVA_GREEN,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(63, 178, 146, 0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          👤 Human Review
        </button>
        <button
          onClick={() => navigate("/vorfall-melden")}
          style={{
            flex: "1 1 auto",
            minWidth: 150,
            padding: "14px 20px",
            background: "white",
            border: "1px solid #e0e4ea",
            borderRadius: 8,
            fontWeight: 600,
            color: NOVA_DARK,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          + Neuer Vorfall
        </button>
      </div>
    </div>
    </div>
  );
}