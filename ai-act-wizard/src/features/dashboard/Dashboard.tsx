import React from "react";

export default function Dashboard() {
  return (
    <div className="container content" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
      <div className="card">
        <div className="title">Projektüberblick</div>
        <p>Alle Ihre Projekte im Blick. Verwalten Sie Ihre KI-Projekte zentral.</p>
        <button className="button" style={{ marginTop: 16 }}>Zu den Projekten</button>
      </div>
      <div className="card">
        <div className="title">Risikoanalysen</div>
        <p>Analysieren Sie Risiken und erhalten Sie Empfehlungen zur Verbesserung.</p>
        <button className="button" style={{ marginTop: 16 }}>Risiko prüfen</button>
      </div>
      <div className="card">
        <div className="title">Berichte</div>
        <p>Erstellen und exportieren Sie Berichte zu Ihren Datenschutz- und KI-Aktivitäten.</p>
        <button className="button" style={{ marginTop: 16 }}>Berichte anzeigen</button>
      </div>
      <div className="card">
        <div className="title">Einstellungen</div>
        <p>Passen Sie Ihr NOVA-Profil und Ihre Benachrichtigungen individuell an.</p>
        <button className="button" style={{ marginTop: 16 }}>Zu den Einstellungen</button>
      </div>
    </div>
  );
}
