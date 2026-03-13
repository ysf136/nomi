import React from "react";

const newsEntries = [
  {
    title: "Neue DSGVO-Reform 2025 beschlossen!",
    date: "30.08.2025",
    content: `Die EU hat eine neue Reform der Datenschutz-Grundverordnung beschlossen. Unternehmen müssen sich auf neue Pflichten einstellen. Weitere Informationen folgen.`
  },
  // Weitere News können hier ergänzt werden
];

export default function News() {
  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee", padding: 24 }}>
      <h2>Datenschutz News</h2>
      {newsEntries.map((entry, idx) => (
        <div key={idx} style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 4 }}>{entry.title}</h3>
          <div style={{ color: "#888", fontSize: 14 }}>{entry.date}</div>
          <p style={{ marginTop: 8 }}>{entry.content}</p>
        </div>
      ))}
    </div>
  );
}
