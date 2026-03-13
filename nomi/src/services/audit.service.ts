import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { AuditLog } from "../types/models";

export type AuditEventInput = Omit<AuditLog, "id" | "createdAt">;

export async function logAuditEvent(event: AuditEventInput): Promise<void> {
  const payload = {
    ...event,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "auditLogs"), payload);
}
