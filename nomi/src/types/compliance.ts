export type AiActCategory =
  | "Prohibited"
  | "HighRisk"
  | "GPAI"
  | "LimitedRisk"
  | "MinimalRisk";

export interface ComplianceObligation {
  id: string;
  label: string;
  legalRef?: string;
  deadline?: string;
  evidenceExamples?: string[];
}

export interface ComplianceSummary {
  category: AiActCategory;
  riskLevel: "low" | "medium" | "high" | "critical";
  obligations: ComplianceObligation[];
  nextSteps: string[];
}
