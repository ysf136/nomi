import { tokens } from "../../styles/tokens";
import type React from "react";

export default function AGB() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--nova-bg-gradient)",
        padding: "3rem 1.5rem",
      }}
    >
      <article
        className="nova-glass-static"
        style={{
          maxWidth: 800,
          margin: "0 auto",
          borderRadius: 20,
          padding: "2.5rem 2rem",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: tokens.colors.neutral[900],
            marginBottom: 8,
          }}
        >
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>
        <p style={{ ...pStyle, marginBottom: 24, color: tokens.colors.neutral[400] }}>
          Stand: März 2026
        </p>

        <Section title="§ 1 Geltungsbereich">
          <p style={pStyle}>
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der
            SaaS-Plattform „NOVA" (nachfolgend „Dienst"), betrieben von Türkay Yusuf Öztürk,
            Albertstraße 21, 30451 Hannover (nachfolgend „Anbieter").
          </p>
          <p style={pStyle}>
            Mit der Registrierung erkennt der Nutzer diese AGB an. Abweichende
            Bedingungen des Nutzers werden nicht Vertragsbestandteil.
          </p>
        </Section>

        <Section title="§ 2 Leistungsbeschreibung">
          <p style={pStyle}>
            NOVA ist eine KI-gestützte Datenschutz-Compliance-Plattform. Der Dienst umfasst je
            nach gewähltem Plan:
          </p>
          <ul style={ulStyle}>
            <li><strong>Demo:</strong> Eingeschränkter Zugang mit Beispieldaten zur Funktionsvorschau</li>
            <li><strong>Pro:</strong> Vollzugang zu allen Kernfunktionen (Dashboard, KI-Analysen, Vorfallmeldungen, AV-Prüfung, Schulungen, Berichte, Risikoanalysen)</li>
            <li><strong>Enterprise:</strong> Alle Pro-Funktionen plus Human-in-the-Loop-Freigaben, Audit-Trail, Reviewer-Dashboard und priorisierter Support</li>
          </ul>
          <p style={pStyle}>
            Der Anbieter behält sich vor, den Funktionsumfang weiterzuentwickeln und zu
            verbessern, sofern die wesentlichen Funktionen des gewählten Plans erhalten bleiben.
          </p>
        </Section>

        <Section title="§ 3 Vertragsschluss & Registrierung">
          <p style={pStyle}>
            Der Vertrag kommt durch die Registrierung auf der Plattform zustande. Der Nutzer ist
            verpflichtet, wahrheitsgemäße Angaben zu machen. Jeder Nutzer darf nur ein Konto
            anlegen.
          </p>
          <p style={pStyle}>
            Der Nutzer ist für die Geheimhaltung seiner Zugangsdaten verantwortlich und haftet
            für jede Nutzung unter seinen Zugangsdaten.
          </p>
        </Section>

        <Section title="§ 4 Preise & Zahlung">
          <p style={pStyle}>
            Der Demo-Plan ist kostenlos. Für Pro und Enterprise gelten die individuell
            vereinbarten Preise. Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen
            (Kleinunternehmerregelung).
          </p>
          <p style={pStyle}>
            Preisänderungen werden dem Nutzer mindestens 30 Tage vor Inkrafttreten mitgeteilt.
            Der Nutzer hat in diesem Fall ein Sonderkündigungsrecht.
          </p>
        </Section>

        <Section title="§ 5 Verfügbarkeit">
          <p style={pStyle}>
            Der Anbieter bemüht sich um eine Verfügbarkeit von 99,5 % im Jahresmittel.
            Ausgenommen sind geplante Wartungsarbeiten, höhere Gewalt sowie Störungen
            bei Drittanbietern (z. B. Google Firebase).
          </p>
        </Section>

        <Section title="§ 6 Nutzungspflichten">
          <p style={pStyle}>Der Nutzer verpflichtet sich:</p>
          <ul style={ulStyle}>
            <li>den Dienst nicht für rechtswidrige Zwecke zu verwenden</li>
            <li>keine Schadsoftware oder automatisierte Zugriffe einzusetzen</li>
            <li>keine Daten Dritter unbefugt in das System einzugeben</li>
            <li>die Zugangsdaten vertraulich zu behandeln</li>
          </ul>
          <p style={pStyle}>
            Bei Verstoß behält sich der Anbieter das Recht vor, den Zugang vorübergehend
            oder dauerhaft zu sperren.
          </p>
        </Section>

        <Section title="§ 7 Datenschutz">
          <p style={pStyle}>
            Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{" "}
            <a href="/datenschutz" style={linkStyle}>Datenschutzerklärung</a>.
            Soweit der Nutzer personenbezogene Daten Dritter in NOVA eingibt, ist er selbst
            Verantwortlicher i. S. d. DSGVO. Der Anbieter handelt in diesem Fall als
            Auftragsverarbeiter (Art. 28 DSGVO).
          </p>
        </Section>

        <Section title="§ 8 Haftung">
          <p style={pStyle}>
            Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit.
            Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung
            wesentlicher Vertragspflichten (Kardinalpflichten), begrenzt auf den
            vorhersehbaren, vertragstypischen Schaden.
          </p>
          <p style={pStyle}>
            KI-generierte Analysen und Empfehlungen stellen keine Rechtsberatung dar.
            Der Nutzer ist für die Prüfung und Umsetzung der Ergebnisse selbst verantwortlich.
          </p>
        </Section>

        <Section title="§ 9 Kündigung">
          <p style={pStyle}>
            Der Demo-Plan ist jederzeit ohne Frist kündbar. Pro- und Enterprise-Verträge
            können mit einer Frist von 30 Tagen zum Monatsende gekündigt werden. Die
            Kündigung erfolgt per E-Mail an{" "}
            <a href="mailto:info@nova-compliance.app" style={linkStyle}>
              info@nova-compliance.app
            </a>{" "}
            oder über die Kontoeinstellungen.
          </p>
          <p style={pStyle}>
            Nach Kündigung werden die Nutzerdaten innerhalb von 30 Tagen gelöscht,
            sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
          </p>
        </Section>

        <Section title="§ 10 Schlussbestimmungen">
          <p style={pStyle}>
            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Hannover,
            sofern der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder
            öffentlich-rechtliches Sondervermögen ist.
          </p>
          <p style={pStyle}>
            Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit
            der übrigen Bestimmungen unberührt.
          </p>
        </Section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={h2Style}>{title}</h2>
      {children}
    </section>
  );
}

const h2Style: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: "#1F2937",
  marginBottom: 10,
};

const pStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "#4B5563",
  marginBottom: 8,
};

const ulStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.8,
  color: "#4B5563",
  paddingLeft: 20,
  marginBottom: 8,
};

const linkStyle: React.CSSProperties = {
  color: "#3FB292",
  textDecoration: "none",
};
