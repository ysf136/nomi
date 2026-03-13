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
 * CSV-Export: lädt eine Liste von Objekten als .csv herunter
 */
export function downloadCSV(rows: Array<Record<string, unknown>>, filename = "export.csv") {
  if (rows.length === 0) {
    return;
  }

  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>())
  );

  const escapeCell = (value: unknown) => {
    const text = value === undefined || value === null ? "" : String(value);
    const escaped = text.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCell(row[h])).join(","));
  }

  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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

// ── AVV Export ────────────────────────────────────────────────

type AvvExportResult = {
  summary: string;
  conformity_score: number;
  risks: string[];
  missing_clauses: string[];
  recommendations: { item: string; priority: string }[];
  international_transfers: string;
  toms: string;
};

/**
 * PDF-Export für AVV-Prüfungsergebnisse (Art. 28/32/44ff DSGVO)
 */
export function downloadAvvPDF(
  result: AvvExportResult,
  sourceFileName?: string,
  filename = "AVV-Pruefung.pdf"
) {
  const doc = new jsPDF({ unit: "pt" });
  const MX = 48;
  const MAX_W = 550;
  const LH = 16;

  const addLine = (text: string, y: number, size = 10, bold = false) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const lines = doc.splitTextToSize(String(text), MAX_W - MX);
    doc.text(lines, MX, y);
    return y + lines.length * LH;
  };

  const addHr = (y: number) => {
    doc.setLineWidth(0.5);
    doc.line(MX, y, MAX_W, y);
    return y + 12;
  };

  const checkPage = (y: number, needed = 60) => {
    if (y > 760 - needed) {
      doc.addPage();
      return 56;
    }
    return y;
  };

  let y = 56;

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("AVV-Prüfung – DSGVO Art. 28/32/44 ff.", MX, y);
  y += 8;
  y = addHr(y);

  // Meta
  const dateStr = new Date().toISOString().slice(0, 10);
  y = addLine(`Erstellt am: ${dateStr}`, y, 9);
  if (sourceFileName) y = addLine(`Quelldatei: ${sourceFileName}`, y, 9);
  y += 4;

  // Score
  y = addLine(`Konformitätsscore: ${result.conformity_score} / 100`, y, 13, true);
  y += 4;

  // Summary
  y = checkPage(y);
  y = addLine("Zusammenfassung", y, 11, true);
  y = addLine(result.summary, y, 10);
  y += 6;

  // Risks
  if (result.risks.length > 0) {
    y = checkPage(y);
    y = addLine("Identifizierte Risiken", y, 11, true);
    for (const r of result.risks) {
      y = checkPage(y, 20);
      y = addLine(`• ${r}`, y);
    }
    y += 6;
  }

  // Missing clauses
  if (result.missing_clauses.length > 0) {
    y = checkPage(y);
    y = addLine("Fehlende Klauseln", y, 11, true);
    for (const c of result.missing_clauses) {
      y = checkPage(y, 20);
      y = addLine(`• ${c}`, y);
    }
    y += 6;
  }

  // Recommendations table
  if (result.recommendations.length > 0) {
    y = checkPage(y, 80);
    let usedAutoTable = false;
    try {
      autoTable(doc, {
        startY: y,
        head: [["Empfehlung", "Priorität"]],
        body: result.recommendations.map((r) => [r.item, r.priority]),
        styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
        headStyles: { fillColor: [63, 178, 146] },
        margin: { left: MX, right: MX },
        tableWidth: MAX_W - MX,
      });
      // @ts-ignore
      y = (doc as any).lastAutoTable.finalY + 16;
      usedAutoTable = true;
    } catch {
      /* fallback */
    }
    if (!usedAutoTable) {
      y = addLine("Handlungsempfehlungen", y, 11, true);
      for (const r of result.recommendations) {
        y = checkPage(y, 20);
        y = addLine(`• [${r.priority}] ${r.item}`, y);
      }
      y += 6;
    }
  }

  // International transfers
  y = checkPage(y, 40);
  y = addLine("Internationale Datenübermittlung (Art. 44 ff.)", y, 11, true);
  y = addLine(result.international_transfers, y, 10);
  y += 6;

  // TOMs
  y = checkPage(y, 40);
  y = addLine("Technische & organisatorische Maßnahmen (Art. 32)", y, 11, true);
  y = addLine(result.toms, y, 10);
  y += 6;

  // Art.22 disclaimer
  y = checkPage(y, 50);
  y = addHr(y);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  const disclaimer = "Hinweis gem. Art. 22 DSGVO: Diese Analyse ist eine KI-gestützte Empfehlung und stellt keine automatisierte Einzelentscheidung dar. Die finale Beurteilung obliegt dem/der zuständigen Datenschutzbeauftragten.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, MAX_W - MX);
  doc.text(disclaimerLines, MX, y);

  doc.save(filename);
}

/**
 * JSON-Export für AVV-Prüfungsergebnisse mit Metadaten
 */
export function downloadAvvJSON(
  result: AvvExportResult,
  caseId?: string,
  filename = "AVV-Pruefung.json"
) {
  const payload = {
    meta: {
      type: "avv-pruefung",
      version: "1.0",
      generatedAt: new Date().toISOString(),
      caseId: caseId ?? null,
      disclaimer:
        "Hinweis gem. Art. 22 DSGVO: Diese Analyse ist eine KI-gestützte Empfehlung und stellt keine automatisierte Einzelentscheidung dar.",
    },
    result,
  };
  downloadJSON(payload, filename);
}
