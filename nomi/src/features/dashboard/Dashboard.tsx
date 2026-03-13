import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SkeletonCard, SkeletonStat, SkeletonList } from "../../components/ui/Skeleton";
import { useAuth } from "../../auth/AuthContext";
import GlassCard from "../../components/ui/GlassCard";
import { Reveal, StaggerReveal } from "../../hooks/useScrollReveal";
import { tokens } from "../../styles/tokens";

interface DashboardStats {
  complianceScore: number;
  openIncidents: number;
  completedTrainings: number;
  upcomingDeadlines: number;
}

interface Activity {
  id: string;
  type: "incident" | "training" | "analysis" | "report";
  title: string;
  timestamp: string;
  icon: string;
}

/* ─── skeleton shimmer while loading ─── */
function DashboardSkeleton() {
  return (
    <div className="nova-container" style={{ padding: "2rem 1.5rem" }}>
      {/* header skeleton */}
      <div style={{ marginBottom: 32 }}>
        <div className="nova-skeleton-light" style={{ width: 260, height: 28, borderRadius: 8 }} />
        <div className="nova-skeleton-light" style={{ width: 200, height: 16, borderRadius: 6, marginTop: 12 }} />
      </div>
      {/* stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 20, marginBottom: 40 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="nova-skeleton-light" style={{ height: 120, borderRadius: 16 }} />
        ))}
      </div>
      {/* action cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginBottom: 40 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="nova-skeleton-light" style={{ height: 180, borderRadius: 16 }} />
        ))}
      </div>
      {/* activity block */}
      <div className="nova-skeleton-light" style={{ height: 200, borderRadius: 16 }} />
    </div>
  );
}

/* ─── main component ─── */
export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStats({
        complianceScore: 73,
        openIncidents: 2,
        completedTrainings: 8,
        upcomingDeadlines: 3,
      });
      setRecentActivities([
        { id: "1", type: "incident", title: "Vorfall: Datenleck in CRM-System", timestamp: "vor 2 Stunden", icon: "⚠️" },
        { id: "2", type: "training", title: 'Schulung "DSGVO Grundlagen" abgeschlossen', timestamp: "vor 1 Tag", icon: "✓" },
        { id: "3", type: "analysis", title: "AI Act Risikoanalyse durchgeführt", timestamp: "vor 2 Tagen", icon: "📊" },
      ]);
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="nova-container" style={{ padding: "2rem 1.5rem" }}>
      {/* ── Welcome Header ── */}
      <Reveal variant="up">
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 6, letterSpacing: "-0.02em" }}>
            Willkommen zurück,{" "}
            <span className="nova-text-gradient">{user?.email?.split("@")[0] || "User"}</span>!
          </h1>
          <p style={{ color: tokens.colors.neutral[500], fontSize: 15 }}>
            Ihre Compliance-Übersicht für heute.
          </p>
        </div>
      </Reveal>

      {/* ── Stats Grid ── */}
      {stats && (
        <StaggerReveal style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20, marginBottom: 40 }}>
          <StatCard title="Compliance-Score" value={`${stats.complianceScore}%`} icon="📈" trend={stats.complianceScore >= 70 ? "good" : "warning"} />
          <StatCard title="Offene Vorfälle" value={stats.openIncidents.toString()} icon="⚠️" trend={stats.openIncidents > 0 ? "warning" : "good"} link="/vorfall-melden" />
          <StatCard title="Schulungen" value={`${stats.completedTrainings}/12`} icon="🎓" trend="good" link="/schulungen" />
          <StatCard title="Anstehende Deadlines" value={stats.upcomingDeadlines.toString()} icon="📅" trend={stats.upcomingDeadlines > 5 ? "critical" : "warning"} />
        </StaggerReveal>
      )}

      {/* ── Action Cards ── */}
      <StaggerReveal style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginBottom: 40 }}>
        <ActionCard title="AI Act Wizard" description="Prüfen Sie Ihre KI-Systeme auf AI Act Compliance." icon="🤖" link="/ai-act" buttonText="Wizard starten" />
        <ActionCard title="Vorfall melden" description="Datenschutzvorfall melden und bewerten lassen." icon="🚨" link="/vorfall-melden" buttonText="Neuer Vorfall" />
        <ActionCard title="AV-Prüfung" description="Auftragsverarbeitungsverträge KI-gestützt prüfen (Art. 28/32/44ff)." icon="📄" link="/avv-wizard" buttonText="AV prüfen" />
        <ActionCard title="Risikoanalyse" description="Datenschutzrisiken systematisch analysieren." icon="📊" link="/risikoanalysen" buttonText="Analyse starten" />
      </StaggerReveal>

      {/* ── Recent Activity ── */}
      <Reveal variant="up" delay={0.1}>
        <GlassCard padding="lg">
          <h2 style={{ fontSize: 18, fontWeight: 600, color: tokens.colors.neutral[800], marginBottom: 16 }}>
            Neueste Aktivitäten
          </h2>

          {recentActivities.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentActivities.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.55)",
                    borderRadius: 12,
                    borderLeft: `3px solid ${tokens.colors.brand.primary}`,
                    transition: "background 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.85)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.55)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, color: tokens.colors.neutral[800], fontSize: 14 }}>{a.title}</div>
                    <div style={{ fontSize: 13, color: tokens.colors.neutral[400] }}>{a.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: tokens.colors.neutral[400] }}>Noch keine Aktivitäten vorhanden.</p>
          )}

          <Link to="/berichte" style={{ display: "block", marginTop: 18 }}>
            <button className="nova-btn nova-btn-secondary" style={{ width: "100%" }}>
              Alle Aktivitäten anzeigen
            </button>
          </Link>
        </GlassCard>
      </Reveal>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Helper Components
   ═══════════════════════════════════════════ */

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: "good" | "warning" | "critical";
  link?: string;
}

const trendColors = {
  good: tokens.colors.status.success,
  warning: tokens.colors.status.warning,
  critical: tokens.colors.status.error,
};

function StatCard({ title, value, icon, trend, link }: StatCardProps) {
  const inner = (
    <GlassCard padding="md" className={link ? "" : undefined}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        {trend && (
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: trendColors[trend],
              boxShadow: `0 0 8px ${trendColors[trend]}80`,
              display: "inline-block",
            }}
          />
        )}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: tokens.colors.neutral[900], letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: tokens.colors.neutral[500], marginTop: 2 }}>{title}</div>
    </GlassCard>
  );

  return link ? (
    <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
      {inner}
    </Link>
  ) : (
    inner
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  buttonText: string;
}

function ActionCard({ title, description, icon, link, buttonText }: ActionCardProps) {
  return (
    <GlassCard glow padding="md" style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 30, marginBottom: 10 }}>{icon}</span>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: tokens.colors.neutral[800], marginBottom: 6 }}>{title}</h3>
      <p style={{ color: tokens.colors.neutral[500], fontSize: 14, flex: 1, marginBottom: 16, lineHeight: 1.5 }}>{description}</p>
      <Link to={link}>
        <button className="nova-btn nova-btn-primary" style={{ width: "100%" }}>{buttonText}</button>
      </Link>
    </GlassCard>
  );
}
