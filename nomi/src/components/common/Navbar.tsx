// src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import novaLogoHorizontal from "../../assets/Nomi_Groß_Logo+Schrift.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      nav("/");
    } catch {
      // optional error handling
    }
  }

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(255, 255, 255, 0.70)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 1px 8px rgba(0, 0, 0, 0.04)",
      }}
      aria-label="Hauptnavigation"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <Link
          to={user ? "/welcome" : "/"}
          style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          aria-label="Zur Startseite"
        >
          <img
            src={novaLogoHorizontal}
            alt="nomi"
            style={{ height: 90, width: "auto" }}
          />
        </Link>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              fontSize: 13,
              color: "var(--nova-text-secondary)",
              fontWeight: 500,
            }}>
              {user.email?.split("@")[0]}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="nova-btn nova-btn-secondary nova-btn-sm"
              aria-label="Abmelden"
            >
              Abmelden
            </button>
          </div>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
