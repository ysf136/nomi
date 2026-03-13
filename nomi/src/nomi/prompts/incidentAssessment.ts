/**
 * NOVA KI-Assistent - Vorfall-Bewertung System Prompt
 * Für die automatische Severity-Einschätzung von Datenschutzvorfällen
 */

export const INCIDENT_ASSESSMENT_SYSTEM_PROMPT = `
Du bist ein spezialisierter KI-Assistent für die Bewertung von Datenschutzvorfällen nach DSGVO.
Deine Aufgabe ist es, Vorfälle schnell und präzise zu kategorisieren und Handlungsempfehlungen zu geben.

## Bewertungskriterien nach Art. 33/34 DSGVO:

### Critical (Kritisch):
- Massenhafte Offenlegung sensibler Daten (Gesundheit, biometrisch, strafrechtlich)
- Ransomware mit Datenverschlüsselung/-verlust
- Identitätsdiebstahl möglich
- Hohe Wahrscheinlichkeit für erhebliche Schäden
- Sofortige Meldung an Aufsichtsbehörde UND Betroffene erforderlich

### High (Hoch):
- Unbefugter Zugriff auf personenbezogene Daten
- Datenlecks mit potenziellen Risiken für Betroffene
- Verlust von Datenträgern mit unverschlüsselten Daten
- Meldung an Aufsichtsbehörde innerhalb 72 Stunden
- Ggf. Benachrichtigung Betroffener

### Medium (Mittel):
- Versehentliche Offenlegung begrenzter Daten
- Technische Fehler ohne Datenverlust
- Kurzzeitiger unbefugter Zugriff
- Interne Dokumentation erforderlich
- Meldung nur bei Risiko für Betroffene

### Low (Niedrig):
- Kleinere Verstöße ohne Außenwirkung
- Interne Prozessfehler
- Keine oder minimale Auswirkungen auf Betroffene
- Dokumentation für interne Zwecke

## Meldepflichten:
- **Art. 33 DSGVO**: Meldung an Aufsichtsbehörde innerhalb 72h (bei Risiko)
- **Art. 34 DSGVO**: Benachrichtigung Betroffener (bei hohem Risiko)
- **Dokumentation**: Vorfallsregister gemäß Art. 33 Abs. 5 DSGVO

Antworte strukturiert mit:
1. Severity-Einstufung
2. Meldepflichten (Ja/Nein mit Begründung)
3. Fristen
4. Sofortmaßnahmen
5. Dokumentationspflichten
`;

export const INCIDENT_ASSESSMENT_USER_PROMPT = (incident: {
  description: string;
  incidentType: string;
  affectedPeople: string;
  severity?: string;
  actionsTaken: string;
  date: string;
}) => `
Bewerte folgenden Datenschutzvorfall gemäß DSGVO:

**Vorfall-Details:**
- **Datum/Uhrzeit**: ${incident.date}
- **Art des Vorfalls**: ${incident.incidentType}
- **Beschreibung**: ${incident.description}
- **Betroffene Personen/Anzahl**: ${incident.affectedPeople}
- **Bereits eingeleitete Maßnahmen**: ${incident.actionsTaken || 'Keine Angabe'}

**Deine Aufgaben:**
1. Bestimme die Severity-Stufe (low/medium/high/critical)
2. Prüfe Meldepflicht nach Art. 33 DSGVO (Aufsichtsbehörde)
3. Prüfe Benachrichtigungspflicht nach Art. 34 DSGVO (Betroffene)
4. Gib konkrete Sofortmaßnahmen
5. Liste erforderliche Dokumentation auf
6. Nenne einzuhaltende Fristen

Antworte im JSON-Format gemäß dem definierten Schema.
`;

/**
 * Response-Schema für Incident Assessment
 */
export interface IncidentAssessmentResponse {
  severity: 'low' | 'medium' | 'high' | 'critical';
  severityExplanation: string;
  
  reportingObligations: {
    supervisoryAuthority: {
      required: boolean;
      deadline: string;
      legalBasis: string;
      reasoning: string;
    };
    dataSubjects: {
      required: boolean;
      deadline: string;
      legalBasis: string;
      reasoning: string;
    };
  };

  immediateActions: Array<{
    priority: number;
    action: string;
    responsible: string;
    deadline: string;
  }>;

  documentation: {
    required: string[];
    vorfallsregister: boolean;
    additionalNotes: string;
  };

  riskAssessment: {
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    affectedRights: string[];
  };
}

/**
 * Mock-Funktion für KI-Analyse (später durch echte API ersetzen)
 */
export function analyzeIncidentWithAI(incident: any): Promise<IncidentAssessmentResponse> {
  return new Promise((resolve) => {
    // Simuliere API-Call
    setTimeout(() => {
      // Einfache Logik zur Demo (später echte KI)
      const severityMap: Record<string, IncidentAssessmentResponse['severity']> = {
        'low': 'low',
        'medium': 'medium',
        'high': 'high',
        'critical': 'critical',
      };

      resolve({
        severity: severityMap[incident.severity] || 'medium',
        severityExplanation: `Der Vorfall wurde als ${incident.severity} eingestuft basierend auf den Angaben.`,
        reportingObligations: {
          supervisoryAuthority: {
            required: incident.severity === 'high' || incident.severity === 'critical',
            deadline: '72 Stunden nach Kenntnisnahme',
            legalBasis: 'Art. 33 DSGVO',
            reasoning: 'Risiko für Rechte und Freiheiten betroffener Personen',
          },
          dataSubjects: {
            required: incident.severity === 'critical',
            deadline: 'Unverzüglich',
            legalBasis: 'Art. 34 DSGVO',
            reasoning: 'Hohes Risiko für Rechte und Freiheiten',
          },
        },
        immediateActions: [
          {
            priority: 1,
            action: 'Vorfall eindämmen und weitere Datenverluste verhindern',
            responsible: 'IT-Security Team',
            deadline: 'Sofort',
          },
          {
            priority: 2,
            action: 'Datenschutzbeauftragten informieren',
            responsible: 'Meldender',
            deadline: 'Innerhalb 24h',
          },
        ],
        documentation: {
          required: ['Vorfallsdokumentation', 'Maßnahmenprotokoll', 'Betroffenenliste'],
          vorfallsregister: true,
          additionalNotes: 'Dokumentation gemäß Art. 33 Abs. 5 DSGVO erforderlich',
        },
        riskAssessment: {
          likelihood: 'medium',
          impact: 'medium',
          affectedRights: ['Recht auf informationelle Selbstbestimmung'],
        },
      });
    }, 800);
  });
}
