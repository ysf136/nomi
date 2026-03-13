import {
  addDoc,
  arrayUnion,
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
import { ApprovalItem, ReviewComment } from "../types/models";
import { logAuditEvent } from "./audit.service";

export type ApprovalCreateInput = Omit<ApprovalItem, "id" | "createdAt">;

export async function createApprovalItem(input: ApprovalCreateInput) {
  const payload = {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, "approvals"), payload);

  await logAuditEvent({
    userId: input.reviewedBy ?? "system",
    action: "ai-decision",
    entityType: input.type,
    entityId: ref.id,
    aiDecision: input.aiDecision,
    humanApproved: false,
  });

  return ref.id;
}

export async function listPendingApprovals(): Promise<ApprovalItem[]> {
  const q = query(
    collection(db, "approvals"),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<ApprovalItem, "id">),
  }));
}

export async function getApprovalById(id: string): Promise<ApprovalItem | null> {
  const docRef = doc(db, "approvals", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<ApprovalItem, "id">) };
}

export async function updateApprovalStatus(
  id: string,
  status: "approved" | "rejected" | "needs-info",
  reviewerId?: string,
  entityType: ApprovalItem["type"] = "incident"
) {
  const docRef = doc(db, "approvals", id);
  await updateDoc(docRef, {
    status,
    reviewedBy: reviewerId ?? null,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await logAuditEvent({
    userId: reviewerId ?? "reviewer",
    action: "manual-decision",
    entityType,
    entityId: id,
    humanApproved: status === "approved",
    humanDecision: { status },
  });
}

export async function addApprovalComment(
  id: string,
  comment: ReviewComment
) {
  const docRef = doc(db, "approvals", id);
  await updateDoc(docRef, {
    comments: arrayUnion(comment),
    updatedAt: serverTimestamp(),
  });

  await logAuditEvent({
    userId: comment.authorId,
    action: "manual-decision",
    entityType: "incident",
    entityId: id,
    humanDecision: { comment: comment.text },
  });
}
