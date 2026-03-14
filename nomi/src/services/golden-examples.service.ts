import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export type GoldenDomain = "incident" | "avv" | "compliance";

export interface GoldenExample {
  id: string;
  domain: GoldenDomain;
  title: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  source: "manual" | "promoted";
  originalAnalysisId?: string;
  createdBy: string;
  createdAt: unknown;
  notes?: string;
  active: boolean;
}

const COL = "goldenExamples";

export async function getGoldenExamples(
  domain: GoldenDomain,
  onlyActive = true,
  maxResults = 3,
): Promise<GoldenExample[]> {
  const constraints = [
    where("domain", "==", domain),
    ...(onlyActive ? [where("active", "==", true)] : []),
    orderBy("createdAt", "desc"),
    limit(maxResults),
  ];
  const snap = await getDocs(query(collection(db, COL), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GoldenExample);
}

export async function getAllGoldenExamples(): Promise<GoldenExample[]> {
  const snap = await getDocs(
    query(collection(db, COL), orderBy("createdAt", "desc")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GoldenExample);
}

export async function addGoldenExample(
  data: Omit<GoldenExample, "id" | "createdAt">,
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateGoldenExample(
  id: string,
  data: Partial<Omit<GoldenExample, "id" | "createdAt">>,
): Promise<void> {
  await updateDoc(doc(db, COL, id), data);
}

export async function deleteGoldenExample(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function promoteToGoldenExample(params: {
  domain: GoldenDomain;
  title: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  userId: string;
  analysisId?: string;
  notes?: string;
}): Promise<string> {
  return addGoldenExample({
    domain: params.domain,
    title: params.title,
    input: params.input,
    output: params.output,
    source: "promoted",
    originalAnalysisId: params.analysisId,
    createdBy: params.userId,
    notes: params.notes,
    active: true,
  });
}
