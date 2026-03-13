import { useState, useRef } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { useAvvWizard } from "./useAvvWizard";
import { tokens } from "../../../styles/tokens";

GlobalWorkerOptions.workerSrc = workerSrc;

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

type Props = { wizard: ReturnType<typeof useAvvWizard> };

export default function StepUpload({ wizard }: Props) {
  const { setFile, goNext, setError } = wizard;
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (file: File): string | null => {
    if (file.type !== "application/pdf") return "Nur PDF-Dateien werden unterstützt.";
    if (file.size > MAX_SIZE_BYTES) return `Datei ist zu groß (max. ${MAX_SIZE_MB} MB).`;
    return null;
  };

  const processFile = async (file: File) => {
    const err = validate(file);
    if (err) { setError(err); return; }

    setProcessing(true);
    setSelectedFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str).join(" ");
        text += `\n\n=== Seite ${i} ===\n${strings}`;
      }
      const trimmed = text.trim();

      if (trimmed.length < 50) {
        setError("Der extrahierte Text ist zu kurz. Bitte ein maschinenlesbares PDF verwenden (kein Scan).");
        setProcessing(false);
        return;
      }

      setFile(file, trimmed, pdf.numPages);
      goNext();
    } catch (e) {
      console.error("PDF extraction failed", e);
      setError("PDF konnte nicht gelesen werden. Bitte ein gültiges PDF verwenden.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 0.5rem", color: tokens.colors.neutral[800], fontSize: "1.25rem", fontWeight: 600 }}>
        Schritt 1: PDF hochladen
      </h2>
      <p style={{ margin: "0 0 1.25rem", color: tokens.colors.neutral[500], fontSize: 14 }}>
        Lade deinen Auftragsverarbeitungsvertrag als PDF hoch. Inhalte bleiben vertraulich.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        role="button"
        tabIndex={0}
        aria-label="PDF-Datei hochladen per Klick oder Drag and Drop"
        style={{
          border: `2px dashed ${dragOver ? tokens.colors.brand.secondary : tokens.colors.brand.primary}`,
          borderRadius: 16,
          padding: "2.5rem 1.5rem",
          textAlign: "center",
          background: dragOver ? "rgba(63,178,146,0.08)" : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(8px)",
          cursor: processing ? "wait" : "pointer",
          transition: tokens.transitions.base,
          boxShadow: dragOver ? `0 0 20px ${tokens.colors.brand.primary}20` : "none",
        }}
      >
        <input ref={inputRef} type="file" accept="application/pdf" onChange={handleChange} style={{ display: "none" }} aria-hidden="true" />

        {processing ? (
          <div>
            <div className="nova-spinner" style={{ width: 36, height: 36, margin: "0 auto 12px" }} />
            <p style={{ margin: 0, fontWeight: 600, color: tokens.colors.neutral[800] }}>PDF wird eingelesen…</p>
            <p style={{ margin: "0.25rem 0 0", color: tokens.colors.neutral[400], fontSize: 13 }}>{selectedFile?.name}</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
            <p style={{ margin: 0, fontWeight: 600, color: tokens.colors.neutral[800] }}>PDF hierher ziehen oder klicken</p>
            <p style={{ margin: "0.5rem 0 0", color: tokens.colors.neutral[400], fontSize: 13 }}>
              PDF-Dateien bis {MAX_SIZE_MB} MB · Maschinenlesbar (kein Scan)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
