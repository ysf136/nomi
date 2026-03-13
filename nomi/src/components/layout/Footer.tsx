import { Link } from "react-router-dom";
import { tokens } from "../../styles/tokens";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: tokens.colors.neutral[900],
        color: "white",
        padding: "3rem 0 2rem",
        marginTop: "auto",
      }}
    >
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 48,
            marginBottom: 32,
          }}
        >
          {/* NOVA Info */}
          <div>
            <h3 style={{ color: tokens.colors.brand.primary, marginBottom: 16, fontSize: 20, fontWeight: 700 }}>
              NOVA
            </h3>
            <p style={{ color: "#D1D5DB", lineHeight: 1.6, fontSize: 14 }}>
              KI-gestützte Datenschutz-Compliance-Plattform für intelligentes Datenschutz- und AI Act Management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: tokens.colors.brand.primary, marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
              Produkt
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/ai-act" style={{ color: "#D1D5DB", fontSize: 14 }}>
                AI Act Wizard
              </Link>
              <Link to="/vorfall-melden" style={{ color: "#D1D5DB", fontSize: 14 }}>
                Vorfall melden
              </Link>
              <Link to="/schulungen" style={{ color: "#D1D5DB", fontSize: 14 }}>
                Schulungen
              </Link>
              <Link to="/live-demo" style={{ color: "#D1D5DB", fontSize: 14 }}>
                Live Demo
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: tokens.colors.brand.primary, marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
              Rechtliches
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="#impressum" style={{ color: "#D1D5DB", fontSize: 14 }}>
                Impressum
              </a>
              <a href="#datenschutz" style={{ color: "#D1D5DB", fontSize: 14 }}>
                Datenschutzerklärung
              </a>
              <a href="#agb" style={{ color: "#D1D5DB", fontSize: 14 }}>
                AGB
              </a>
              <a href="#cookies" style={{ color: "#D1D5DB", fontSize: 14 }}>
                Cookie-Richtlinie
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: tokens.colors.brand.primary, marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
              Kontakt
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#D1D5DB" }}>
              <div>Yusuf Öztürk</div>
              <div>Platzhalterstraße 1</div>
              <div>30451 Hannover</div>
              <a href="mailto:info@nova-compliance.app" style={{ color: tokens.colors.brand.primary }}>
                info@nova-compliance.app
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#374151", marginBottom: 24 }} />

        {/* Copyright */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 14,
            color: "#9CA3AF",
          }}
        >
          <div>
            © {currentYear} NOVA. Alle Rechte vorbehalten.
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span>Version 0.1.0</span>
            <span>|</span>
            <span>Made with ❤️ in Germany</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
