import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import novaLogoHorizontal from "../../assets/Nomi_Groß_Logo+Schrift.png";

export default function LandingNavbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
    }
  };

  const navLinkStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
    color: "#374151",
    padding: "6px 4px",
    textDecoration: "none",
    transition: "color 0.2s ease",
    display: "inline-block",
    minHeight: "auto",
    minWidth: "auto",
    fontFamily: "inherit",
  };

  return (
    <>
      <style>{`
        .landing-nav-link:hover { color: #3FB292 !important; }
      `}</style>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.75)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(12px)",
          borderBottom: scrolled ? "1px solid #E0E4EA" : "1px solid rgba(224,228,234,0.4)",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 32px",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              padding: 0,
              minWidth: "auto",
              minHeight: "auto",
              flexShrink: 0,
            }}
          >
            <img src={novaLogoHorizontal} alt="nomi" style={{ height: 100, objectFit: "contain" }} />
          </Link>

          {/* Center Navigation Links */}
          <nav
            aria-label="Hauptnavigation"
            style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "center" }}
          >
            {[
              { label: "Vorteile", id: "vorteile" },
              { label: "Funktionen", id: "so-funktionierts" },
              { label: "Preise", id: "preise" },
              { label: "FAQ", id: "faq" },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="landing-nav-link"
                style={navLinkStyle}
              >
                {label}
              </button>
            ))}
            <Link
              to="/news"
              className="landing-nav-link"
              style={{ ...navLinkStyle, padding: "6px 4px" }}
            >
              News
            </Link>
          </nav>

          {/* Right side CTA */}
          {user ? (
            <Link
              to="/welcome"
              style={{
                background: "linear-gradient(135deg, #3FB292, #2d9d7f)",
                color: "white",
                border: "none",
                borderRadius: 999,
                padding: "10px 28px",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "opacity 0.2s",
                display: "inline-block",
              }}
            >
              Zum Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              style={{
                background: "linear-gradient(135deg, #3FB292, #2d9d7f)",
                color: "white",
                border: "none",
                borderRadius: 999,
                padding: "10px 28px",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
                cursor: "pointer",
                flexShrink: 0,
                display: "inline-block",
              }}
            >
              Anmelden
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
