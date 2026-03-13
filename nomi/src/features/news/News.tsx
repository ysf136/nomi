import React from "react";
import { tokens } from "../../styles/tokens";

type NewsCategory = "Datenschutz" | "KI" | "Cybersicherheit";

type NewsItem = {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: NewsCategory;
  impact: string;
};

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "ds-1",
    title: "DSGVO: Fokus auf Auftragsverarbeiter und TOM-Nachweise",
    date: "18.02.2026",
    category: "Datenschutz",
    summary:
      "Mehr Aufsichtsbehörden legen den Schwerpunkt auf dokumentierte technische und organisatorische Maßnahmen sowie belastbare AVV-Prozesse.",
    impact: "Unternehmen sollten AVV-Dokumentation, TOM-Nachweise und Prüfintervalle aktualisieren.",
  },
  {
    id: "ds-2",
    title: "Meldeprozesse bei Vorfällen: 72h-Frist bleibt zentrales Risiko",
    date: "14.02.2026",
    category: "Datenschutz",
    summary:
      "Bei Datenschutzvorfällen entscheidet die Qualität der Erstbewertung über Fristwahrung und rechtssichere Kommunikation mit Behörden.",
    impact: "Empfohlen sind klare Eskalationswege und standardisierte Incident-Checklisten.",
  },
  {
    id: "ai-1",
    title: "EU AI Act: Readiness-Programme werden operativ",
    date: "17.02.2026",
    category: "KI",
    summary:
      "Organisationen überführen AI-Act-Anforderungen in konkrete Governance-Controls wie Risikomanagement, Dokumentation und Human Oversight.",
    impact: "Ein zentrales Control-Set pro KI-System reduziert Audit-Aufwand und Umsetzungsrisiko.",
  },
  {
    id: "ai-2",
    title: "GPAI-Modelle: Transparenz- und Dokumentationspflichten im Fokus",
    date: "12.02.2026",
    category: "KI",
    summary:
      "Für General-Purpose-AI rücken Model Cards, Nachvollziehbarkeit und Lieferketten-Dokumentation stärker in den Vordergrund.",
    impact: "Teams sollten Provider-Dokumente versionieren und interne Freigaben standardisieren.",
  },
  {
    id: "cy-1",
    title: "Ransomware-Lage: Lieferketten bleiben Angriffsvektor",
    date: "16.02.2026",
    category: "Cybersicherheit",
    summary:
      "Angriffe erfolgen vermehrt über Drittanbieterzugänge und unzureichend abgesicherte Integrationen.",
    impact: "Empfohlen sind Zugriffshärtung, segmentierte Systeme und regelmäßige Wiederherstellungstests.",
  },
  {
    id: "cy-2",
    title: "Phishing mit KI-Inhalten nimmt zu",
    date: "10.02.2026",
    category: "Cybersicherheit",
    summary:
      "Täuschend echte E-Mails und Social-Engineering-Nachrichten erfordern stärkere Awareness-Trainings und technische Filter.",
    impact: "Wirksam sind MFA-Quoten, Mail-Schutzregeln und wiederkehrende Simulationen.",
  },
];

const CATEGORY_ORDER: NewsCategory[] = ["Datenschutz", "KI", "Cybersicherheit"];

export default function NewsPage() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 0 20px" }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, color: tokens.colors.neutral[900] }}>News</h1>
        <p style={{ marginTop: 8, color: tokens.colors.neutral[400] }}>
          Aktuelle Nachrichten zu Datenschutz, KI und Cybersicherheit – kompakt für dein Compliance-Team.
        </p>
      </header>

      {CATEGORY_ORDER.map((category) => {
        const items = NEWS_ITEMS.filter((item) => item.category === category);
        return (
          <div key={category} style={{ marginBottom: 22 }}>
            <h2 style={{ marginBottom: 10, color: tokens.colors.neutral[900] }}>{category}</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              {items.map((item) => (
                <article
                  key={item.id}
                  className="nova-glass-static"
                  style={{
                    borderRadius: 12,
                    padding: 14,
                  }}
                >
                  <div style={{ fontSize: 13, color: tokens.colors.neutral[400], marginBottom: 6 }}>{item.date}</div>
                  <h3 style={{ margin: "0 0 8px", color: tokens.colors.neutral[900], fontSize: 18 }}>{item.title}</h3>
                  <p style={{ margin: "0 0 8px", color: tokens.colors.neutral[600] }}>{item.summary}</p>
                  <p style={{ margin: 0, color: tokens.colors.neutral[600], fontWeight: 600 }}>
                    Relevanz: {item.impact}
                  </p>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
