import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit as fbLimit } from "firebase/firestore";
import { db } from "../../firebase";
import { tokens } from "../../styles/tokens";
import { getAppEnv } from "../../lib/env";

interface Stats {
  totalUsers: number;
  planBreakdown: { demo: number; pro: number; enterprise: number };
  recentIncidents: number;
  recentAvvCases: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      // Users
      const usersSnap = await getDocs(collection(db, "users"));
      let demo = 0, pro = 0, enterprise = 0;
      usersSnap.docs.forEach((d) => {
        const plan = d.data().plan;
        if (plan === "pro") pro++;
        else if (plan === "enterprise") enterprise++;
        else demo++;
      });

      // Recent incidents (last 50)
      let incidents = 0;
      try {
        const incSnap = await getDocs(
          query(collection(db, "incidents"), orderBy("createdAt", "desc"), fbLimit(50)),
        );
        incidents = incSnap.size;
      } catch { /* collection may not exist */ }

      // AVV cases
      let avvCases = 0;
      try {
        const avvSnap = await getDocs(
          query(collection(db, "avvCases"), orderBy("createdAt", "desc"), fbLimit(50)),
        );
        avvCases = avvSnap.size;
      } catch { /* collection may not exist */ }

      setStats({
        totalUsers: usersSnap.size,
        planBreakdown: { demo, pro, enterprise },
        recentIncidents: incidents,
        recentAvvCases: avvCases,
      });
    } catch (err) {
      console.error("Admin stats error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1F2937" }}>Admin-Dashboard</h1>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "2px 10px",
            borderRadius: 999,
            background: getAppEnv() === "production" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
            color: getAppEnv() === "production" ? "#EF4444" : "#F59E0B",
            textTransform: "uppercase",
          }}
        >
          {getAppEnv()}
        </span>
      </div>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 32 }}>
        Systemübersicht und Verwaltung
      </p>

      {loading ? (
        <p style={{ color: "#9CA3AF" }}>Lade Statistiken…</p>
      ) : stats ? (
        <>
          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            <KpiCard label="Benutzer gesamt" value={stats.totalUsers} icon="👥" color={tokens.colors.brand.primary} />
            <KpiCard label="Demo" value={stats.planBreakdown.demo} icon="🔍" color="#6B7280" />
            <KpiCard label="Pro" value={stats.planBreakdown.pro} icon="⚡" color="#3FB292" />
            <KpiCard label="Enterprise" value={stats.planBreakdown.enterprise} icon="🏢" color="#6366F1" />
            <KpiCard label="Vorfälle (letzte 50)" value={stats.recentIncidents} icon="⚠" color="#F59E0B" />
            <KpiCard label="AVV-Fälle (letzte 50)" value={stats.recentAvvCases} icon="📋" color="#3B82F6" />
          </div>

          {/* Quick links */}
          <div
            className="nova-glass-static"
            style={{ borderRadius: 16, padding: "1.5rem", maxWidth: 480 }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1F2937", marginBottom: 12 }}>
              Schnellzugriff
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <QuickLink to="/admin/users" label="Benutzerverwaltung" desc="Plan & Rolle bearbeiten" />
              <QuickLink to="/admin/audit" label="Audit-Log" desc="Alle System-Aktivitäten" />
              <QuickLink to="/einstellungen" label="Einstellungen" desc="Plattform-Konfiguration" />
            </div>
          </div>
        </>
      ) : (
        <p style={{ color: "#EF4444" }}>Statistiken konnten nicht geladen werden.</p>
      )}
    </div>
  );
}

function KpiCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div
      className="nova-glass-static"
      style={{
        borderRadius: 16,
        padding: "1.25rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#1F2937" }}>{value}</div>
        <div style={{ fontSize: 12, color: "#6B7280" }}>{label}</div>
      </div>
    </div>
  );
}

function QuickLink({ to, label, desc }: { to: string; label: string; desc: string }) {
  return (
    <a
      href={to}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 14px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        textDecoration: "none",
        transition: "background 0.15s",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1F2937" }}>{label}</div>
        <div style={{ fontSize: 12, color: "#9CA3AF" }}>{desc}</div>
      </div>
      <span style={{ color: "#9CA3AF", fontSize: 16 }}>→</span>
    </a>
  );
}
