import { z } from "zod";

export const incidentSchema = z.object({
  description: z.string().min(10).max(5000),
  incidentType: z.string().min(2).max(100),
  affectedPeople: z.string().min(1).max(200),
  actionsTaken: z.string().max(2000).optional().default(""),
  date: z.string().min(8).max(32),
  time: z.string().min(4).max(8),
  severity: z.enum(["low", "medium", "high", "critical"]).optional(),
});

export const incidentDraftSchema = incidentSchema.partial();

export const aiSystemSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  useCases: z.array(z.string().min(1).max(200)).default([]),
  exposure: z.string().min(1).max(200).optional(),
});

export const approvalDecisionSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "needs-info"]),
  comment: z.string().max(2000).optional(),
});

// ── AVV Schemas ─────────────────────────────────────────────

export const avvDocumentSchema = z.object({
  documentText: z.string().min(50, "Vertragstext muss mindestens 50 Zeichen enthalten").max(200_000),
  fileName: z.string().min(1, "Dateiname erforderlich").max(260),
  fileSizeKB: z.number().int().positive().max(10_240).optional(),
});

export const avvRecommendationSchema = z.object({
  item: z.string().min(1).max(1000),
  priority: z.enum(["hoch", "mittel", "niedrig"]),
});

export const avvClauseAssessmentSchema = z.object({
  clauseRef: z.string().min(1).max(200),
  present: z.boolean(),
  comment: z.string().max(2000),
});

export const avvAnalysisResultSchema = z.object({
  summary: z.string().min(1).max(10_000),
  conformity_score: z.number().min(0).max(100),
  risks: z.array(z.string().max(1000)),
  missing_clauses: z.array(z.string().max(1000)),
  recommendations: z.array(avvRecommendationSchema),
  international_transfers: z.string().max(5000),
  toms: z.string().max(5000),
  clause_assessments: z.array(avvClauseAssessmentSchema).optional(),
  confidence: z.enum(["high", "medium", "low"]),
});
