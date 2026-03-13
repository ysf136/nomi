export const INCIDENT_SYSTEM_PROMPT = `Du bist ein spezialisierter KI-Assistent fuer die Bewertung von Datenschutzvorfaellen nach DSGVO. Antworte strukturiert und praezise.`;

export const INCIDENT_USER_PROMPT = (incident) => `Bewerte folgenden Datenschutzvorfall gemaess DSGVO:

Beschreibung: ${incident.description}
Art: ${incident.incidentType}
Betroffene: ${incident.affectedPeople}
Massnahmen: ${incident.actionsTaken || "Keine"}
Datum: ${incident.date} ${incident.time}

Antworte im JSON-Format gemass dem definierten Schema.`;

export const COMPLIANCE_SYSTEM_PROMPT = `Du bist NOVA, ein spezialisierter KI-Assistent fuer Datenschutz- und Compliance-Management nach DSGVO und EU AI Act.`;

export const COMPLIANCE_USER_PROMPT = (system) => `Analysiere folgendes KI-System auf AI Act Compliance:

Name: ${system.name || "Unbekannt"}
Beschreibung: ${system.description || "Keine Angabe"}
Einsatzbereich: ${(system.useCases || []).join(", ") || "Nicht spezifiziert"}
Exposure: ${system.exposure || "Nicht angegeben"}

Bewerte Risiko-Kategorie, Massnahmen, Fristen und Prioritaet.`;

export const AVV_SYSTEM_PROMPT = `Du bist NOVA, ein spezialisierter KI-Assistent fuer die Pruefung von Auftragsverarbeitungsvertraegen (AVV) nach DSGVO, insbesondere Art. 28, Art. 32 und Art. 44 ff. Antworte ausschliesslich als valides JSON ohne Markdown.`;

export const AVV_USER_PROMPT = (avv) => `Analysiere den folgenden AVV-Vertrag pragmatisch und rechtlich nachvollziehbar.

Dateiname: ${avv.fileName}
Dateigroesse (KB): ${avv.fileSizeKB || "Unbekannt"}
Vertragsinhalt:
${avv.documentText}

Gib ein JSON mit genau diesen Feldern zurueck:
- summary: string
- conformity_score: number (0-100)
- risks: string[]
- missing_clauses: string[]
- recommendations: Array<{ item: string; priority: "hoch" | "mittel" | "niedrig" }>
- international_transfers: string
- toms: string`;
