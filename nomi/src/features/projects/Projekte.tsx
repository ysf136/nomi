import React from "react";
export default function Projekte() {
  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <div className="nova-glass-static" style={{ borderRadius: 16, padding: "2rem" }}>
        <h2 style={{ margin: "0 0 0.5rem" }}>Projekte</h2>
        <p style={{ color: "#6b7280" }}>Hier verwalten Sie Ihre KI-Projekte.</p>
        <button className="nova-btn nova-btn-primary" style={{ marginTop: 16 }}>Projekt anlegen</button>
      </div>
    </div>
  );
}
