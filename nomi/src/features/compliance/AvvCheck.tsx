import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast, useToast } from "../../components/common/Toast";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import AIPoweredBadge from "../../components/common/AIPoweredBadge";
import { analyzeAvv } from "../../services/ai.service";
import { AvvAssistantResult } from "../../services/ai.provider";
import { tokens } from "../../styles/tokens";

GlobalWorkerOptions.workerSrc = workerSrc;

const AVV_STORAGE_KEY = "nova_avv_last_result_v1";

export default function AvvCheck() {
  const navigate = useNavigate();
  const { messages, addToast, dismissToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // cleanup toasts
      messages.forEach((m) => dismissToast(m.id));
    };
  }, [messages, dismissToast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setError(null);
  };

  async function extractPdfText(pdfFile: File): Promise<string> {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str).join(" ");
      text += `\n\n=== Seite ${i} ===\n${strings}`;
    }
    return text.trim();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Bitte einen PDF-Auftragsverarbeitungsvertrag hochladen.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Nur PDF-Dateien werden unterstützt.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const extractedText = await extractPdfText(file);
      const sizeKB = Math.round(file.size / 1024);

      const result = await analyzeAvv({
        avv: {
          documentText: extractedText,
          fileName: file.name,
          fileSizeKB: sizeKB,
        },
      });

      const parsed: AvvAssistantResult = result;

      localStorage.setItem(
        AVV_STORAGE_KEY,
        JSON.stringify({ fileName: file.name, result: parsed, createdAt: Date.now() })
      );

      addToast("AVV analysiert. Öffne Bericht...", "success", 2000);
      setTimeout(() => navigate("/avv-report"), 500);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
      setError(`Analyse fehlgeschlagen: ${msg}`);
      addToast("Analyse fehlgeschlagen. Bitte erneut versuchen.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem 1rem" }}>
      <Toast messages={messages} onDismiss={dismissToast} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <header style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <h1 style={{ margin: 0, fontSize: "2rem", color: tokens.colors.neutral[800] }}>AV-Vertrag prüfen (DSGVO)</h1>
            <AIPoweredBadge tooltip="KI-gestützte Analyse von Art. 28/32/44ff DSGVO" />
          </div>
          <p style={{ margin: "0.5rem 0 0", color: tokens.colors.neutral[500] }}>
            Lade deinen Auftragsverarbeitungsvertrag (PDF) hoch. Unsere KI prüft Art. 28/32/44ff DSGVO und liefert
            einen kompakten Bericht mit Risiken, fehlenden Klauseln und Empfehlungen.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
          <div
            style={{
              border: `2px dashed ${tokens.colors.brand.primary}`,
              borderRadius: 12,
              padding: "1.5rem",
              textAlign: "center",
              background: "rgba(63,178,146,0.04)",
            }}
          >
            <p style={{ margin: "0 0 0.5rem", color: tokens.colors.neutral[800], fontWeight: 600 }}>PDF hochladen</p>
            <p style={{ margin: "0 0 1rem", color: tokens.colors.neutral[500], fontSize: "14px" }}>
              Unterstützt werden PDF-Dateien bis 10 MB. Inhalte bleiben vertraulich.
            </p>
            <label className="nova-btn nova-btn-primary" style={{ display: "inline-block", cursor: "pointer" }}>
              Datei wählen
              <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: "none" }} />
            </label>
            {file && (
              <div style={{ marginTop: "0.75rem", color: tokens.colors.neutral[800], fontSize: "14px" }}>
                📄 {file.name}
              </div>
            )}
          </div>

          {error && (
            <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(255,244,229,0.8)", backdropFilter: "blur(8px)", borderRadius: 8, color: "#b76e00" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem", gap: "0.75rem" }}>
            <button type="button" className="nova-btn nova-btn-secondary" onClick={() => navigate(-1)} disabled={loading}>
              Abbrechen
            </button>
            <button type="submit" className="nova-btn nova-btn-primary" disabled={loading}>
              {loading ? "Analysiere..." : "Analyse starten"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
