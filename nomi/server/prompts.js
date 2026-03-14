// ── Few-Shot Helper ─────────────────────────────────────────
function formatExamples(examples, formatInput, formatOutput) {
  if (!examples || examples.length === 0) return "";
  const blocks = examples.map((ex, i) => {
    const inp = formatInput(ex.input);
    const out = typeof ex.output === "string" ? ex.output : JSON.stringify(ex.output, null, 2);
    return `=== Verifizierter Referenzfall ${i + 1} ===\nEingabe:\n${inp}\n\nKorrekte Bewertung:\n${out}`;
  });
  return `\n\nHier sind verifizierte Referenzfaelle aus echten Datenschutzpruefungen. Orientiere dich an Stil, Detailtiefe und Bewertungslogik dieser Beispiele:\n\n${blocks.join("\n\n")}\n\n=== Ende der Referenzfaelle ===\n\nBewerte nun den folgenden neuen Fall:`;
}

// ── Incident ────────────────────────────────────────────────
export const INCIDENT_SYSTEM_PROMPT = `Du bist ein spezialisierter KI-Assistent fuer die Bewertung von Datenschutzvorfaellen nach DSGVO. Antworte strukturiert und praezise.`;

export const INCIDENT_USER_PROMPT = (incident, examples) => {
  const fewShot = formatExamples(
    examples,
    (inp) => `Beschreibung: ${inp.description}\nArt: ${inp.incidentType}\nBetroffene: ${inp.affectedPeople}\nDatum: ${inp.date}`,
    (out) => out,
  );
  return `${fewShot}
Bewerte folgenden Datenschutzvorfall gemaess DSGVO:

Beschreibung: ${incident.description}
Art: ${incident.incidentType}
Betroffene: ${incident.affectedPeople}
Massnahmen: ${incident.actionsTaken || "Keine"}
Datum: ${incident.date} ${incident.time}

Antworte im JSON-Format gemass dem definierten Schema.`;
};

// ── Compliance ──────────────────────────────────────────────
export const COMPLIANCE_SYSTEM_PROMPT = `Du bist NOVA, ein spezialisierter KI-Assistent fuer Datenschutz- und Compliance-Management nach DSGVO und EU AI Act.`;

export const COMPLIANCE_USER_PROMPT = (system, examples) => {
  const fewShot = formatExamples(
    examples,
    (inp) => `Name: ${inp.name}\nBeschreibung: ${inp.description}\nEinsatzbereich: ${(inp.useCases || []).join(", ")}`,
    (out) => out,
  );
  return `${fewShot}
Analysiere folgendes KI-System auf AI Act Compliance:

Name: ${system.name || "Unbekannt"}
Beschreibung: ${system.description || "Keine Angabe"}
Einsatzbereich: ${(system.useCases || []).join(", ") || "Nicht spezifiziert"}
Exposure: ${system.exposure || "Nicht angegeben"}

Bewerte Risiko-Kategorie, Massnahmen, Fristen und Prioritaet.`;
};

// ── AVV ─────────────────────────────────────────────────────
export const AVV_SYSTEM_PROMPT = `Du bist NOVA, ein spezialisierter KI-Assistent fuer die Pruefung von Auftragsverarbeitungsvertraegen (AVV) nach DSGVO, insbesondere Art. 28, Art. 32 und Art. 44 ff. Antworte ausschliesslich als valides JSON ohne Markdown.`;

export const AVV_USER_PROMPT = (avv, examples) => {
  const fewShot = formatExamples(
    examples,
    (inp) => `Dateiname: ${inp.fileName}\nVertragsinhalt (Auszug): ${(inp.documentText || "").slice(0, 500)}...`,
    (out) => out,
  );
  return `${fewShot}
Analysiere den folgenden AVV-Vertrag pragmatisch und rechtlich nachvollziehbar.

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
};
