import React from "react";
export default function Risikoanalysen() {
  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <div className="nova-glass-static" style={{ borderRadius: 16, padding: "2rem" }}>
        <h2 style={{ margin: "0 0 0.5rem" }}>Risikoanalysen</h2>
        <p style={{ color: "#6b7280" }}>Führen Sie Risikoanalysen für Ihre KI-Systeme durch.</p>
        <button className="nova-btn nova-btn-primary" style={{ marginTop: 16 }}>Neue Analyse starten</button>
      </div>
    </div>
  );
}
