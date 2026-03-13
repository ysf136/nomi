
import React from "react";
import { Link } from "react-router-dom";

export default function KIVO() {
  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <div className="nova-glass-static" style={{ padding: 32, borderRadius: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Bereit für die KI-VO?</div>
        <p style={{ fontSize: 17, color: "#6b7280", marginBottom: 24 }}>
          Prüfen Sie mit nur wenigen Klicks, wie gut Ihr Unternehmen auf die Anforderungen der KI-VO vorbereitet ist.
        </p>
        <ul style={{ color: "#6b7280", fontSize: 15, marginBottom: 28, paddingLeft: 20 }}>
          <li>✓ Kompetente Fragen</li>
          <li>✓ Sofortiges Scoring</li>
          <li>✓ Keine Vorkenntnisse nötig</li>
        </ul>
        <Link to="/wizard" className="nova-btn nova-btn-primary nova-btn-lg" style={{ textDecoration: "none" }}>
          Zum Readyness-Check
        </Link>
      </div>
    </div>
  );
}
