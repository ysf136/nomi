import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit as fbLimit } from "firebase/firestore";
import { db } from "../../firebase";
import type React from "react";

interface AuditEntry {
  id: string;
  action: string;
  userId: string;
  userEmail: string;
  details: string;
  createdAt: Date | null;
}

export default function AdminAudit() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudit();
  }, []);

  async function loadAudit() {
    try {
      const q = query(collection(db, "auditLogs"), orderBy("createdAt", "desc"), fbLimit(100));
      const snap = await getDocs(q);
      setEntries(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            action: data.action ?? "",
            userId: data.userId ?? "",
            userEmail: data.userEmail ?? "",
            details: data.details ?? "",
            createdAt: data.createdAt?.toDate?.() ?? null,
          };
        }),
      );
    } catch (err) {
      console.error("Audit log error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1F2937", marginBottom: 4 }}>
        Audit-Log
      </h1>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>
        Letzte 100 System-Aktivitäten
      </p>

      {loading ? (
        <p style={{ color: "#9CA3AF" }}>Lade Einträge…</p>
      ) : entries.length === 0 ? (
        <div
          className="nova-glass-static"
          style={{ borderRadius: 16, padding: "2rem", textAlign: "center" }}
        >
          <p style={{ color: "#9CA3AF", fontSize: 14 }}>
            Noch keine Audit-Einträge vorhanden. Aktivitäten werden hier automatisch protokolliert.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Zeitpunkt</th>
                <th style={thStyle}>Aktion</th>
                <th style={thStyle}>Benutzer</th>
                <th style={thStyle}>Details</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td style={tdStyle}>
                    {e.createdAt
                      ? e.createdAt.toLocaleString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td style={tdStyle}>
                    <span style={actionBadge(e.action)}>{e.action}</span>
                  </td>
                  <td style={tdStyle}>{e.userEmail || e.userId}</td>
                  <td style={{ ...tdStyle, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {e.details || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontWeight: 600,
  color: "#6B7280",
  borderBottom: "2px solid #E5E7EB",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  color: "#374151",
  borderBottom: "1px solid #F3F4F6",
};

function actionBadge(action: string): React.CSSProperties {
  const isDelete = action.toLowerCase().includes("delete") || action.toLowerCase().includes("lösch");
  const isCreate = action.toLowerCase().includes("create") || action.toLowerCase().includes("erstell");
  const bg = isDelete ? "rgba(239,68,68,0.1)" : isCreate ? "rgba(16,185,129,0.1)" : "rgba(99,102,241,0.1)";
  const color = isDelete ? "#EF4444" : isCreate ? "#10B981" : "#6366F1";
  return {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    background: bg,
    color,
  };
}
