// src/lib/exporters.ts
import { jsPDF } from "jspdf";
// Optional: schöne Tabellen. Wenn nicht installiert, fällt es automatisch auf einfachen Text zurück.
// npm i jspdf-autotable
// @ts-ignore
import autoTable from "jspdf-autotable";

/**
 * JSON-Export: lädt das übergebene Objekt als .json herunter
 */
export function downloadJSON(data: unknown, filename = "ai-act-readiness.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * PDF-Export: erwartet dein Assessment-Objekt aus dem Wizard
 * (das Objekt, das aus assessOrg(...) kommt – in deiner Datei "assessment")
 */
export function downloadPDF(assessment: any, filename = "ai-act-readiness.pdf") {
  const doc = new jsPDF({ unit: "pt" });
  const MARGIN_X = 48;
  const MAX_W = 550; // rechte Seite für Text/Lines
  const LINE_H = 18;

  const addLine = (text: string, y: number, size = 11, bold = false) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(String(text), MARGIN_X, y);
    return y + LINE_H;
  };

  const addHr = (y: number) => {
    doc.setLineWidth(0.6);
    doc.line(MARGIN_X, y, MAX_W, y);
    return y + 16;
  };

  let y = 56;

  // Titel
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("AI Act Readiness – Bericht", MARGIN_X, y);
  y += 8;
  y = addHr(y);

  // Metadaten Header
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  doc.setFont("helvetica", "normal");
  y = addLine(`Erstellt am: ${dateStr}`, y, 10);
  y += 6;

  // Kopf – Organisation
  y = addLine(`Organisation: ${assessment?.org?.name ?? "-"}`, y, 12, true);
  y = addLine(`Branche: ${assessment?.org?.sector ?? "-"}`, y);
  y = addLine(`Größe: ${assessment?.org?.size ?? "-"}`, y);
  const roles = Array.isArray(assessment?.org?.roles) ? assessment.org.roles.join(", ") : "-";
  y = addLine(`Rollen: ${roles}`, y);
  y += 6;

  // Gesamtergebnis
  const score = Math.round(assessment?.readinessScore ?? 0);
  y = addLine(`Gesamt-Score: ${score} / 100`, y, 12, true);
  y = addLine(`Band: ${assessment?.scoreBand ?? "-"}`, y);
  y = addLine(`Scoring-Version: ${assessment?.scoringVersion ?? "-"}`, y);
  y = addHr(y);

  // Systeme → Tabelle, wenn möglich
  const systems = (assessment?.systems ?? []).map((s: any) => ({
    Name: s?.name ?? "-",
    Kategorie: s?.category ?? "-",
    Exposure: s?.exposure ?? "-",
    Score: typeof s?.systemScore === "number" ? String(Math.round(s.systemScore)) : "-",
    Flags: Array.isArray(s?.redFlags) ? s.redFlags.join(" • ") : "",
  }));

  if (systems.length > 0) {
    let usedAutoTable = false;
    try {
      autoTable(doc, {
        startY: y,
        head: [["System", "Kategorie", "Exposure", "Score", "Red Flags"]],
        body: systems.map((r: any) => [r.Name, r.Kategorie, r.Exposure, r.Score, r.Flags]),
        styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
        headStyles: { fillColor: [230, 230, 230] },
        margin: { left: MARGIN_X, right: MARGIN_X },
        tableWidth: MAX_W - MARGIN_X,
      });
      // @ts-ignore - lastAutoTable wird von jspdf-autotable gesetzt
      y = (doc as any).lastAutoTable.finalY + 16;
      usedAutoTable = true;
    } catch {
      // Fallback ohne jspdf-autotable
    }

    if (!usedAutoTable) {
      y = addLine("Systeme:", y, 12, true);
      systems.forEach((r: any) => {
        if (y > 760) { doc.addPage(); y = 56; }
        y = addLine(`• ${r.Name} | ${r.Kategorie} | ${r.Exposure} | Score ${r.Score}`, y);
        if (r.Flags) {
          y = addLine(`   Flags: ${r.Flags}`, y, 9);
        }
      });
      y += 8;
    }
  } else {
    y = addLine("Systeme: –", y);
    y += 8;
  }

  // Priorisierte Maßnahmen – aus Obligations-Objekten zusammensetzen
  const actions = Array.isArray(assessment?.prioritizedActions) ? assessment.prioritizedActions : [];
  if (actions.length > 0) {
    if (y > 720) { doc.addPage(); y = 56; }
    y = addLine("Top-Maßnahmen:", y, 12, true);

    for (const a of actions) {
      const line = [
        a?.label ?? "",
        a?.legalRef ? `– ${a.legalRef}` : "",
        a?.deadline ? ` (bis ${a.deadline})` : "",
      ].join("");
      if (y > 760) { doc.addPage(); y = 56; }
      y = addLine(`• ${line}`, y);
    }
  }

  doc.save(filename);
}
