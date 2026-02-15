// src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import novaLogoHorizontal from "../../assets/nova_logo_horizontal_header.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const NOVA_GREEN = "#3FB292";
  const NOVA_DARK = "#183939";

  async function handleLogout() {
    try {
      await logout();
      nav("/"); // zurück zur Landing Page
    } catch {
      // optional: Fehlerbehandlung/Toast
    }
  }

  return (
    <nav
      className="navbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#FFFFFF",
        borderBottom: "1px solid #E0E4EA",
      }}
      aria-label="Hauptnavigation"
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Linkes Branding: Nur das NOVA Header-Logo */}
        <Link
          to={user ? "/welcome" : "/"}
          style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          aria-label="Zur Startseite"
        >
          <img
            src={novaLogoHorizontal}
            alt="NOVA"
            style={{ height: 32, width: "auto" }}
          />
        </Link>

        {/* Rechter Bereich: 
            - Wenn eingeloggt: nur "Abmelden"-Button
            - Wenn ausgeloggt: dein bestehendes CustomerLogin-Formular AUSBLENDEN (wie gewünscht)
              => Falls du es später wieder brauchst, füge hier <CustomerLogin /> ein. */}
        {user ? (
          <div>
            <button
              type="button"
              onClick={handleLogout}
              title="Abmelden"
              aria-label="Abmelden"
              style={{
                padding: "8px 14px",
                background: "#FFFFFF",
                color: NOVA_DARK,
                border: "1px solid #E0E4EA",
                borderRadius: 10,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 120ms ease, box-shadow 120ms ease, transform 120ms ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 10px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFFFFF";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = `3px solid ${NOVA_GREEN}`;
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "3px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "0";
              }}
            >
              Abmelden
            </button>
          </div>
        ) : (
          // Ausgeloggt: nichts rechts anzeigen (Logo bleibt sichtbar)
          <div />
        )}
      </div>
    </nav>
  );
}
