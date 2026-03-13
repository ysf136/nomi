import { ApiClient } from "./api.client";
import { ComplianceAssessment } from "../types/models";
import { env } from "../lib/env";

export type IncidentAssistantResult = {
  summary: string;
  data_categories: string[];
  data_subjects: { gruppen: string[]; anzahl: string };
  cia_impact: { confidentiality: string; integrity: string; availability: string };
  tom_relevance: string[];
  risk_level: "niedrig" | "mittel" | "hoch";
  art33_required: boolean;
  art33_reasoning: string;
  art34_required: boolean;
  art34_reasoning: string;
  measures: string[];
  open_points: string[];
  legal_analysis: string;
  doc_text: string;
};

export type AvvRecommendation = {
  item: string;
  priority: "hoch" | "mittel" | "niedrig";
};

export type AvvAssistantResult = {
  summary: string;
  conformity_score: number;
  risks: string[];
  missing_clauses: string[];
  recommendations: AvvRecommendation[];
  international_transfers: string;
  toms: string;
};

export type AiProviderName = "claude" | "openai" | "mock";

export type AiProvider = {
  name: AiProviderName;
  model?: string;
  analyzeIncident: (payload: { description: string; incident: Record<string, unknown> }) => Promise<IncidentAssistantResult>;
  assessCompliance: (payload: { system: Record<string, unknown> }) => Promise<ComplianceAssessment>;
  analyzeAvv: (payload: { avv: { documentText: string; fileName: string; fileSizeKB?: number } }) => Promise<AvvAssistantResult>;
};

export type HttpAiProviderOptions = {
  baseUrl?: string;
  provider: AiProviderName;
  model?: string;
};

export class HttpAiProvider implements AiProvider {
  public name: AiProviderName;
  public model?: string;
  private api: ApiClient;

  constructor(options: HttpAiProviderOptions) {
    this.name = options.provider;
    this.model = options.model;
    this.api = new ApiClient({
      baseUrl: options.baseUrl ?? env.VITE_API_BASE_URL ?? "/api",
    });
  }

  async analyzeIncident(payload: { description: string; incident: Record<string, unknown> }) {
    return this.api.post<IncidentAssistantResult>("/incident-assistant", {
      provider: this.name,
      model: this.model,
      ...payload,
    });
  }

  async assessCompliance(payload: { system: Record<string, unknown> }) {
    return this.api.post<ComplianceAssessment>("/compliance-assistant", {
      provider: this.name,
      model: this.model,
      ...payload,
    });
  }

  async analyzeAvv(payload: { avv: { documentText: string; fileName: string; fileSizeKB?: number } }) {
    return this.api.post<AvvAssistantResult>("/avv-assistant", {
      provider: this.name,
      model: this.model,
      ...payload,
    });
  }
}

export function createDefaultAiProvider(): AiProvider {
  const provider = (env.VITE_AI_PROVIDER as AiProviderName) ?? "claude";
  const model = env.VITE_AI_MODEL;
  return new HttpAiProvider({
    provider,
    model,
    baseUrl: env.VITE_API_BASE_URL ?? "/api",
  });
}
