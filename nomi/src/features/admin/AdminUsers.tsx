import type React from "react";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth, type PlanId, type RoleId } from "../../auth/AuthContext";
import { tokens } from "../../styles/tokens";

interface UserRow {
  uid: string;
  email: string;
  displayName: string;
  plan: PlanId;
  role: RoleId;
  companyName: string;
  emailVerified: boolean;
  createdAt: Date | null;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUid, setEditUid] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState<PlanId>("demo");
  const [editRole, setEditRole] = useState<RoleId>("user");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const rows: UserRow[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          uid: d.id,
          email: data.email ?? "",
          displayName: data.displayName ?? "",
          plan: (data.plan as PlanId) ?? "demo",
          role: (data.role as RoleId) ?? "user",
          companyName: data.companyName ?? "",
          emailVerified: data.emailVerified ?? false,
          createdAt: data.createdAt?.toDate?.() ?? null,
        };
      });
      setUsers(rows);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveEdit(uid: string) {
    await updateDoc(doc(db, "users", uid), { plan: editPlan, role: editRole });
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, plan: editPlan, role: editRole } : u)),
    );
    setEditUid(null);
  }

  async function deleteUser(uid: string) {
    if (uid === user?.uid) return;
    await deleteDoc(doc(db, "users", uid));
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.companyName.toLowerCase().includes(search.toLowerCase()),
  );

  const planCounts = {
    demo: users.filter((u) => u.plan === "demo").length,
    pro: users.filter((u) => u.plan === "pro").length,
    enterprise: users.filter((u) => u.plan === "enterprise").length,
  };

  return (
    <div>
      <h1 style={h1Style}>Benutzerverwaltung</h1>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>
        {users.length} Benutzer insgesamt — {planCounts.demo} Demo · {planCounts.pro} Pro · {planCounts.enterprise} Enterprise
      </p>

      {/* Search */}
      <input
        className="nova-input"
        placeholder="Suchen nach Name, E-Mail oder Firma…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20, maxWidth: 400 }}
      />

      {loading ? (
        <p style={{ color: "#9CA3AF" }}>Lade Benutzer…</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>E-Mail</th>
                <th style={thStyle}>Firma</th>
                <th style={thStyle}>Plan</th>
                <th style={thStyle}>Rolle</th>
                <th style={thStyle}>Registriert</th>
                <th style={thStyle}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.uid} style={trStyle}>
                  <td style={tdStyle}>
                    {u.displayName}
                    {u.uid === user?.uid && (
                      <span style={{ fontSize: 11, color: tokens.colors.brand.primary, marginLeft: 6 }}>
                        (Du)
                      </span>
                    )}
                  </td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.companyName || "—"}</td>
                  <td style={tdStyle}>
                    {editUid === u.uid ? (
                      <select
                        value={editPlan}
                        onChange={(e) => setEditPlan(e.target.value as PlanId)}
                        style={selectStyle}
                      >
                        <option value="demo">Demo</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    ) : (
                      <span style={planBadge(u.plan)}>{u.plan.toUpperCase()}</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {editUid === u.uid ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as RoleId)}
                        style={selectStyle}
                      >
                        <option value="user">User</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td style={tdStyle}>
                    {u.createdAt ? u.createdAt.toLocaleDateString("de-DE") : "—"}
                  </td>
                  <td style={tdStyle}>
                    {editUid === u.uid ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => saveEdit(u.uid)} style={actionBtn("#10B981")}>
                          ✓
                        </button>
                        <button onClick={() => setEditUid(null)} style={actionBtn("#6B7280")}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => {
                            setEditUid(u.uid);
                            setEditPlan(u.plan);
                            setEditRole(u.role);
                          }}
                          style={actionBtn(tokens.colors.brand.primary)}
                        >
                          ✎
                        </button>
                        {u.uid !== user?.uid && (
                          <button onClick={() => deleteUser(u.uid)} style={actionBtn("#EF4444")}>
                            🗑
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "#9CA3AF", padding: 24 }}>
              Keine Benutzer gefunden.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────── */
const h1Style: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: "#1F2937",
  marginBottom: 4,
};

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

const trStyle: React.CSSProperties = {
  transition: "background 0.15s",
};

const selectStyle: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: 6,
  border: "1px solid #D1D5DB",
  fontSize: 12,
  background: "#fff",
};

function planBadge(plan: PlanId): React.CSSProperties {
  const bg =
    plan === "enterprise"
      ? "rgba(99, 102, 241, 0.1)"
      : plan === "pro"
        ? "rgba(63, 178, 146, 0.1)"
        : "rgba(107, 114, 128, 0.1)";
  const color =
    plan === "enterprise" ? "#6366F1" : plan === "pro" ? "#3FB292" : "#6B7280";
  return {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    background: bg,
    color,
    letterSpacing: "0.03em",
  };
}

function actionBtn(color: string): React.CSSProperties {
  return {
    background: "none",
    border: "none",
    color,
    cursor: "pointer",
    fontSize: 15,
    padding: "2px 6px",
    borderRadius: 4,
    fontFamily: "inherit",
  };
}
