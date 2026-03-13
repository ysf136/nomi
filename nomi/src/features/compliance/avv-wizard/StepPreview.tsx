import type { useAvvWizard } from "./useAvvWizard";
import { tokens } from "../../../styles/tokens";

type Props = { wizard: ReturnType<typeof useAvvWizard> };

export default function StepPreview({ wizard }: Props) {
  const { state, goBack, goNext } = wizard;
  const { fileName, fileSizeKB, pageCount, extractedText } = state;

  const preview = extractedText.slice(0, 2000);
  const truncated = extractedText.length > 2000;

  return (
    <div>
      <h2 style={{ margin: "0 0 0.5rem", color: tokens.colors.neutral[800], fontSize: "1.25rem", fontWeight: 600 }}>
        Schritt 2: Vorschau prüfen
      </h2>
      <p style={{ margin: "0 0 1rem", color: tokens.colors.neutral[500], fontSize: 14 }}>
        Bitte prüfe, ob der extrahierte Text korrekt aussieht, bevor die KI-Analyse startet.
      </p>

      {/* File meta */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
          padding: "0.75rem 1rem",
          background: "rgba(63,178,146,0.06)",
          backdropFilter: "blur(6px)",
          borderRadius: 12,
          fontSize: 13,
          color: tokens.colors.neutral[700],
          border: `1px solid ${tokens.colors.brand.primary}15`,
        }}
      >
        <span><strong>Datei:</strong> {fileName}</span>
        <span><strong>Größe:</strong> {fileSizeKB} KB</span>
        <span><strong>Seiten:</strong> {pageCount}</span>
        <span><strong>Zeichen:</strong> {extractedText.length.toLocaleString("de-DE")}</span>
      </div>

      {/* Extracted text */}
      <div
        style={{
          maxHeight: 360,
          overflowY: "auto",
          border: `1px solid ${tokens.colors.neutral[200]}`,
          borderRadius: 12,
          padding: "1rem",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(6px)",
        }}
        aria-label="Vorschau des extrahierten Textes"
      >
        {preview}
        {truncated && (
          <p style={{ margin: "1rem 0 0", color: tokens.colors.neutral[400], fontStyle: "italic" }}>
            … {(extractedText.length - 2000).toLocaleString("de-DE")} weitere Zeichen (vollständig an KI übergeben)
          </p>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.25rem" }}>
        <button className="nova-btn nova-btn-secondary" onClick={goBack}>← Zurück</button>
        <button className="nova-btn nova-btn-primary" onClick={goNext}>Analyse starten →</button>
      </div>
    </div>
  );
}
