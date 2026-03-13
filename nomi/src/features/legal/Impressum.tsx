import type React from "react";
import { tokens } from "../../styles/tokens";

export default function Impressum() {
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
            marginBottom: 24,
          }}
        >
          Impressum
        </h1>

        <section style={{ marginBottom: 24 }}>
          <h2 style={h2Style}>Angaben gemäß § 5 TMG</h2>
          <p style={pStyle}>
            Türkay Yusuf Öztürk
            <br />
            Einzelunternehmer
            <br />
            Albertstraße 21
            <br />
            30451 Hannover
          </p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={h2Style}>Kontakt</h2>
          <p style={pStyle}>
            Telefon: +49 152 36134777
            <br />
            E-Mail:{" "}
            <a
              href="mailto:info@nova-compliance.app"
              style={{ color: tokens.colors.brand.primary }}
            >
              info@nova-compliance.app
            </a>
          </p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={h2Style}>Umsatzsteuer</h2>
          <p style={pStyle}>
            Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).
          </p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={h2Style}>
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <p style={pStyle}>
            Türkay Yusuf Öztürk
            <br />
            Albertstraße 21
            <br />
            30451 Hannover
          </p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={h2Style}>Streitschlichtung</h2>
          <p style={pStyle}>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: tokens.colors.brand.primary }}
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            .
          </p>
          <p style={pStyle}>
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={h2Style}>Haftung für Inhalte</h2>
          <p style={pStyle}>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
            Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
            verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf
            eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p style={pStyle}>
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon
            unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
            Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
            Inhalte umgehend entfernen.
          </p>
        </section>

        <section>
          <h2 style={h2Style}>Haftung für Links</h2>
          <p style={pStyle}>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich.
          </p>
        </section>
      </article>
    </main>
  );
}

const h2Style: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: "#1F2937",
  marginBottom: 8,
};

const pStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "#4B5563",
  marginBottom: 8,
};
