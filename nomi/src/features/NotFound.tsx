import { Link } from "react-router-dom";
import { tokens } from "../styles/tokens";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* 404 Large Number */}
      <div className="nova-text-gradient" style={{ fontSize: 120, fontWeight: 800, lineHeight: 1, marginBottom: 24, opacity: 0.4 }}>
        404
      </div>

      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>

      <h1 style={{ fontSize: 32, fontWeight: 700, color: tokens.colors.neutral[800], marginBottom: 16 }}>
        Seite nicht gefunden
      </h1>

      <p style={{ fontSize: 18, color: tokens.colors.neutral[500], maxWidth: 500, marginBottom: 32, lineHeight: 1.6 }}>
        Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
        Überprüfen Sie die URL oder kehren Sie zur Startseite zurück.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/"><button className="nova-btn nova-btn-primary nova-btn-lg">Zur Startseite</button></Link>
        <Link to="/dashboard"><button className="nova-btn nova-btn-secondary nova-btn-lg">Zum Dashboard</button></Link>
      </div>

      <div style={{ marginTop: 48 }}>
        <p style={{ color: tokens.colors.neutral[400], marginBottom: 12, fontSize: 14 }}>Beliebte Seiten:</p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/ai-act" style={{ color: tokens.colors.brand.primary, fontSize: 14 }}>AI Act Wizard</Link>
          <Link to="/vorfall-melden" style={{ color: tokens.colors.brand.primary, fontSize: 14 }}>Vorfall melden</Link>
          <Link to="/schulungen" style={{ color: tokens.colors.brand.primary, fontSize: 14 }}>Schulungen</Link>
          <Link to="/live-demo" style={{ color: tokens.colors.brand.primary, fontSize: 14 }}>Live Demo</Link>
        </div>
      </div>
    </div>
  );
}
