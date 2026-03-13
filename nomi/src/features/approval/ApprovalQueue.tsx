import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listPendingApprovals } from "../../services/approval.service";
import { ApprovalItem } from "../../types/models";
import { SkeletonList } from "../../components/ui/Skeleton";

export default function ApprovalQueue() {
  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery<ApprovalItem[]>({
    queryKey: ["approvals", "pending"],
    queryFn: listPendingApprovals,
  });

  if (isLoading) {
    return (
      <div className="container content">
        <h1 style={{ marginBottom: 16 }}>Freigaben</h1>
        <SkeletonList count={4} />
      </div>
    );
  }

  if (isError) {
    return <div className="container content">Fehler beim Laden der Freigaben.</div>;
  }

  const statusBadge: Record<string, string> = {
    pending: "nova-badge nova-badge-warning",
    approved: "nova-badge nova-badge-success",
    rejected: "nova-badge nova-badge-error",
    "needs-info": "nova-badge nova-badge-info",
  };

  return (
    <div className="container content">
      <h1 style={{ marginBottom: 16 }}>Freigaben</h1>
      {items.length === 0 ? (
        <div>Keine offenen Freigaben.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((item) => {
            const createdAt =
              item.createdAt instanceof Date
                ? item.createdAt
                : typeof item.createdAt === "object" && item.createdAt !== null && "seconds" in item.createdAt
                ? new Date((item.createdAt as { seconds: number }).seconds * 1000)
                : null;

            const typeLabels: Record<string, string> = {
              incident: "VORFALL",
              compliance: "COMPLIANCE",
              report: "BERICHT",
              avv: "AVV-PRÜFUNG",
            };

            return (
            <Link
              key={item.id}
              to={`/approvals/${item.id}`}
              className="nova-glass-static"
              style={{
                padding: 16,
                borderRadius: 12,
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 600 }}>{typeLabels[item.type] ?? item.type.toUpperCase()}</div>
                <span className={statusBadge[item.status] ?? "nova-badge"}>
                  {item.status}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>
                Prioritaet: {item.priority ?? "mittel"}
              </div>
              {createdAt ? (
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                  Erstellt: {createdAt.toLocaleString()}
                </div>
              ) : null}
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
