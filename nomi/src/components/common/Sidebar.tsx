import { Link, useLocation } from "react-router-dom";
import { usePlanAccess } from "../../hooks/usePlanAccess";
import { useAuth } from "../../auth/AuthContext";

const NAV_ITEMS = [
	{ to: "/dashboard", label: "Dashboard", icon: "▣" },
	{ to: "/vorfall-melden", label: "Vorfall melden", icon: "⚠" },
	{ to: "/ai-act", label: "AI Act Wizard", icon: "◈" },
	{ to: "/avv-wizard", label: "AV-Prüfung", icon: "✓" },
	{ to: "/avv-cases", label: "AVV-Fälle", icon: "📋" },
	{ to: "/verarbeitungstätigkeiten", label: "Verarbeitungstätigkeiten", icon: "📋" },
	{ to: "/berichte", label: "Berichte", icon: "☰" },
	{ to: "/schulungen", label: "Schulungen", icon: "✶" },
	{ to: "/projekte", label: "Projekte", icon: "▦" },
	{ to: "/risikoanalysen", label: "Risikoanalysen", icon: "△" },
	{ to: "/approvals", label: "Freigaben", icon: "◉" },
	{ to: "/einstellungen", label: "Einstellungen", icon: "⚙" },
];

export default function Sidebar() {
	const location = useLocation();
	const { canAccessRoute, plan } = usePlanAccess();
	const { user } = useAuth();
	const isAdmin = user?.role === "admin";

	const visibleItems = NAV_ITEMS.filter((item) => canAccessRoute(item.to));

	return (
		<aside className="nova-sidebar" aria-label="Seitennavigation">
			<style>{`
				.nova-sidebar {
					width: 260px;
					background: rgba(255, 255, 255, 0.55);
					backdrop-filter: blur(40px);
					-webkit-backdrop-filter: blur(40px);
					border-right: 1px solid rgba(255, 255, 255, 0.20);
					min-height: 100vh;
					box-shadow: 2px 0 24px rgba(0, 0, 0, 0.04);
					display: flex;
					flex-direction: column;
					padding: 20px 14px;
					gap: 8px;
					position: sticky;
					top: 0;
					transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
				}

				.nova-sidebar-header {
					display: flex;
					align-items: center;
					gap: 10px;
					padding: 12px 14px;
					border-radius: 14px;
					background: linear-gradient(135deg, #183939 0%, #0F2828 100%);
					color: white;
					font-weight: 700;
					font-size: 16px;
					letter-spacing: 1px;
					margin-bottom: 8px;
					box-shadow: 0 4px 16px rgba(24, 57, 57, 0.3);
					position: relative;
					overflow: hidden;
				}

				.nova-sidebar-header::after {
					content: '';
					position: absolute;
					top: -50%;
					right: -30%;
					width: 80px;
					height: 80px;
					background: radial-gradient(circle, rgba(63, 178, 146, 0.25) 0%, transparent 70%);
					pointer-events: none;
				}

				.nova-sidebar-nav {
					display: flex;
					flex-direction: column;
					gap: 2px;
					padding-top: 4px;
				}

				.nova-sidebar-link {
					display: flex;
					align-items: center;
					gap: 10px;
					padding: 9px 12px;
					border-radius: 12px;
					text-decoration: none;
					color: #4B5563;
					font-size: 13.5px;
					font-weight: 500;
					transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
					position: relative;
				}

				.nova-sidebar-link:hover {
					background: rgba(63, 178, 146, 0.08);
					color: #183939;
					transform: translateX(3px);
				}

				.nova-sidebar-link.active {
					background: linear-gradient(135deg, #3FB292 0%, #2d9d7f 100%);
					color: white;
					font-weight: 600;
					box-shadow: 0 4px 16px rgba(63, 178, 146, 0.30), 0 0 12px rgba(63, 178, 146, 0.15);
				}

				.nova-sidebar-icon {
					width: 30px;
					height: 30px;
					border-radius: 9px;
					display: flex;
					align-items: center;
					justify-content: center;
					background: rgba(63, 178, 146, 0.08);
					font-size: 13px;
					transition: all 200ms ease;
					flex-shrink: 0;
				}

				.nova-sidebar-link:hover .nova-sidebar-icon {
					background: rgba(63, 178, 146, 0.15);
				}

				.nova-sidebar-link.active .nova-sidebar-icon {
					background: rgba(255, 255, 255, 0.20);
					box-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
				}

				@media (max-width: 900px) {
					.nova-sidebar {
						width: 68px;
						padding: 14px 8px;
					}

					.nova-sidebar-header span,
					.nova-sidebar-label {
						display: none;
					}

					.nova-sidebar-link {
						justify-content: center;
						padding: 9px;
					}
				}
			`}</style>

			<div className="nova-sidebar-header">
				<span>NOVA</span>
				{plan && (
					<span style={{
						fontSize: 10,
						fontWeight: 600,
						padding: "2px 8px",
						borderRadius: 999,
						background: plan === "enterprise" ? "rgba(99,102,241,0.25)" : plan === "pro" ? "rgba(63,178,146,0.25)" : "rgba(255,255,255,0.2)",
						color: "#fff",
						marginLeft: "auto",
						letterSpacing: "0.04em",
						textTransform: "uppercase",
					}}>
						{plan}
					</span>
				)}
			</div>

			<nav className="nova-sidebar-nav">
				{visibleItems.map((item) => {
					const isActive = location.pathname === item.to;
					return (
						<Link
							key={item.to}
							to={item.to}
							className={`nova-sidebar-link ${isActive ? "active" : ""}`}
							aria-current={isActive ? "page" : undefined}
						>
							<span className="nova-sidebar-icon">{item.icon}</span>
							<span className="nova-sidebar-label">{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{isAdmin && (
				<>
					<div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "12px 10px" }} />
					<div style={{ padding: "4px 14px 2px", fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
						Admin
					</div>
					<nav className="nova-sidebar-nav">
						{[
							{ to: "/admin", label: "Übersicht", icon: "⊞" },
							{ to: "/admin/users", label: "Benutzer", icon: "👥" },
							{ to: "/admin/audit", label: "Audit-Log", icon: "📜" },
							{ to: "/admin/golden-examples", label: "Goldstandard", icon: "🏆" },
						].map((item) => {
							const isActive = location.pathname === item.to;
							return (
								<Link
									key={item.to}
									to={item.to}
									className={`nova-sidebar-link ${isActive ? "active" : ""}`}
									aria-current={isActive ? "page" : undefined}
								>
									<span className="nova-sidebar-icon">{item.icon}</span>
									<span className="nova-sidebar-label">{item.label}</span>
								</Link>
							);
						})}
					</nav>
				</>
			)}
		</aside>
	);
}