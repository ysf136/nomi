import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { listAvvCasesByUser } from "../../services/avv.service";
import type { AvvCase } from "../../types/models";
import { tokens } from "../../styles/tokens";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  draft: { label: "Entwurf", cls: "" },
  analyzing: { label: "In Prüfung", cls: "nova-badge nova-badge-warning" },
  reviewed: { label: "Geprüft", cls: "nova-badge nova-badge-info" },
  approved: { label: "Freigegeben", cls: "nova-badge nova-badge-success" },
  rejected: { label: "Abgelehnt", cls: "nova-badge nova-badge-error" },
};

export default function AvvCaseList() {
  const { user } = useAuth();
  const [cases, setCases] = useState<AvvCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    listAvvCasesByUser(user.uid)
      .then(setCases)
      .catch((e) => setError(e?.message ?? "Fehler beim Laden"))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", color: tokens.colors.neutral[800] }}>AVV-Prüfungen</h1>
        <a href="/avv-wizard" className="nova-btn nova-btn-primary nova-btn-sm" style={{ textDecoration: "none" }}>
          + Neue Prüfung
        </a>
      </div>

      {loading && <p style={{ color: "#888" }}>Lade AVV-Fälle…</p>}
      {error && <p style={{ color: tokens.colors.status.error }}>{error}</p>}

      {!loading && cases.length === 0 && (
        <div className="nova-glass-static" style={{ textAlign: "center", padding: "3rem 1rem", borderRadius: 16 }}>
          <p style={{ fontSize: 32, margin: "0 0 1rem" }}>📋</p>
          <p style={{ color: "#888" }}>Noch keine AVV-Prüfungen vorhanden.</p>
          <a href="/avv-wizard" style={{ color: tokens.colors.brand.primary, fontWeight: 600 }}>Erste Prüfung starten →</a>
        </div>
      )}

      {cases.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {cases.map((c) => {
            const status = STATUS_LABEL[c.status] ?? STATUS_LABEL.draft;
            const score = c.aiAnalysis?.conformity_score;
            const date = c.createdAt instanceof Date
              ? c.createdAt.toLocaleDateString("de-DE")
              : typeof c.createdAt === "object" && "toDate" in c.createdAt
                ? (c.createdAt as any).toDate().toLocaleDateString("de-DE")
                : "–";

            return (
              <a
                key={c.id}
                href={`/avv-report/${c.id}`}
                className="nova-glass-static"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderRadius: 12,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Score circle */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: score != null
                      ? `conic-gradient(${tokens.colors.brand.primary} ${(score ?? 0) * 3.6}deg, rgba(0,0,0,0.06) ${(score ?? 0) * 3.6}deg)`
                      : "rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(4px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 12,
                      color: tokens.colors.neutral[800],
                    }}
                  >
                    {score ?? "–"}
                  </span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: tokens.colors.neutral[800], fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.fileName}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: tokens.colors.neutral[400] }}>{date}</p>
                </div>

                {/* Status badge */}
                <span className={status.cls || "nova-badge"}>
                  {status.label}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
