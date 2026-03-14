import { IncidentCreateRequest } from "../types/api";
import { ComplianceAssessment } from "../types/models";
import { withRetry, CircuitBreaker } from "../lib/error-recovery";
import { logAuditEvent } from "./audit.service";
import {
  AiProvider,
  createDefaultAiProvider,
  IncidentAssistantResult,
  AvvAssistantResult,
  FewShotExample,
} from "./ai.provider";
import { getGoldenExamples, GoldenDomain } from "./golden-examples.service";

async function loadExamples(domain: GoldenDomain): Promise<FewShotExample[]> {
  try {
    const examples = await getGoldenExamples(domain, true, 3);
    return examples.map((e) => ({ input: e.input, output: e.output }));
  } catch {
    return [];
  }
}

const aiCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  successThreshold: 2,
  timeoutMs: 20000,
});

const provider: AiProvider = createDefaultAiProvider();

const FALLBACK_MEASURES = [
  "Sachverhalt intern dokumentieren",
  "Datenzugriff sofort prüfen und absichern",
  "Datenschutzbeauftragten informieren",
];

function buildFallbackAvvResult(): AvvAssistantResult {
  return {
    summary: "Fallback-Analyse: AVV-KI-Analyse war nicht verfuegbar. Manuelle Pruefung erforderlich.",
    conformity_score: 0,
    risks: ["Automatische Bewertung aktuell nicht verfuegbar"],
    missing_clauses: ["Manuelle Vollpruefung nach Art. 28/32/44ff erforderlich"],
    recommendations: [
      { item: "Vertrag durch Datenschutzexpert:in manuell pruefen", priority: "hoch" },
      { item: "TOMs und Unterauftragsverarbeiter gesondert validieren", priority: "mittel" },
    ],
    international_transfers: "Nicht bewertet",
    toms: "Nicht bewertet",
  };
}

function mapSeverityToRisk(severity?: IncidentCreateRequest["severity"]): IncidentAssistantResult["risk_level"] {
  switch (severity) {
    case "high":
    case "critical":
      return "hoch";
    case "medium":
      return "mittel";
    case "low":
    default:
      return "niedrig";
  }
}

function buildFallbackIncidentResult(
  incident: IncidentCreateRequest,
  description: string
): IncidentAssistantResult {
  const risk = mapSeverityToRisk(incident.severity);
  const art33Required = risk !== "niedrig";
  const art34Required = risk === "hoch";

  return {
    summary: "Fallback-Analyse: Automatische KI-Analyse war nicht verfuegbar.",
    data_categories: [],
    data_subjects: {
      gruppen: [],
      anzahl: incident.affectedPeople || "Unbekannt",
    },
    cia_impact: {
      confidentiality: "Nicht bewertet",
      integrity: "Nicht bewertet",
      availability: "Nicht bewertet",
    },
    tom_relevance: [],
    risk_level: risk,
    art33_required: art33Required,
    art33_reasoning: art33Required
      ? "Risiko fuer Rechte und Freiheiten kann nicht ausgeschlossen werden."
      : "Derzeit kein erkennbares hohes Risiko.",
    art34_required: art34Required,
    art34_reasoning: art34Required
      ? "Hohes Risiko fuer betroffene Personen moeglich."
      : "Kein unmittelbares hohes Risiko ersichtlich.",
    measures: FALLBACK_MEASURES,
    open_points: [
      "Detailanalyse durch einen Experten erforderlich.",
      "Ergaenzende Informationen zur Datenkategorie bereitstellen.",
    ],
    legal_analysis: "Fallback-Analyse basierend auf den bereitgestellten Angaben.",
    doc_text: description,
  };
}

export async function analyzeIncident(input: {
  description: string;
  incident: IncidentCreateRequest;
  userId?: string;
  incidentId?: string;
}): Promise<IncidentAssistantResult> {
  return aiCircuitBreaker.execute(async () => {
    try {
      const examples = await loadExamples("incident");
      const result = await withRetry(
        () => provider.analyzeIncident({ description: input.description, incident: input.incident as unknown as Record<string, unknown>, examples }),
        { retries: 2, baseDelayMs: 600 }
      );

      await logAuditEvent({
        userId: input.userId ?? "system",
        action: "ai-analysis",
        entityType: "incident",
        entityId: input.incidentId ?? "local",
        aiProvider: provider.name,
        aiModel: provider.model,
        aiDecision: result,
      });

      return result;
    } catch (error) {
      const fallback = buildFallbackIncidentResult(input.incident, input.description);
      await logAuditEvent({
        userId: input.userId ?? "system",
        action: "ai-analysis",
        entityType: "incident",
        entityId: input.incidentId ?? "local",
        aiProvider: "mock",
        aiDecision: fallback,
      });
      return fallback;
    }
  });
}

export async function assessCompliance(input: {
  system: Record<string, unknown>;
  userId?: string;
  systemId?: string;
}): Promise<ComplianceAssessment> {
  return aiCircuitBreaker.execute(async () => {
    try {
      const complianceExamples = await loadExamples("compliance");
      const result = await withRetry(
        () => provider.assessCompliance({ system: input.system as unknown as Record<string, unknown>, examples: complianceExamples }),
        { retries: 2, baseDelayMs: 600 }
      );

      await logAuditEvent({
        userId: input.userId ?? "system",
        action: "ai-analysis",
        entityType: "compliance",
        entityId: input.systemId ?? "local",
        aiProvider: provider.name,
        aiModel: provider.model,
        aiDecision: result as unknown as Record<string, unknown>,
      });

      return result;
    } catch (error) {
      const fallback: ComplianceAssessment = {
        category: "LimitedRisk",
        summary: "Fallback-Analyse: KI-Analyse war nicht verfuegbar.",
        legalReferences: ["DSGVO", "EU AI Act"],
        obligations: ["Manuelle Bewertung durch Experten erforderlich."],
        deadlines: [],
        priority: "medium",
      };

      await logAuditEvent({
        userId: input.userId ?? "system",
        action: "ai-analysis",
        entityType: "compliance",
        entityId: input.systemId ?? "local",
        aiProvider: "mock",
        aiDecision: fallback as unknown as Record<string, unknown>,
      });

      return fallback;
    }
  });
}

export async function analyzeAvv(input: {
  avv: {
    documentText: string;
    fileName: string;
    fileSizeKB?: number;
  };
  userId?: string;
  avvId?: string;
}): Promise<AvvAssistantResult> {
  return aiCircuitBreaker.execute(async () => {
    try {
      const avvExamples = await loadExamples("avv");
      const result = await withRetry(
        () => provider.analyzeAvv({ avv: input.avv, examples: avvExamples }),
        { retries: 2, baseDelayMs: 600 }
      );

      await logAuditEvent({
        userId: input.userId ?? "system",
        action: "ai-analysis",
        entityType: "avv",
        entityId: input.avvId ?? "local",
        aiProvider: provider.name,
        aiModel: provider.model,
        aiDecision: result,
      });

      return result;
    } catch (error) {
      const fallback = buildFallbackAvvResult();
      await logAuditEvent({
        userId: input.userId ?? "system",
        action: "ai-analysis",
        entityType: "avv",
        entityId: input.avvId ?? "local",
        aiProvider: "mock",
        aiDecision: fallback,
      });

      return fallback;
    }
  });
}
