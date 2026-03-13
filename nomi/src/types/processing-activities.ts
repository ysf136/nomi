/**
 * Verzeichnis der Verarbeitungstätigkeiten (VVT)
 * DSGVO Art. 30 - Dokumentationspflicht
 */

export interface ProcessingActivity {
  id: string;
  name: string; // z.B. "Kundenverwaltung"
  purpose: string; // Zweck der Verarbeitung
  legalBasis: string; // Rechtsgrundlage (z.B. Vertragserfüllung)
  dataCategories: string[]; // Kategorien von Daten (Name, E-Mail, etc.)
  dataSubjects: string[]; // Betroffene Kategorien (Kunden, Mitarbeiter, etc.)
  recipients: string[]; // Empfänger der Daten
  retentionPeriod: string; // Aufbewahrungsdauer
  securityMeasures: string[]; // Sicherheitsmaßnahmen
  internationalTransfer: boolean; // Transfer außerhalb EU/EWR?
  transferMechanism?: string; // z.B. Standardvertragsklauseln
  subProcessors: string[]; // Auftragsverarbeiter
  riskAssessment?: string; // Datenschutzfolgeabschätzung erforderlich?
  status: "draft" | "completed" | "review"; // Status
  lastUpdated: string; // ISO-String
  createdAt: string; // ISO-String
  notes?: string; // Zusätzliche Notizen
}

export interface ProcessingActivitysRegistry {
  registryId: string;
  companyId: string;
  activities: ProcessingActivity[];
  lastReviewedAt?: string;
  approvedBy?: string;
  version: number;
}

export const DATA_CATEGORIES = [
  "Identifikationsdaten",
  "Kontaktdaten",
  "Finanzdaten",
  "Gesundheitsdaten",
  "Standortdaten",
  "Biometrische Daten",
  "Verhaltnis- und Präferenzangaben",
  "Gerichtliche und Verwaltungsentscheidungen",
  "Strafrechtliche Informationen",
  "Andere spezielle Kategorien",
];

export const DATA_SUBJECTS = [
  "Kunden",
  "Mitarbeiter",
  "Bewerber",
  "Lieferanten",
  "Partner",
  "Website-Besucher",
  "Geschäftskontakte",
];

export const LEGAL_BASES = [
  "Vertragserfüllung (Art. 6 Abs. 1 B DSGVO)",
  "Rechtliche Verpflichtung (Art. 6 Abs. 1 C DSGVO)",
  "Lebenswichtige Interessen (Art. 6 Abs. 1 D DSGVO)",
  "Öffentliche Aufgabe (Art. 6 Abs. 1 E DSGVO)",
  "Berechtigte Interessen (Art. 6 Abs. 1 F DSGVO)",
  "Einwilligung (Art. 6 Abs. 1 A DSGVO)",
];

export const RETENTION_PERIODS = [
  "0,5 Jahre",
  "1 Jahr",
  "2 Jahre",
  "3 Jahre",
  "5 Jahre",
  "7 Jahre",
  "10 Jahre",
  "Solange erforderlich",
  "Nach Vertragsende",
];

export const SECURITY_MEASURES = [
  "Verschlüsselung",
  "Pseudonymisierung",
  "Anonymisierung",
  "Zugriffskontrolle",
  "Authentifizierung",
  "Audit-Logging",
  "Firewalls",
  "Sicherheits-Updates",
  "Mitarbeiterschulung",
  "Incident-Response-Plan",
];

export const TRANSFER_MECHANISMS = [
  "Standardvertragsklauseln",
  "Binding Corporate Rules (BCR)",
  "Angemessenheitsbeschluss EU",
  "Derogation",
];
