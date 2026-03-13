/**
 * NOVA KI-Assistent - Compliance-Analyse System Prompt
 * Für die intelligente Analyse von Compliance-Anforderungen
 */

export const COMPLIANCE_ANALYSIS_SYSTEM_PROMPT = `
Du bist NOVA, ein spezialisierter KI-Assistent für Datenschutz- und Compliance-Management.
Deine Aufgabe ist es, Unternehmen bei der Einhaltung von DSGVO und AI Act zu unterstützen.

## Deine Expertise:
- DSGVO (Datenschutz-Grundverordnung)
- EU AI Act (Artificial Intelligence Act)
- Risikoanalyse und -bewertung
- Datenschutz-Folgenabschätzung (DSFA)
- Auftragsverarbeitungsverträge (AVV)
- Compliance-Management

## Dein Kommunikationsstil:
- Präzise und faktisch korrekt
- Klare, verständliche Sprache (auch für Nicht-Juristen)
- Strukturierte Antworten mit Handlungsempfehlungen
- Quellen und Rechtsgrundlagen angeben
- Risiken und Konsequenzen transparent aufzeigen

## Deine Antwortstruktur:
1. Zusammenfassung der Situation
2. Rechtliche Bewertung (mit Artikeln/Paragraphen)
3. Risikoeinschätzung (niedrig/mittel/hoch/kritisch)
4. Konkrete Handlungsempfehlungen
5. Nächste Schritte

Antworte immer in deutscher Sprache und bleibe im Kontext des europäischen Datenschutzrechts.
`;

export const COMPLIANCE_ANALYSIS_USER_PROMPT = (context: {
  type: 'ai-system' | 'incident' | 'general';
  data: Record<string, any>;
}) => {
  const { type, data } = context;

  switch (type) {
    case 'ai-system':
      return `
Analysiere folgendes KI-System auf AI Act Compliance:

**System-Informationen:**
- Name: ${data.name || 'Unbekannt'}
- Beschreibung: ${data.description || 'Keine Angabe'}
- Einsatzbereich: ${data.useCases?.join(', ') || 'Nicht spezifiziert'}
- Risiko-Kategorie: ${data.category || 'Zu bewerten'}
- Biometrische Funktionen: ${data.biometricFunctions?.join(', ') || 'Keine'}
- Exposure: ${data.exposure || 'Nicht angegeben'}

Bewerte:
1. AI Act Risikokategorie (Verboten/Hochrisiko/GPAI/Begrenztes Risiko/Minimal)
2. Notwendige Compliance-Maßnahmen
3. Fristen und Deadlines
4. Priorität der Umsetzung
`;

    case 'incident':
      return `
Bewerte folgenden Datenschutzvorfall:

**Vorfall-Informationen:**
- Beschreibung: ${data.description || 'Keine Angabe'}
- Typ: ${data.incidentType || 'Unbekannt'}
- Betroffene Personen: ${data.affectedPeople || 'Nicht spezifiziert'}
- Eingeleitete Maßnahmen: ${data.actionsTaken || 'Keine Angabe'}

Bewerte:
1. Severity (low/medium/high/critical)
2. Meldepflicht gegenüber Aufsichtsbehörde (Art. 33 DSGVO)
3. Benachrichtigungspflicht der Betroffenen (Art. 34 DSGVO)
4. Sofortmaßnahmen
5. Dokumentationspflichten
`;

    case 'general':
    default:
      return `
Datenschutz-/Compliance-Anfrage:

${JSON.stringify(data, null, 2)}

Analysiere die Situation und gib eine fundierte Einschätzung mit konkreten Handlungsempfehlungen.
`;
  }
};

/**
 * Beispiel-Response Format für strukturierte KI-Antworten
 */
export interface ComplianceAnalysisResponse {
  summary: string;
  legalAssessment: {
    applicableLaws: string[];
    articles: string[];
    interpretation: string;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: Array<{
    priority: 'immediate' | 'high' | 'medium' | 'low';
    action: string;
    deadline?: string;
    legalBasis?: string;
  }>;
  nextSteps: string[];
}
