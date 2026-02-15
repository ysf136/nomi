import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast, useToast } from "../../components/common/Toast";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

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

      const prompt = `Du bist ein Datenschutz-Pruefer. Analysiere den folgenden Auftragsverarbeitungsvertrag (AVV) auf DSGVO-Konformitaet (insb. Art. 28, 32, 44ff). Liefere ein JSON mit Feldern: summary (string), conformity_score (0-100), risks (string[]), missing_clauses (string[]), recommendations (array mit {item, priority: "hoch"|"mittel"|"niedrig"}), international_transfers (string), toms (string). Sei kurz und pragmatisch. Dokument: ${file.name} (${sizeKB} KB). Inhalt: ${extractedText}`;

      const res = await fetch("/api/incident-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: prompt }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      let parsed: any = result;
      if (typeof result === "string") {
        const match = result.match(/\{[\s\S]*\}/);
        if (match) {
          try { parsed = JSON.parse(match[0]); } catch (err) { parsed = { raw: result }; }
        } else {
          parsed = { raw: result };
        }
      }

      localStorage.setItem(
        AVV_STORAGE_KEY,
        JSON.stringify({ fileName: file.name, result: parsed, raw: result, createdAt: Date.now() })
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa 0%, #f0f7f5 100%)", padding: "2rem 1rem" }}>
      <Toast messages={messages} onDismiss={dismissToast} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <header style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "2rem", color: "#183939" }}>AV-Vertrag prüfen (DSGVO)</h1>
          <p style={{ margin: "0.5rem 0 0", color: "#555" }}>
            Lade deinen Auftragsverarbeitungsvertrag (PDF) hoch. Unsere KI prüft Art. 28/32/44ff DSGVO und liefert
            einen kompakten Bericht mit Risiken, fehlenden Klauseln und Empfehlungen.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            borderRadius: 16,
            padding: "1.5rem",
            boxShadow: "0 12px 30px rgba(24,57,57,0.08)",
            border: "1px solid #e0e4ea",
          }}
        >
          <div
            style={{
              border: "2px dashed #3FB292",
              borderRadius: 12,
              padding: "1.5rem",
              textAlign: "center",
              background: "#f7fbf9",
            }}
          >
            <p style={{ margin: "0 0 0.5rem", color: "#183939", fontWeight: 600 }}>PDF hochladen</p>
            <p style={{ margin: "0 0 1rem", color: "#666", fontSize: "14px" }}>
              Unterstützt werden PDF-Dateien bis 10 MB. Inhalte bleiben vertraulich.
            </p>
            <label
              style={{
                display: "inline-block",
                padding: "0.75rem 1.25rem",
                background: "linear-gradient(135deg, #3FB292, #2d9d7f)",
                color: "white",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
                boxShadow: "0 8px 18px rgba(63,178,146,0.25)",
              }}
            >
              Datei wählen
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
            {file && (
              <div style={{ marginTop: "0.75rem", color: "#183939", fontSize: "14px" }}>
                📄 {file.name}
              </div>
            )}
          </div>

          {error && (
            <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#fff4e5", borderRadius: 8, color: "#b76e00" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                padding: "0.75rem 1.1rem",
                borderRadius: 10,
                border: "1px solid #e0e4ea",
                background: "white",
                color: "#183939",
                cursor: "pointer",
              }}
              disabled={loading}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.8rem 1.4rem",
                borderRadius: 10,
                border: "none",
                background: loading ? "#9fd7c4" : "linear-gradient(135deg, #3FB292, #2d9d7f)",
                color: "white",
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 10px 20px rgba(63,178,146,0.28)",
              }}
            >
              {loading ? "Analysiere..." : "Analyse starten"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
