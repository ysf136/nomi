import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { addApprovalComment, getApprovalById, updateApprovalStatus } from "../../services/approval.service";
import { ApprovalItem, ReviewComment } from "../../types/models";
import { useAuth } from "../../auth/AuthContext";
import { sanitizeMultiline } from "../../lib/sanitizers";
import { Skeleton, SkeletonList } from "../../components/ui/Skeleton";

export default function ReviewPanel() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const {
    data: item,
    isLoading,
  } = useQuery<ApprovalItem | null>({
    queryKey: ["approval", id],
    queryFn: () => (id ? getApprovalById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });

  const decisionMutation = useMutation({
    mutationFn: async (status: "approved" | "rejected" | "needs-info") => {
      if (!id || !item) return;
      await updateApprovalStatus(id, status, user?.uid, item.type);

      const sanitizedComment = sanitizeMultiline(comment);
      if (sanitizedComment) {
        const newComment: ReviewComment = {
          id: crypto.randomUUID(),
          authorId: user?.uid ?? "reviewer",
          authorName: user?.displayName ?? user?.email ?? "Reviewer",
          text: sanitizedComment,
          createdAt: new Date(),
        };
        await addApprovalComment(id, newComment);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["approvals"] });
      nav("/approvals");
    },
  });

  if (isLoading) {
    return (
      <div className="container content">
        <Skeleton width={180} height={24} style={{ marginBottom: 12 }} />
        <Skeleton width={240} height={16} style={{ marginBottom: 16 }} />
        <SkeletonList count={3} />
      </div>
    );
  }

  if (!item) {
    return <div className="container content">Freigabe nicht gefunden.</div>;
  }

  const handleDecision = async (status: "approved" | "rejected" | "needs-info") => {
    await decisionMutation.mutateAsync(status);
  };

  return (
    <div className="container content">
      <h1 style={{ marginBottom: 8 }}>Freigabe</h1>
      <div style={{ marginBottom: 16, color: "#6B7280", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <span>Typ: {{ incident: "Vorfall", compliance: "Compliance", report: "Bericht", avv: "AVV-Prüfung" }[item.type] ?? item.type}</span>
        <span>Status: {item.status}</span>
        {item.priority && <span>Prioritaet: {item.priority}</span>}
        {item.type === "avv" && (
          <span style={{ background: "#ECFDF5", color: "#065F46", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>
            Human-in-the-Loop
          </span>
        )}
      </div>
      <pre style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)", padding: 16, borderRadius: 12, overflowX: "auto" }}>
        {JSON.stringify(item.aiDecision, null, 2)}
      </pre>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Kommentar (optional)"
        className="nova-input"
        style={{ minHeight: 120 }}
      />

      {item.comments?.length ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Kommentare</div>
          <div style={{ display: "grid", gap: 8 }}>
            {item.comments.map((c) => {
              const createdAt =
                c.createdAt instanceof Date
                  ? c.createdAt
                  : typeof c.createdAt === "object" && c.createdAt !== null && "seconds" in c.createdAt
                  ? new Date((c.createdAt as { seconds: number }).seconds * 1000)
                  : new Date(String(c.createdAt));
              return (
              <div
                key={c.id}
                className="nova-glass-static"
                style={{ padding: 12, borderRadius: 8 }}
              >
                <div style={{ fontSize: 12, color: "#6B7280" }}>
                  {c.authorName} · {createdAt.toLocaleString()}
                </div>
                <div style={{ fontSize: 14, marginTop: 4 }}>{c.text}</div>
              </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          className="nova-btn nova-btn-primary"
          onClick={() => handleDecision("approved")}
          disabled={decisionMutation.isPending}
        >
          Freigeben
        </button>
        <button
          className="nova-btn nova-btn-secondary"
          onClick={() => handleDecision("needs-info")}
          disabled={decisionMutation.isPending}
        >
          Rueckfrage
        </button>
        <button
          className="nova-btn nova-btn-danger"
          onClick={() => handleDecision("rejected")}
          disabled={decisionMutation.isPending}
        >
          Ablehnen
        </button>
      </div>
    </div>
  );
}
