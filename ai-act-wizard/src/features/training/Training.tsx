import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast, useToast } from "../../components/common/Toast";

const PROGRESS_KEY = "nova_training_progress_v1";

type ModuleId =
  | "personenbezogene-daten"
  | "was-darf-ich"
  | "fehlversand-email"
  | "clean-desk"
  | "passwortweitergabe"
  | "phishing"
  | "betroffenenanfragen";

const modules: Array<{
  id: ModuleId;
  title: string;
  est: string;
  content: React.ReactNode;
}> = [
  {
    id: "personenbezogene-daten",
    title: "Was sind personenbezogene Daten?",
    est: "~10 min",
    content: (
      <>
        <p>
          Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen.
          Beispiele: Name, Adresse, E-Mail, Telefonnummer, Kundennummer, IP-Adresse, Standortdaten.
        </p>
        <ul>
          <li><strong>Besondere Kategorien</strong>: Gesundheit, Biometrie, Religion – besondere Schutzanforderungen.</li>
          <li><strong>Bezug zur Person</strong>: Direkter (Name) oder indirekter (Kundennr., Cookie-ID).</li>
          <li><strong>Praxis</strong>: Prüfen Sie, ob eine Kombination von Informationen eine Person identifizierbar macht.</li>
        </ul>
      </>
    ),
  },
  {
    id: "was-darf-ich",
    title: "Was darf ich – was darf ich nicht?",
    est: "~10 min",
    content: (
      <>
        <p>
          Verarbeitung ist nur zulässig mit <strong>Rechtsgrundlage</strong> (z.B. Vertrag, Einwilligung, rechtliche Pflicht, berechtigtes Interesse).
        </p>
        <ul>
          <li>Nutzungszweck klar dokumentieren und auf das <strong>Erforderliche</strong> beschränken.</li>
          <li>Keine Nutzung für neue Zwecke ohne Rechtsgrundlage oder Information.</li>
          <li>Nur <strong>autorisierte Personen</strong> erhalten Zugriff (<em>Need-to-know</em>).</li>
        </ul>
      </>
    ),
  },
  {
    id: "fehlversand-email",
    title: "Typische Fehler: Fehlversand von E-Mails",
    est: "~5 min",
    content: (
      <>
        <ul>
          <li>Prüfen Sie <strong>Empfängerlisten</strong> (CC/BCC) vor Versand.</li>
          <li>Verwenden Sie <strong>BCC</strong> bei Rundmails.</li>
          <li>Vertrauliche Inhalte nur <strong>verschlüsselt</strong> versenden.</li>
          <li>Fehlversand: Sofort Vorgesetzte/DS-Koordinator informieren, ggf. Rückruf-Funktion nutzen.</li>
        </ul>
      </>
    ),
  },
  {
    id: "clean-desk",
    title: "Offene Bildschirme / Clean Desk",
    est: "~5 min",
    content: (
      <>
        <ul>
          <li>Bildschirm <strong>sperren</strong> bei Verlassen (Win+L).</li>
          <li>Papiere mit personenbezogenen Daten <strong>nicht offen</strong> liegen lassen.</li>
          <li>Dokumente sicher <strong>vernichten</strong> (Schredder/Datentonnen).</li>
        </ul>
      </>
    ),
  },
  {
    id: "passwortweitergabe",
    title: "Passwortweitergabe",
    est: "~5 min",
    content: (
      <>
        <ul>
          <li><strong>Niemals</strong> Passwörter teilen; persönliche Konten bleiben persönlich.</li>
          <li><strong>Starke Passwörter</strong> und <strong>2FA</strong> verwenden.</li>
          <li>Passwort-Manager nutzen; kein Speichern in Klartext.</li>
        </ul>
      </>
    ),
  },
  {
    id: "phishing",
    title: "Phishing & Social Engineering",
    est: "~10 min",
    content: (
      <>
        <ul>
          <li>Prüfen Sie <strong>Absender</strong>, <strong>Links</strong> und <strong>Anhänge</strong>.</li>
          <li>Nie Zugangsdaten über E-Mail/Webformular eingeben, wenn unsicher.</li>
          <li>Verdächtige Nachrichten an IT/Datenschutz melden.</li>
        </ul>
      </>
    ),
  },
  {
    id: "betroffenenanfragen",
    title: "Umgang mit Betroffenenanfragen",
    est: "~10 min",
    content: (
      <>
        <ul>
          <li>Keine eigenständige Beantwortung; <strong>weiterleiten</strong> an zuständige Stelle.</li>
          <li>Identität, Fristen und Rechtsgrundlagen werden zentral geprüft.</li>
          <li>Dokumentieren Sie Eingang, Inhalte und Weiterleitung.</li>
        </ul>
      </>
    ),
  },
];

