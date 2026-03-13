import { useState, useEffect } from "react";
import { tokens } from "../../styles/tokens";

const COOKIE_KEY = "nova_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Hinweis"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(15, 26, 26, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(63, 178, 146, 0.2)",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <p
        style={{
          color: "#D1D5DB",
          fontSize: 13,
          lineHeight: 1.6,
          margin: 0,
          maxWidth: 700,
        }}
      >
        Diese Website verwendet ausschließlich technisch notwendige Cookies und lokale
        Speicherung für den Betrieb der Plattform. Keine Marketing- oder Tracking-Cookies.{" "}
        <a
          href="/datenschutz"
          style={{ color: tokens.colors.brand.primary, textDecoration: "none", fontWeight: 600 }}
        >
          Mehr erfahren
        </a>
      </p>
      <button
        onClick={accept}
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.brand.primary}, #2d9d7f)`,
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "8px 24px",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(63,178,146,0.3)",
        }}
      >
        Verstanden
      </button>
    </div>
  );
}
