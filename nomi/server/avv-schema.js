import { z } from "zod";

export const AVV_SCHEMA_VERSION = "1.0.0";

// Pflichtinhalte nach Art. 28 DSGVO, die pro AVV einzeln geprueft werden.
export const ART28_CHECKLIST = [
  { id: "subject_duration", label: "Gegenstand und Dauer der Verarbeitung", ref: "Art. 28 Abs. 3 S. 1" },
  { id: "nature_purpose", label: "Art und Zweck der Verarbeitung", ref: "Art. 28 Abs. 3 S. 1" },
  { id: "data_categories", label: "Art der Daten und Kategorien betroffener Personen", ref: "Art. 28 Abs. 3 S. 1" },
  { id: "instructions", label: "Weisungsgebundenheit", ref: "Art. 28 Abs. 3 lit. a" },
  { id: "confidentiality", label: "Vertraulichkeitsverpflichtung", ref: "Art. 28 Abs. 3 lit. b" },
  { id: "toms", label: "Technische und organisatorische Massnahmen", ref: "Art. 28 Abs. 3 lit. c, Art. 32" },
  { id: "subprocessors", label: "Unterauftragsverarbeiter", ref: "Art. 28 Abs. 2 und 4" },
  { id: "data_subject_rights", label: "Unterstuetzung bei Betroffenenrechten", ref: "Art. 28 Abs. 3 lit. e" },
  { id: "assistance", label: "Unterstuetzung bei Art. 32-36 (Meldepflichten, DSFA)", ref: "Art. 28 Abs. 3 lit. f" },
  { id: "deletion_return", label: "Loeschung oder Rueckgabe nach Vertragsende", ref: "Art. 28 Abs. 3 lit. g" },
  { id: "audit_rights", label: "Nachweis- und Kontrollrechte", ref: "Art. 28 Abs. 3 lit. h" },
  { id: "third_countries", label: "Drittlandtransfer", ref: "Art. 44 ff." },
];

const checklistIds = ART28_CHECKLIST.map((c) => c.id);

export const avvFindingSchema = z.object({
  id: z.enum(checklistIds),
  status: z.enum(["erfuellt", "teilweise", "fehlt"]),
  risk: z.enum(["hoch", "mittel", "niedrig"]),
  quote: z.string().default(""),
  page: z.number().int().positive().optional(),
  recommendation: z.string().default(""),
});

export const avvReportSchema = z.object({
  schemaVersion: z.string().default(AVV_SCHEMA_VERSION),
  summary: z.string(),
  conformity_score: z.number().min(0).max(100),
  traffic_light: z.enum(["gruen", "gelb", "rot"]),
  confidence: z.number().min(0).max(1),
  findings: z.array(avvFindingSchema),
});

// Prueft, dass ein Zitat tatsaechlich im Originaltext vorkommt (Halluzinationsschutz).
export function quoteExists(documentText, quote) {
  if (!quote) return false;
  const norm = (t) => t.replace(/\s+/g, " ").trim().toLowerCase();
  return norm(documentText).includes(norm(quote));
}
