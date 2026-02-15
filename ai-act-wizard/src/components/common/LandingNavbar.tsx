import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import CustomerLogin from "./CustomerLogin";
import novaLogoHorizontal from "../../assets/nova_logo_horizontal_header.png";

export default function LandingNavbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: scrolled ? "1px solid #E0E4EA" : "1px solid rgba(224, 228, 234, 0.3)",
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 2px 8px rgba(0, 0, 0, 0.05)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img
            src={novaLogoHorizontal}
            alt="NOVA"
            style={{
              height: 40,
              objectFit: "contain",
            }}
          />
        </Link>

        {/* Navigation Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => scrollToSection("vorteile")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 500,
              color: "#183939",
              padding: "8px 12px",
              borderRadius: 8,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(63, 178, 146, 0.1)";
              e.currentTarget.style.color = "#3FB292";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#183939";
            }}
          >
            Vorteile
          </button>

          <button
            onClick={() => scrollToSection("so-funktionierts")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 500,
              color: "#183939",
              padding: "8px 12px",
              borderRadius: 8,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(63, 178, 146, 0.1)";
              e.currentTarget.style.color = "#3FB292";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#183939";
            }}
          >
            Funktionen
          </button>

          <button
            onClick={() => scrollToSection("preise")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 500,
              color: "#183939",
              padding: "8px 12px",
              borderRadius: 8,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(63, 178, 146, 0.1)";
              e.currentTarget.style.color = "#3FB292";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#183939";
            }}
          >
            Preise
          </button>

          <button
            onClick={() => scrollToSection("faq")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 500,
              color: "#183939",
              padding: "8px 12px",
              borderRadius: 8,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(63, 178, 146, 0.1)";
              e.currentTarget.style.color = "#3FB292";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#183939";
            }}
          >
            FAQ
          </button>

          <Link
            to="/news"
            style={{
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 500,
              color: "#183939",
              padding: "8px 12px",
              borderRadius: 8,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(63, 178, 146, 0.1)";
              e.currentTarget.style.color = "#3FB292";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#183939";
            }}
          >
            News
          </Link>
        </div>

        {/* Right side: Customer Login or Demo Button */}
        {user ? (
          <Link
            to="/welcome"
            style={{
              padding: "10px 20px",
              background: "linear-gradient(90deg, #3FB292, #2d9d7f)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(63, 178, 146, 0.2)",
            }}
          >
            Zum Dashboard
          </Link>
        ) : (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <CustomerLogin />
            <Link
              to="/demoanfordern"
              style={{
                padding: "10px 20px",
                background: "linear-gradient(90deg, #3FB292, #2d9d7f)",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(63, 178, 146, 0.2)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(63, 178, 146, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(63, 178, 146, 0.2)";
              }}
            >
              Demo anfordern
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