export default function Training() {
  const nav = useNavigate();
  const { messages, addToast, dismissToast } = useToast();
  const [progress, setProgress] = useState<Record<ModuleId, boolean>>({
    "personenbezogene-daten": false,
    "was-darf-ich": false,
    "fehlversand-email": false,
    "clean-desk": false,
    "passwortweitergabe": false,
    "phishing": false,
    "betroffenenanfragen": false,
  });

  const NOVA_GREEN = "#3FB292";
  const NOVA_DARK = "#183939";

  useEffect(() => {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setProgress(parsed);
      } catch {}
    }
  }, []);

  const toggleModule = (id: ModuleId) => {
    const updated = { ...progress, [id]: !progress[id] };
    setProgress(updated);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    addToast(updated[id] ? "✓ Modul abgeschlossen" : "⏳ Modul offen", "info", 1500);
  };

  const completedCount = Object.values(progress).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa 0%, #f0f7f5 100%)", padding: "2rem 1rem" }}>
      <Toast messages={messages} onDismiss={dismissToast} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ background: "white", borderRadius: 16, padding: "2rem", marginBottom: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <button
            onClick={() => nav("/welcome")}
            style={{ background: "none", border: "none", color: NOVA_GREEN, fontWeight: 600, cursor: "pointer", marginBottom: "1rem" }}
          >
            ← Zurück
          </button>
          <h1 style={{ margin: "0 0 0.5rem", color: NOVA_DARK }}>📚 Datenschutzschulungen für Mitarbeiter</h1>
          <p style={{ margin: 0, color: "#666" }}>Kurze, praxisnahe Module – ideal für die interne Unterweisung.</p>
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ fontSize: "12px", color: "#999" }}>Fortschritt:</div>
            <div style={{ flex: 1, height: 8, background: "#e0e4ea", borderRadius: 6 }}>
              <div style={{ width: `${(completedCount / modules.length) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${NOVA_GREEN}, #2d9d7f)`, borderRadius: 6 }} />
            </div>
            <div style={{ fontSize: "12px", color: "#666", minWidth: 80, textAlign: "right" }}>{completedCount} / {modules.length} erledigt</div>
          </div>
        </div>

        {/* Modules */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {modules.map((m) => (
            <div key={m.id} style={{ background: "white", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontWeight: 700, color: NOVA_DARK }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{m.est}</div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={progress[m.id]} onChange={() => toggleModule(m.id)} />
                  <span style={{ fontSize: 12, color: progress[m.id] ? NOVA_GREEN : "#666" }}>{progress[m.id] ? "Erledigt" : "Markieren"}</span>
                </label>
              </div>
              <div style={{ marginTop: "0.75rem", color: "#444" }}>{m.content}</div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: "2rem", background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 14, color: "#666" }}>
            Tipp: Teilen Sie diese Module teamweit und führen Sie eine kurze <strong>Bestätigung</strong> der Unterweisung durch (Datum, Teilnehmer, Themen).
          </div>
        </div>
      </div>
    </div>
  );
}
