export type Timestamp = Date;

export interface BaseEntity {
  id: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export type UserRole = "admin" | "reviewer" | "user";

export interface UserProfile extends BaseEntity {
  email: string;
  displayName: string;
  companyName?: string;
  role: UserRole;
  lastLoginAt?: Timestamp;
}

export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "draft" | "submitted" | "reviewing" | "completed";

export interface IncidentAnalysis {
  severity: IncidentSeverity;
  mustReportSupervisory: boolean;
  mustNotifyDataSubjects: boolean;
  deadline?: Timestamp;
  recommendations: string[];
  riskScore: number;
  confidenceScore: number;
}

export interface ReviewComment extends BaseEntity {
  authorId: string;
  authorName: string;
  text: string;
}

export interface ReviewDecision {
  status: "pending" | "approved" | "rejected" | "needs-info";
  decision?: IncidentAnalysis;
  comments: ReviewComment[];
  decidedAt?: Timestamp;
  decidedBy?: string;
}

export interface Incident extends BaseEntity {
  userId: string;
  description: string;
  incidentType: string;
  affectedPeople: string;
  severity: IncidentSeverity;
  actionsTaken: string;
  date: string;
  time: string;
  status: IncidentStatus;
  aiAnalysis?: IncidentAnalysis;
  aiGeneratedAt?: Timestamp;
  review?: ReviewDecision;
}

export type AiRiskCategory =
  | "Prohibited"
  | "HighRisk"
  | "GPAI"
  | "LimitedRisk"
  | "MinimalRisk";

export interface ComplianceAssessment {
  category: AiRiskCategory;
  summary: string;
  legalReferences: string[];
  obligations: string[];
  deadlines: string[];
  priority: "low" | "medium" | "high" | "critical";
}

// ── AVV Domain ──────────────────────────────────────────────

export type AvvConfidence = "high" | "medium" | "low";
export type AvvCaseStatus =
  | "draft"
  | "analyzing"
  | "reviewed"
  | "approved"
  | "rejected";

export interface AvvRecommendation {
  item: string;
  priority: "hoch" | "mittel" | "niedrig";
}

export interface AvvClauseAssessment {
  clauseRef: string;          // e.g. "Art. 28 Abs. 3 lit. a"
  present: boolean;
  comment: string;
}

export interface AvvAnalysisResult {
  summary: string;
  conformity_score: number;   // 0-100
  risks: string[];
  missing_clauses: string[];
  recommendations: AvvRecommendation[];
  international_transfers: string;
  toms: string;
  clause_assessments?: AvvClauseAssessment[];
  confidence: AvvConfidence;
}

export interface AvvCase extends BaseEntity {
  userId: string;
  fileName: string;
  fileSizeKB?: number;
  status: AvvCaseStatus;
  documentText: string;
  aiAnalysis?: AvvAnalysisResult;
  aiGeneratedAt?: Timestamp;
  review?: ReviewDecision;
}

// ── Audit & Approval (extended) ─────────────────────────────

export interface ApprovalItem extends BaseEntity {
  type: "incident" | "compliance" | "report" | "avv";
  sourceId: string;
  status: "pending" | "approved" | "rejected" | "needs-info";
  aiDecision: Record<string, unknown>;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  comments?: ReviewComment[];
  deadlineAt?: Timestamp;
  priority: "low" | "medium" | "high";
}

export interface AuditLog extends BaseEntity {
  userId: string;
  action:
    | "ai-analysis"
    | "ai-decision"
    | "manual-decision"
    | "export"
    | "delete";
  entityType: "incident" | "compliance" | "system" | "avv" | "report";
  entityId: string;
  aiProvider?: "claude" | "openai" | "mock" | "other";
  aiModel?: string;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCost?: number;
  aiDecision?: Record<string, unknown>;
  aiConfidence?: number;
  humanDecision?: Record<string, unknown>;
  humanApproved?: boolean;
}
