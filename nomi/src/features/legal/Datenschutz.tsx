import { tokens } from "../../styles/tokens";
import type React from "react";

export default function Datenschutz() {
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
          Datenschutzerklärung
        </h1>
        <p style={{ ...pStyle, marginBottom: 24, color: tokens.colors.neutral[400] }}>
          Stand: März 2026
        </p>

        {/* 1. Verantwortlicher */}
        <Section title="1. Verantwortlicher">
          <p style={pStyle}>
            Türkay Yusuf Öztürk
            <br />
            Albertstraße 21, 30451 Hannover
            <br />
            E-Mail:{" "}
            <a href="mailto:info@nova-compliance.app" style={linkStyle}>
              info@nova-compliance.app
            </a>
            <br />
            Telefon: +49 152 36134777
          </p>
        </Section>

        {/* 2. Erhebung & Verarbeitung */}
        <Section title="2. Erhobene Daten">
          <p style={pStyle}>
            Bei der Nutzung von NOVA werden folgende personenbezogene Daten verarbeitet:
          </p>
          <ul style={ulStyle}>
            <li><strong>Registrierung:</strong> Name, E-Mail-Adresse, Passwort (verschlüsselt), Firmenname (optional), gewählter Plan</li>
            <li><strong>Nutzung:</strong> Eingaben in Formulare (Vorfallmeldungen, AV-Verträge, Risikoanalysen), Zeitstempel, Browser-Informationen</li>
            <li><strong>Terminbuchung:</strong> Name, E-Mail, gewähltes Datum</li>
            <li><strong>Technisch:</strong> IP-Adresse, Browser-Typ, Zugriffszeiten (Server-Logfiles)</li>
          </ul>
        </Section>

        {/* 3. Rechtsgrundlage */}
        <Section title="3. Rechtsgrundlage">
          <ul style={ulStyle}>
            <li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Vertragserfüllung (Bereitstellung der SaaS-Plattform)</li>
            <li><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung (z. B. Newsletter, Cookie-Einstellungen)</li>
            <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigtes Interesse (Sicherheit, Fehleranalyse, Plattformverbesserung)</li>
          </ul>
        </Section>

        {/* 4. Firebase */}
        <Section title="4. Auftragsverarbeiter & Drittdienste">
          <p style={pStyle}>
            NOVA nutzt <strong>Google Firebase</strong> (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) für:
          </p>
          <ul style={ulStyle}>
            <li>Firebase Authentication (Benutzerverwaltung)</li>
            <li>Cloud Firestore (Datenbankdienst)</li>
            <li>Firebase Hosting (Webhosting)</li>
          </ul>
          <p style={pStyle}>
            Google verarbeitet Daten gemäß den{" "}
            <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Firebase Datenschutzbestimmungen
            </a>
            . Es besteht ein Auftragsverarbeitungsvertrag (Data Processing Agreement) mit Google.
            Daten können auf Servern in der EU und den USA verarbeitet werden. Grundlage für die
            Übermittlung in die USA ist das EU-U.S. Data Privacy Framework.
          </p>
        </Section>

        {/* 5. Cookies */}
        <Section title="5. Cookies & lokale Speicherung">
          <p style={pStyle}>
            NOVA verwendet <strong>keine Marketing- oder Tracking-Cookies</strong>. Es werden ausschließlich technisch notwendige Speicherungen verwendet:
          </p>
          <ul style={ulStyle}>
            <li><strong>Firebase Auth Token:</strong> Sitzungsverwaltung (IndexedDB)</li>
            <li><strong>LocalStorage:</strong> Schulungsfortschritt, UI-Einstellungen, Cookie-Einwilligung</li>
          </ul>
          <p style={pStyle}>
            Diese Speicherungen sind für den Betrieb der Plattform notwendig und erfordern keine
            gesonderte Einwilligung (§ 25 Abs. 2 TDDDG).
          </p>
        </Section>

        {/* 6. Betroffenenrechte */}
        <Section title="6. Ihre Rechte">
          <p style={pStyle}>Sie haben jederzeit das Recht auf:</p>
          <ul style={ulStyle}>
            <li><strong>Auskunft</strong> über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
            <li><strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)</li>
            <li><strong>Löschung</strong> Ihrer Daten (Art. 17 DSGVO)</li>
            <li><strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)</li>
            <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
            <li><strong>Widerspruch</strong> gegen die Verarbeitung (Art. 21 DSGVO)</li>
            <li><strong>Widerruf</strong> erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p style={pStyle}>
            Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter{" "}
            <a href="mailto:info@nova-compliance.app" style={linkStyle}>
              info@nova-compliance.app
            </a>
            .
          </p>
        </Section>

        {/* 7. Speicherdauer */}
        <Section title="7. Speicherdauer">
          <p style={pStyle}>
            Personenbezogene Daten werden gelöscht, sobald der Zweck der Speicherung entfällt.
            Benutzerdaten werden bei Kontolöschung entfernt. Gesetzliche Aufbewahrungsfristen
            (z. B. steuerrechtlich: 10 Jahre) bleiben unberührt.
          </p>
        </Section>

        {/* 8. Datensicherheit */}
        <Section title="8. Datensicherheit">
          <p style={pStyle}>
            Wir treffen angemessene technische und organisatorische Maßnahmen zum Schutz Ihrer Daten:
          </p>
          <ul style={ulStyle}>
            <li>TLS/SSL-Verschlüsselung bei der Datenübertragung</li>
            <li>Passwort-Hashing durch Firebase Authentication (bcrypt/scrypt)</li>
            <li>Zugriffskontrolle über Firestore Security Rules</li>
            <li>Regelmäßige Sicherheitsupdates</li>
          </ul>
        </Section>

        {/* 9. Beschwerderecht */}
        <Section title="9. Beschwerderecht">
          <p style={pStyle}>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
            Die für uns zuständige Behörde ist:
          </p>
          <p style={pStyle}>
            Die Landesbeauftragte für den Datenschutz Niedersachsen
            <br />
            Prinzenstraße 5, 30159 Hannover
            <br />
            <a href="https://www.lfd.niedersachsen.de" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              www.lfd.niedersachsen.de
            </a>
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
