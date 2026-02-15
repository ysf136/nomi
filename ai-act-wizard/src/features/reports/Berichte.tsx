
import React from "react";
import { Link } from "react-router-dom";

export default function KIVO() {
  return (
    <div className="container content" style={{ maxWidth: 700, margin: "2rem auto" }}>
      <div className="card" style={{ padding: 32, borderRadius: 16, boxShadow: "0 2px 16px #0001" }}>
        <div className="title" style={{ fontSize: 28, marginBottom: 12 }}>Bereit für die KI-VO?</div>
        <p style={{ fontSize: 17, color: "#2e4a4e", marginBottom: 24 }}>
          Prüfen Sie mit nur wenigen Klicks, wie gut Ihr Unternehmen auf die Anforderungen der KI-VO vorbereitet ist.
        </p>
        <ul style={{ color: "#4a5568", fontSize: 15, marginBottom: 28, paddingLeft: 20 }}>
          <li>✓ Kompetente Fragen</li>
          <li>✓ Sofortiges Scoring</li>
          <li>✓ Keine Vorkenntnisse nötig</li>
        </ul>
        <Link to="/wizard" className="button" style={{ fontSize: 18, padding: "14px 32px", borderRadius: 8, background: "#40B493", color: "#fff", fontWeight: 600, boxShadow: "0 2px 8px #153B39" }}>
          Zum Readyness-Check
        </Link>
      </div>
    </div>
  );
}
