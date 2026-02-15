import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toast, useToast } from "../../components/common/Toast";

const AVV_STORAGE_KEY = "nova_avv_last_result_v1";

type Recommendation = { item: string; priority: "hoch" | "mittel" | "niedrig" };

type AvvResult = {
  summary?: string;
  conformity_score?: number;
  risks?: string[];
  missing_clauses?: string[];
  recommendations?: Recommendation[];
  international_transfers?: string;
  toms?: string;
  raw?: any;
};

export default function AvvReport() {
  const navigate = useNavigate();
  const { messages, dismissToast } = useToast();
  const [fileName, setFileName] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<number | null>(null);
  const [result, setResult] = useState<AvvResult | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AVV_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setFileName(parsed.fileName || "");
      setCreatedAt(parsed.createdAt || null);
      setResult(parsed.result || parsed.raw || null);
    } catch (e) {
      console.error("AVV load error", e);
    }
  }, []);

  useEffect(() => {
    return () => messages.forEach((m) => dismissToast(m.id));
  }, [messages, dismissToast]);

  if (!result) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>Kein AVV-Bericht gefunden</h2>
        <p style={{ marginBottom: "1rem", color: "#555" }}>Bitte lade zuerst einen Auftragsverarbeitungsvertrag hoch.</p>
        <Link
          to="/avv-check"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.25rem",
            background: "linear-gradient(135deg, #3FB292, #2d9d7f)",
            color: "white",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          AVV hochladen
        </Link>
      </div>
    );
  }

  const NOVA_GREEN = "#3FB292";
  const formatDate = (ts: number | null) => (ts ? new Date(ts).toLocaleString() : "-");

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa 0%, #f0f7f5 100%)", padding: "2rem 1rem" }}>
      <Toast messages={messages} onDismiss={dismissToast} />
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <header style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "2rem", color: "#183939" }}>AVV Prüfbericht</h1>
              <p style={{ margin: "0.25rem 0 0", color: "#555" }}>
                Datei: {fileName || "(unbekannt)"} — erstellt am {formatDate(createdAt)}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => navigate("/avv-check")}
                style={{
                  padding: "0.65rem 1rem",
                  borderRadius: 10,
                  border: "1px solid #e0e4ea",
                  background: "white",
                  cursor: "pointer",
                  color: "#183939",
                }}
              >
                Neu prüfen
              </button>
              <button
                onClick={() => navigate("/welcome")}
                style={{
                  padding: "0.65rem 1rem",
                  borderRadius: 10,
                  border: "none",
                  background: `linear-gradient(135deg, ${NOVA_GREEN}, #2d9d7f)`,
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Zur Übersicht
              </button>
            </div>
          </div>
        </header>

        <div style={{ display: "grid", gap: "1.25rem" }}>
          {/* Score & Summary */}
          <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "0 10px 24px rgba(24,57,57,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: `conic-gradient(${NOVA_GREEN} ${result.conformity_score || 0}%, #e0e4ea 0)` ,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#183939",
                  fontWeight: 800,
                }}
              >
                {result.conformity_score ?? "--"}%
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "18px", color: "#183939" }}>Konformitäts-Score (Art. 28)</div>
                <div style={{ color: "#555", fontSize: "14px" }}>Höher = weniger Nachbesserungen</div>
              </div>
            </div>
            {result.summary && (
              <p style={{ margin: 0, color: "#333", lineHeight: 1.6 }}>{result.summary}</p>
            )}
          </div>

          {/* Risiken */}
          {result.risks && result.risks.length > 0 && (
            <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "0 10px 24px rgba(24,57,57,0.08)" }}>
              <h3 style={{ margin: "0 0 0.75rem", color: "#183939" }}>Hauptrisiken</h3>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#444" }}>
                {result.risks.map((r, i) => (
                  <li key={i} style={{ marginBottom: "0.35rem" }}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Fehlende Klauseln */}
          {result.missing_clauses && result.missing_clauses.length > 0 && (
            <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "0 10px 24px rgba(24,57,57,0.08)" }}>
              <h3 style={{ margin: "0 0 0.75rem", color: "#183939" }}>Fehlende / unklare Klauseln</h3>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#444" }}>
                {result.missing_clauses.map((r, i) => (
                  <li key={i} style={{ marginBottom: "0.35rem" }}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Empfehlungen */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "0 10px 24px rgba(24,57,57,0.08)" }}>
              <h3 style={{ margin: "0 0 0.75rem", color: "#183939" }}>Empfehlungen</h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "0.9rem 1rem",
                      borderRadius: 10,
                      background: "#f7fbf9",
                      border: `1px solid ${rec.priority === "hoch" ? "#ff6b6b" : rec.priority === "mittel" ? "#ffa940" : "#3FB292"}`,
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "#183939" }}>{rec.item}</div>
                    <div style={{ fontSize: "12px", color: rec.priority === "hoch" ? "#ff6b6b" : rec.priority === "mittel" ? "#b77700" : "#2d9d7f" }}>
                      Priorität: {rec.priority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internationale Übermittlungen & TOMs */}
          {(result.international_transfers || result.toms) && (
            <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "0 10px 24px rgba(24,57,57,0.08)" }}>
              <h3 style={{ margin: "0 0 0.75rem", color: "#183939" }}>Technische/organisatorische Infos</h3>
              {result.international_transfers && (
                <p style={{ margin: "0 0 0.35rem", color: "#333" }}>
                  <strong>Internationale Übermittlungen:</strong> {result.international_transfers}
                </p>
              )}
              {result.toms && (
                <p style={{ margin: 0, color: "#333" }}>
                  <strong>TOMs:</strong> {result.toms}
                </p>
              )}
            </div>
          )}

          {/* Raw Fallback */}
          {!result.summary && result.raw && (
            <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "0 10px 24px rgba(24,57,57,0.08)" }}>
              <h3 style={{ margin: "0 0 0.75rem", color: "#183939" }}>Rohdaten</h3>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(result.raw, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
