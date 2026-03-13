import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toast, useToast } from "../../components/common/Toast";
import { getAvvCaseById } from "../../services/avv.service";
import { tokens } from "../../styles/tokens";

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
  const { caseId } = useParams<{ caseId?: string }>();
  const { messages, dismissToast } = useToast();
  const [fileName, setFileName] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<number | null>(null);
  const [result, setResult] = useState<AvvResult | null>(null);
  const [loading, setLoading] = useState(!!caseId);

  useEffect(() => {
    // If caseId is present, load from Firestore
    if (caseId) {
      setLoading(true);
      getAvvCaseById(caseId)
        .then((avvCase) => {
          if (avvCase) {
            setFileName(avvCase.fileName || "");
            const ts = avvCase.createdAt instanceof Date
              ? avvCase.createdAt.getTime()
              : typeof avvCase.createdAt === "object" && "toDate" in avvCase.createdAt
                ? (avvCase.createdAt as any).toDate().getTime()
                : null;
            setCreatedAt(ts);
            setResult(avvCase.aiAnalysis ?? null);
          }
        })
        .catch((e) => console.error("Failed to load AVV case", e))
        .finally(() => setLoading(false));
      return;
    }

    // Fallback: load from localStorage (legacy)
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
  }, [caseId]);

  useEffect(() => {
    return () => messages.forEach((m) => dismissToast(m.id));
  }, [messages, dismissToast]);

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center", color: tokens.colors.neutral[400] }}>AVV-Bericht wird geladen…</div>;
  }

  if (!result) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>Kein AVV-Bericht gefunden</h2>
        <p style={{ marginBottom: "1rem", color: tokens.colors.neutral[500] }}>Bitte lade zuerst einen Auftragsverarbeitungsvertrag hoch.</p>
        <Link to="/avv-check" className="nova-btn nova-btn-primary" style={{ textDecoration: "none" }}>
          AVV hochladen
        </Link>
      </div>
    );
  }

  const formatDate = (ts: number | null) => (ts ? new Date(ts).toLocaleString() : "-");

  return (
    <div style={{ padding: "2rem 1rem" }}>
      <Toast messages={messages} onDismiss={dismissToast} />
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <header style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "2rem", color: tokens.colors.neutral[800] }}>AVV Prüfbericht</h1>
              <p style={{ margin: "0.25rem 0 0", color: tokens.colors.neutral[500] }}>
                Datei: {fileName || "(unbekannt)"} — erstellt am {formatDate(createdAt)}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="nova-btn nova-btn-secondary" onClick={() => navigate("/avv-check")}>Neu prüfen</button>
              <button className="nova-btn nova-btn-primary" onClick={() => navigate("/welcome")}>Zur Übersicht</button>
            </div>
          </div>
        </header>

        <div style={{ display: "grid", gap: "1.25rem" }}>
          {/* Score & Summary */}
          <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: `conic-gradient(${tokens.colors.brand.primary} ${result.conformity_score || 0}%, rgba(0,0,0,0.06) 0)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: tokens.colors.neutral[800],
                  fontWeight: 800,
                }}
              >
                {result.conformity_score ?? "--"}%
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "18px", color: tokens.colors.neutral[800] }}>Konformitäts-Score (Art. 28)</div>
                <div style={{ color: tokens.colors.neutral[500], fontSize: "14px" }}>Höher = weniger Nachbesserungen</div>
              </div>
            </div>
            {result.summary && (
              <p style={{ margin: 0, color: tokens.colors.neutral[600], lineHeight: 1.6 }}>{result.summary}</p>
            )}
          </div>

          {/* Risiken */}
          {result.risks && result.risks.length > 0 && (
            <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 0.75rem", color: tokens.colors.neutral[800] }}>Hauptrisiken</h3>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: tokens.colors.neutral[600] }}>
                {result.risks.map((r, i) => (
                  <li key={i} style={{ marginBottom: "0.35rem" }}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Fehlende Klauseln */}
          {result.missing_clauses && result.missing_clauses.length > 0 && (
            <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 0.75rem", color: tokens.colors.neutral[800] }}>Fehlende / unklare Klauseln</h3>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: tokens.colors.neutral[600] }}>
                {result.missing_clauses.map((r, i) => (
                  <li key={i} style={{ marginBottom: "0.35rem" }}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Empfehlungen */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 0.75rem", color: tokens.colors.neutral[800] }}>Empfehlungen</h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "0.9rem 1rem",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.5)",
                      backdropFilter: "blur(4px)",
                      border: `1px solid ${rec.priority === "hoch" ? tokens.colors.status.error : rec.priority === "mittel" ? tokens.colors.status.warning : tokens.colors.brand.primary}`,
                    }}
                  >
                    <div style={{ fontWeight: 700, color: tokens.colors.neutral[800] }}>{rec.item}</div>
                    <div style={{ fontSize: "12px", color: rec.priority === "hoch" ? tokens.colors.status.error : rec.priority === "mittel" ? tokens.colors.status.warning : tokens.colors.brand.secondary }}>
                      Priorität: {rec.priority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internationale Übermittlungen & TOMs */}
          {(result.international_transfers || result.toms) && (
            <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 0.75rem", color: tokens.colors.neutral[800] }}>Technische/organisatorische Infos</h3>
              {result.international_transfers && (
                <p style={{ margin: "0 0 0.35rem", color: tokens.colors.neutral[600] }}>
                  <strong>Internationale Übermittlungen:</strong> {result.international_transfers}
                </p>
              )}
              {result.toms && (
                <p style={{ margin: 0, color: tokens.colors.neutral[600] }}>
                  <strong>TOMs:</strong> {result.toms}
                </p>
              )}
            </div>
          )}

          {/* Raw Fallback */}
          {!result.summary && result.raw && (
            <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 0.75rem", color: tokens.colors.neutral[800] }}>Rohdaten</h3>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(result.raw, null, 2)}</pre>
            </div>
          )}

          {/* Art. 22 DSGVO Disclaimer */}
          <div style={{ padding: "0.75rem 1rem", background: "rgba(240,244,255,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(208,215,247,0.5)", borderRadius: 12, fontSize: 12, color: tokens.colors.neutral[600] }}>
            <strong>Hinweis gem. Art. 22 DSGVO:</strong> Diese Analyse ist eine KI-gestützte Empfehlung und stellt keine automatisierte Einzelentscheidung dar.
            Die finale Beurteilung obliegt dem/der zuständigen Datenschutzbeauftragten.
          </div>
        </div>
      </div>
    </div>
  );
}
