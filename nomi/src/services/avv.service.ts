import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import type { AvvCase, AvvAnalysisResult } from "../types/models";
import { logAuditEvent } from "./audit.service";
import { createApprovalItem } from "./approval.service";

// ── Types ─────────────────────────────────────────────────────

export type AvvCaseCreateInput = {
  userId: string;
  fileName: string;
  fileSizeKB?: number;
  documentText: string;
};

// ── Create ────────────────────────────────────────────────────

export async function createAvvCase(input: AvvCaseCreateInput): Promise<string> {
  const payload = {
    ...input,
    status: "draft" as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, "avvCases"), payload);

  await logAuditEvent({
    userId: input.userId,
    action: "ai-analysis",
    entityType: "avv",
    entityId: ref.id,
  });

  return ref.id;
}

// ── Read ──────────────────────────────────────────────────────

export async function getAvvCaseById(id: string): Promise<AvvCase | null> {
  const snap = await getDoc(doc(db, "avvCases", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<AvvCase, "id">) };
}

export async function listAvvCasesByUser(userId: string): Promise<AvvCase[]> {
  const q = query(
    collection(db, "avvCases"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<AvvCase, "id">),
  }));
}

// ── Update with AI result ─────────────────────────────────────

export async function saveAvvAnalysis(
  caseId: string,
  analysis: AvvAnalysisResult,
  userId: string
): Promise<void> {
  const docRef = doc(db, "avvCases", caseId);
  await updateDoc(docRef, {
    aiAnalysis: analysis,
    aiGeneratedAt: serverTimestamp(),
    status: analysis.confidence === "low" ? "analyzing" : "reviewed",
    updatedAt: serverTimestamp(),
  });

  await logAuditEvent({
    userId,
    action: "ai-analysis",
    entityType: "avv",
    entityId: caseId,
    aiDecision: analysis as unknown as Record<string, unknown>,
    aiConfidence: analysis.conformity_score / 100,
  });

  // Auto-escalate low confidence to Human-in-the-Loop review
  if (analysis.confidence === "low") {
    await createApprovalItem({
      type: "avv",
      sourceId: caseId,
      status: "pending",
      aiDecision: analysis as unknown as Record<string, unknown>,
      priority: "high",
    });
  }
}

// ── Manual status update (after review) ───────────────────────

export async function updateAvvCaseStatus(
  caseId: string,
  status: AvvCase["status"],
  userId: string
): Promise<void> {
  const docRef = doc(db, "avvCases", caseId);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });

  await logAuditEvent({
    userId,
    action: "manual-decision",
    entityType: "avv",
    entityId: caseId,
    humanApproved: status === "approved",
  });
}
