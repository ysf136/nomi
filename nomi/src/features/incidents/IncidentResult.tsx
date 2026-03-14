// src/routes/IncidentResult.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Toast, useToast } from "../../components/common/Toast";
import { IncidentAssistantResult } from "../../services/ai.provider";
import { createApprovalItem } from "../../services/approval.service";
import { logAuditEvent } from "../../services/audit.service";
import { useAuth } from "../../auth/AuthContext";
import { sanitizeText } from "../../lib/sanitizers";
import { downloadCSV, downloadJSON } from "../../lib/exporters";
import { tokens } from "../../styles/tokens";
import AiFeedback from "../../components/common/AiFeedback";

const STORAGE_KEY = "nova_incident_last_result_v1";
const HISTORY_KEY = "nova_incident_history_v1";

export default function IncidentResult() {
  const navigate = useNavigate();
  const { messages, addToast, dismissToast } = useToast();
  const { user } = useAuth();
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<IncidentAssistantResult | null>(null);
  const [createdAt, setCreatedAt] = useState<number | null>(null);
  const [incidentDate, setIncidentDate] = useState<string>("");
  const [incidentTime, setIncidentTime] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isCritical, setIsCritical] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Initial Load + Toast
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const inputValue = parsed.inputText
        || (typeof parsed.input === "string" ? parsed.input : JSON.stringify(parsed.input ?? {}, null, 2));
      setInput(inputValue);
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

  function handleDownloadCSV() {
    if (!result) return;
    const rows = [
      {
        summary: result.summary,
        risk_level: result.risk_level,
        art33_required: result.art33_required,
        art34_required: result.art34_required,
        data_categories: result.data_categories?.join(" | ") ?? "",
        data_subjects: result.data_subjects?.gruppen?.join(" | ") ?? "",
        measures: result.measures?.join(" | ") ?? "",
      },
    ];
    downloadCSV(rows, "NOVA-Datenschutzvorfall-Bewertung.csv");
  }

  async function handleHumanLoop() {
    if (!result) return;
    const contact = prompt("Optional: Kontakt für Rueckruf/E-Mail (Name/Telefon/E-Mail) eingeben oder leer lassen:");
    const sanitizedContact = contact ? sanitizeText(contact) : "";
    setReviewSubmitting(true);

    try {
      const priority = result.risk_level === "hoch" ? "high" : result.risk_level === "mittel" ? "medium" : "low";
      const approvalId = await createApprovalItem({
        type: "incident",
        sourceId: `incident-${createdAt ?? Date.now()}`,
        status: "pending",
        aiDecision: result,
        comments: [],
        deadlineAt: undefined,
        priority,
      });

      await logAuditEvent({
        userId: user?.uid ?? "anonymous",
        action: "manual-decision",
        entityType: "incident",
        entityId: approvalId,
        aiProvider: "claude",
        aiDecision: result,
        humanApproved: false,
        humanDecision: { requestedReview: true, contact: sanitizedContact },
      });

      addToast("Review-Anfrage erstellt. Ein Reviewer meldet sich.", "success", 4000);
    } catch (error) {
      console.error("Human review request failed", error);
      addToast("Konnte die Anfrage nicht uebermitteln. Bitte spaeter erneut versuchen.", "error");
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (!result) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
        <div className="nova-glass-static" style={{ borderRadius: 16, padding: "2rem" }}>
          <h1 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem" }}>Datenschutzrechtliche Bewertung</h1>
          <div style={{ color: "#b00020", marginTop: 8 }}>
            Kein Ergebnis gefunden. Bitte starten Sie eine neue Meldung.
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="nova-btn nova-btn-secondary" onClick={() => navigate("/vorfall-melden")}>
              Zurück zur Eingabe
            </button>
          </div>
        </div>
      </div>
    );
  }

  const NOVA_GREEN = tokens.colors.brand.primary;
  const NOVA_DARK = tokens.colors.neutral[800];

  return (
    <div style={{ padding: "2rem 1rem" }}>
      <Toast messages={messages} onDismiss={dismissToast} />
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header mit 72h-Countdown */}
        <div className="nova-glass-static" style={{ borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}>
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
        <div ref={pdfRef} className="nova-glass-static" style={{ borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}>
        <h2 style={{ marginTop: 0 }}>Kurzfassung</h2>
        <p style={{ marginTop: 0 }}>{result.summary}</p>

        <h3>Ihre Eingabe (Kurz)</h3>
        <div style={{ whiteSpace: "pre-wrap", background: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)", padding: 12, borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)" }}>
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

        <AiFeedback
          domain="incident"
          input={{
            description: input,
            incidentType: result.data_categories?.[0] ?? "unbekannt",
            affectedPeople: result.data_subjects?.anzahl ?? "",
            date: incidentDate,
          }}
          output={result as unknown as Record<string, unknown>}
        />
        </div>

        {/* Incident History */}
        {history.length > 1 && (
          <div className="nova-glass-static" style={{ borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}>
            <button
              className="nova-btn nova-btn-secondary"
              onClick={() => setShowHistory(!showHistory)}
              style={{ width: "100%", justifyContent: "center" }}
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
                      background: "rgba(255,255,255,0.5)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 8,
                      border: "1px solid rgba(0,0,0,0.06)",
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
          <button className="nova-btn nova-btn-primary" onClick={handleDownloadPDF} style={{ flex: "1 1 auto", minWidth: 150 }}>
            📥 PDF herunterladen
          </button>
          <button className="nova-btn nova-btn-secondary" onClick={() => downloadJSON(result, "NOVA-Datenschutzvorfall-Bewertung.json")} style={{ flex: "1 1 auto", minWidth: 150 }}>
            🧩 JSON exportieren
          </button>
          <button className="nova-btn nova-btn-secondary" onClick={handleDownloadCSV} style={{ flex: "1 1 auto", minWidth: 150 }}>
            🧾 CSV exportieren
          </button>
          <button className="nova-btn nova-btn-ghost" onClick={handleHumanLoop} disabled={reviewSubmitting} style={{ flex: "1 1 auto", minWidth: 150 }}>
            👤 {reviewSubmitting ? "Review wird erstellt..." : "Human Review"}
          </button>
          <button className="nova-btn nova-btn-secondary" onClick={() => navigate("/vorfall-melden")} style={{ flex: "1 1 auto", minWidth: 150 }}>
            + Neuer Vorfall
          </button>
        </div>
    </div>
    </div>
  );
}