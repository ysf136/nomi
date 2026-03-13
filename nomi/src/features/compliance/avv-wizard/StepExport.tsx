import { useState } from "react";
import { downloadAvvPDF, downloadAvvJSON } from "../../../lib/exporters";
import type { useAvvWizard } from "./useAvvWizard";
import { tokens } from "../../../styles/tokens";

type Props = { wizard: ReturnType<typeof useAvvWizard> };

export default function StepExport({ wizard }: Props) {
  const { state, reset } = wizard;
  const { analysisResult, avvCaseId, fileName } = state;
  const [exported, setExported] = useState<string[]>([]);

  if (!analysisResult) {
    return <p style={{ padding: "2rem", textAlign: "center", color: tokens.colors.neutral[400] }}>Kein Ergebnis zum Exportieren.</p>;
  }

  const handlePdf = () => {
    downloadAvvPDF(analysisResult, fileName, `AVV-Pruefung-${avvCaseId ?? "lokal"}.pdf`);
    setExported((p) => [...new Set([...p, "pdf"])]);
  };

  const handleJson = () => {
    downloadAvvJSON(analysisResult, avvCaseId ?? undefined, `AVV-Pruefung-${avvCaseId ?? "lokal"}.json`);
    setExported((p) => [...new Set([...p, "json"])]);
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 0.5rem", color: tokens.colors.neutral[800], fontSize: "1.25rem", fontWeight: 600 }}>
        Schritt 5: Speichern & Export
      </h2>
      <p style={{ margin: "0 0 1.25rem", color: tokens.colors.neutral[500], fontSize: 14 }}>
        Dein Prüfergebnis wurde in Firestore gespeichert. Du kannst es zusätzlich als PDF oder JSON exportieren.
      </p>

      {/* Case link */}
      {avvCaseId && (
        <div style={{ padding: "0.75rem 1rem", background: "rgba(63,178,146,0.06)", borderRadius: 12, marginBottom: "1rem", fontSize: 13, border: `1px solid ${tokens.colors.brand.primary}15` }}>
          <strong>Fall-ID:</strong> <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: "rgba(0,0,0,0.04)", padding: "1px 6px", borderRadius: 4 }}>{avvCaseId}</code>
          {" · "}
          <a href={`/avv-report/${avvCaseId}`} style={{ color: tokens.colors.brand.primary, fontWeight: 600 }}>
            Zum Bericht →
          </a>
        </div>
      )}

      {/* Export buttons */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <ExportButton label="PDF herunterladen" icon="📄" onClick={handlePdf} done={exported.includes("pdf")} />
        <ExportButton label="JSON herunterladen" icon="💾" onClick={handleJson} done={exported.includes("json")} />
      </div>

      {/* Art.22 disclaimer */}
      <div style={{ padding: "0.6rem 1rem", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12, fontSize: 12, color: tokens.colors.neutral[600], marginBottom: "1.5rem" }}>
        <strong>Hinweis gem. Art. 22 DSGVO:</strong> Diese Analyse ist eine KI-gestützte Empfehlung und stellt keine automatisierte Einzelentscheidung dar.
        Die finale Beurteilung obliegt dem/der zuständigen Datenschutzbeauftragten.
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <a href="/avv-cases" className="nova-btn nova-btn-secondary" style={{ textDecoration: "none" }}>
          Alle AVV-Fälle →
        </a>
        <button className="nova-btn nova-btn-primary" onClick={reset}>
          Neuen Vertrag prüfen
        </button>
      </div>
    </div>
  );
}

function ExportButton({ label, icon, onClick, done }: { label: string; icon: string; onClick: () => void; done: boolean }) {
  return (
    <button
      onClick={onClick}
      className={done ? "nova-btn nova-btn-primary" : "nova-btn nova-btn-secondary"}
      style={{ display: "flex", alignItems: "center", gap: 8 }}
    >
      <span>{icon}</span> {done ? `${label} ✓` : label}
    </button>
  );
}
