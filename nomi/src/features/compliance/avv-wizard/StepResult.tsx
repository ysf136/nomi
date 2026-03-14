import type { useAvvWizard } from "./useAvvWizard";
import type { AvvRecommendation } from "../../../services/ai.provider";
import { tokens } from "../../../styles/tokens";
import AiFeedback from "../../../components/common/AiFeedback";

type Props = { wizard: ReturnType<typeof useAvvWizard> };

const CONFIDENCE_BADGE: Record<string, { cls: string; label: string }> = {
  high: { cls: "nova-badge nova-badge-success", label: "Hohe Konfidenz" },
  medium: { cls: "nova-badge nova-badge-warning", label: "Mittlere Konfidenz" },
  low: { cls: "nova-badge nova-badge-error", label: "Niedrige Konfidenz – HITL erforderlich" },
};

const PRIORITY_COLOR: Record<string, string> = {
  hoch: tokens.colors.status.error,
  mittel: tokens.colors.status.warning,
  niedrig: tokens.colors.status.success,
};

export default function StepResult({ wizard }: Props) {
  const { state, goNext, goBack } = wizard;
  const result = state.analysisResult;

  if (!result) {
    return <p style={{ padding: "2rem", textAlign: "center", color: tokens.colors.neutral[400] }}>Kein Ergebnis vorhanden.</p>;
  }

  const score = result.conformity_score;
  const confidence = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  const badge = CONFIDENCE_BADGE[confidence];

  return (
    <div>
      <h2 style={{ margin: "0 0 0.5rem", color: tokens.colors.neutral[800], fontSize: "1.25rem", fontWeight: 600 }}>
        Schritt 4: Prüfergebnis
      </h2>

      {/* Summary + score row */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
        {/* Score circle */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `conic-gradient(${tokens.colors.brand.primary} ${score * 3.6}deg, ${tokens.colors.neutral[200]} ${score * 3.6}deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: `0 0 16px ${tokens.colors.brand.primary}25`,
          }}
        >
          <span
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
              color: tokens.colors.neutral[900],
            }}
          >
            {score}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <span className={badge.cls} style={{ marginBottom: 6, display: "inline-block" }}>
            {badge.label}
          </span>
          <p style={{ margin: 0, color: tokens.colors.neutral[500], fontSize: 14, lineHeight: 1.5 }}>{result.summary}</p>
        </div>
      </div>

      {/* HITL notice for low confidence */}
      {confidence === "low" && (
        <div style={{ padding: "0.75rem 1rem", background: "rgba(245,158,11,0.08)", border: `1px solid ${tokens.colors.status.warning}40`, borderRadius: 12, fontSize: 13, marginBottom: "1rem", backdropFilter: "blur(6px)" }}>
          ⚠️ <strong>Human-in-the-Loop:</strong> Aufgrund geringer Konfidenz wurde der Fall automatisch in die manuelle Prüfwarteschlange eskaliert.
        </div>
      )}

      {/* Art. 22 disclaimer */}
      <div style={{ padding: "0.6rem 1rem", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12, fontSize: 12, color: tokens.colors.neutral[600], marginBottom: "1rem" }}>
        <strong>Hinweis gem. Art. 22 DSGVO:</strong> Diese Analyse ist eine KI-gestützte Empfehlung und stellt keine automatisierte Einzelentscheidung dar.
        Die finale Beurteilung obliegt dem/der zuständigen Datenschutzbeauftragten.
      </div>

      {/* Risks */}
      {result.risks.length > 0 && (
        <Section title="Risiken">
          <ul style={listStyle}>
            {result.risks.map((r, i) => <li key={i} style={liStyle}>{r}</li>)}
          </ul>
        </Section>
      )}

      {/* Missing clauses */}
      {result.missing_clauses.length > 0 && (
        <Section title="Fehlende Klauseln">
          <ul style={listStyle}>
            {result.missing_clauses.map((c, i) => <li key={i} style={liStyle}>{c}</li>)}
          </ul>
        </Section>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <Section title="Handlungsempfehlungen">
          <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${tokens.colors.neutral[200]}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.6)", textAlign: "left" }}>
                  <th style={th}>Empfehlung</th>
                  <th style={{ ...th, width: 90 }}>Priorität</th>
                </tr>
              </thead>
              <tbody>
                {result.recommendations.map((rec: AvvRecommendation, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${tokens.colors.neutral[100]}` }}>
                    <td style={td}>{rec.item}</td>
                    <td style={td}>
                      <span style={{ color: PRIORITY_COLOR[rec.priority] ?? tokens.colors.neutral[500], fontWeight: 600, textTransform: "capitalize" }}>
                        {rec.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* International transfers */}
      <Section title="Internationale Datenübermittlung (Art. 44 ff.)">
        <p style={{ margin: 0, fontSize: 13, color: tokens.colors.neutral[600], lineHeight: 1.5 }}>{result.international_transfers}</p>
      </Section>

      {/* TOMs */}
      <Section title="Technische & organisatorische Maßnahmen (Art. 32)">
        <p style={{ margin: 0, fontSize: 13, color: tokens.colors.neutral[600], lineHeight: 1.5 }}>{result.toms}</p>
      </Section>

      <AiFeedback
        domain="avv"
        input={{ fileName: state.fileName ?? "unbekannt", documentText: (state.extractedText ?? "").slice(0, 500) }}
        output={result as unknown as Record<string, unknown>}
      />

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
        <button className="nova-btn nova-btn-secondary" onClick={goBack}>← Zurück</button>
        <button className="nova-btn nova-btn-primary" onClick={goNext}>Weiter zum Export →</button>
      </div>
    </div>
  );
}

// ── Helper sub-components ──

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3 style={{ margin: "0 0 0.5rem", fontSize: 14, color: tokens.colors.neutral[800], fontWeight: 600 }}>{title}</h3>
      {children}
    </div>
  );
}

const listStyle: React.CSSProperties = { margin: 0, padding: "0 0 0 1.25rem", fontSize: 13, color: tokens.colors.neutral[600], lineHeight: 1.6 };
const liStyle: React.CSSProperties = { marginBottom: 4 };
const th: React.CSSProperties = { padding: "6px 8px", fontSize: 12, fontWeight: 600, color: tokens.colors.neutral[500] };
const td: React.CSSProperties = { padding: "6px 8px" };
