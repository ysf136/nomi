import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "./components/common/LandingNavbar";
import { tokens } from "./styles/tokens";
import deutschlandflagge from "./assets/Flagge_Deutschland.png";

type SectionProps = {
id?: string;
className?: string;
children?: React.ReactNode;
};

function Section({ id, className, children }: SectionProps) {
const cls = ["container content", className || ""].join(" ").trim();
return (
<section id={id} className={cls} style={{ paddingTop: 48, paddingBottom: 48 }}>
{children}
</section>
);
}

function DashboardMockup() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const NOVA_GREEN = tokens.colors.brand.primary;

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 65;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      setProgress(current);
      if (current >= 65) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Add pulse animation keyframes
  useEffect(() => {
    if (!document.querySelector('#pulse-animation-style')) {
      const style = document.createElement('style');
      style.id = 'pulse-animation-style';
      style.textContent = `
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleClick = () => {
    // Sofort navigieren ohne Animations-Verzögerung
    navigate('/live-demo', { state: { fromMockup: true } });
  };

  return (
    <motion.div
      layoutId="dashboard-card"
      onClick={handleClick}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{
        duration: 0,
      }}
      style={{
        width: "100%",
        aspectRatio: "1",
        background: "white",
        borderRadius: 16,
        padding: "2rem",
        boxShadow: "0 20px 60px rgba(63, 178, 146, 0.2)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transformOrigin: "center center",
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 30px 80px rgba(63, 178, 146, 0.3)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Badge */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: `linear-gradient(135deg, ${NOVA_GREEN}, #2d9d7f)`,
          color: "white",
          padding: "0.35rem 0.75rem",
          borderRadius: 6,
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.5px",
        }}
      >
        LIVE DEMO
      </div>

      {/* Mockup Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: "0.5rem" }}>
          📊 Dein Datenschutz-Status
        </div>
        <div style={{ fontSize: "11px", color: tokens.colors.neutral[400] }}>
          Klicken für interaktive Demo →
        </div>
      </div>

      {/* Progress Section */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: "13px", color: tokens.colors.neutral[900] }}>
            Datenschutz-Maßnahmen
          </span>
          <span style={{ fontSize: "16px", color: NOVA_GREEN, fontWeight: 700 }}>
            {progress}%
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "10px",
            background: "#e0e4ea",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${NOVA_GREEN}, #2d9d7f)`,
              transition: "width 0.05s linear",
              borderRadius: "6px",
            }}
          />
        </div>
      </div>

      {/* Mini Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            background: "#f8f9fa",
            padding: "0.75rem",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: 700, color: NOVA_GREEN }}>8</div>
          <div style={{ fontSize: "10px", color: tokens.colors.neutral[500], marginTop: "2px" }}>Vorfälle</div>
        </div>
        <div
          style={{
            background: "#f8f9fa",
            padding: "0.75rem",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: 700, color: NOVA_GREEN }}>3</div>
          <div style={{ fontSize: "10px", color: tokens.colors.neutral[500], marginTop: "2px" }}>Analysen</div>
        </div>
      </div>

      {/* Decorative pulse effect */}
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          width: "8px",
          height: "8px",
          background: NOVA_GREEN,
          borderRadius: "50%",
          animation: "pulse 2s ease-in-out infinite",
        }}
      />
    </motion.div>
  );
}

function Hero() {
return (
<header
  className="hero-section fade-in-up"
  style={{
    background: "linear-gradient(180deg, rgba(63,178,146,0.10) 0%, rgba(63,178,146,0.04) 100%)",
    marginLeft: "calc(-50vw + 50%)",
    marginRight: "calc(-50vw + 50%)",
    paddingTop: 100,
    paddingBottom: 80,
    marginBottom: 64,
  }}
>
  <div
    style={{
      maxWidth: 820,
      margin: "0 auto",
      textAlign: "center",
      padding: "0 24px",
    }}
  >
    {/* Trust Badge */}
    <div style={{ marginBottom: 28, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(63, 178, 146, 0.12)",
          border: "1px solid rgba(63, 178, 146, 0.25)",
          borderRadius: 999,
          padding: "6px 16px",
          fontSize: 13,
          fontWeight: 500,
          color: tokens.colors.neutral[700],
        }}
      >
        <img src={deutschlandflagge} alt="Deutschland" style={{ width: 22, height: "auto", borderRadius: 2 }} />
        Entwickelt & gehostet in Deutschland
      </div>
    </div>

    {/* Heading */}
    <h1
      style={{
        fontSize: "clamp(36px, 5vw, 64px)",
        fontWeight: 800,
        lineHeight: 1.15,
        marginBottom: 24,
        color: tokens.colors.neutral[900],
        letterSpacing: "-1.5px",
      }}
    >
      Datenschutz-Management
      <br />
      <span
        style={{
          background: `linear-gradient(90deg, ${tokens.colors.brand.primary}, #2d9d7f)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        ohne Komplexität
      </span>
    </h1>

    {/* Description */}
    <p
      style={{
        fontSize: "clamp(16px, 1.4vw, 20px)",
        color: tokens.colors.neutral[500],
        lineHeight: 1.7,
        marginBottom: 40,
        maxWidth: 640,
        marginLeft: "auto",
        marginRight: "auto",
        fontWeight: 400,
      }}
    >
      NOVA ist die intelligente KI-Lösung für modernes Datenschutz- und Compliance-Management.
      Automatisierte Risikoanalysen, rechtskonforme Dokumentation und 24/7 Datenschutzberatung
      – alles in einer Plattform.
    </p>

    {/* CTA Buttons */}
    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
      <Link
        to="/Gespraech-vereinbaren"
        className="nova-btn nova-btn-primary nova-btn-lg"
        style={{
          padding: "16px 36px",
          fontSize: 16,
          borderRadius: 999,
          fontWeight: 600,
        }}
      >
        Kostenlos testen
      </Link>
      <Link
        to="/demoanfordern"
        className="nova-btn nova-btn-ghost nova-btn-lg"
        style={{
          padding: "16px 36px",
          fontSize: 16,
          borderRadius: 999,
          fontWeight: 600,
          border: `1.5px solid ${tokens.colors.neutral[300]}`,
          color: tokens.colors.neutral[700],
        }}
      >
        Demo buchen
      </Link>
    </div>

    {/* Interactive Demo Teaser */}
    <div style={{ display: "flex", justifyContent: "center" }}>
      <DashboardMockup />
    </div>
  </div>

  <style>{`
    @media (max-width: 768px) {
      .hero-section {
        padding-top: 40px !important;
        padding-bottom: 48px !important;
      }
    }
  `}</style>
</header>
);
}

function BenefitCard({ title, children }: React.PropsWithChildren<{ title: string }>) {
return (
<div className="nova-glass-static" style={{ padding: 20 }}>
<div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 8 }}>{title}</div>
<div style={{ fontSize: 15, color: tokens.colors.neutral[500] }}>{children}</div>
</div>
);
}

function KiAccuracy() {
  const stats = [
    { value: "98,7%", label: "Trefferquote", desc: "KI-gestützte Risikobewertungen korrekt klassifiziert" },
    { value: "500+", label: "Praxisfälle", desc: "Reale Datenschutzvorfälle im Trainings-Datensatz" },
    { value: "2-in-1", label: "DSGVO & AI Act", desc: "Beide Regelwerke kombiniert geprüft und bewertet" },
  ];
  return (
    <Section id="ki-genauigkeit">
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "inline-block", background: `${tokens.colors.brand.primary}14`, border: `1px solid ${tokens.colors.brand.primary}30`, borderRadius: 999, padding: "5px 16px", fontSize: 13, color: tokens.colors.brand.primary, fontWeight: 600, marginBottom: 16 }}>
          KI-Genauigkeit
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 12 }}>
          Zahlen, die für sich sprechen
        </div>
        <div style={{ fontSize: 16, color: tokens.colors.neutral[500], maxWidth: 520, margin: "0 auto" }}>
          NOVAs KI-Modell wurde auf echten Datenschutz-Fällen trainiert und von zertifizierten DSB-Experten validiert.
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        {stats.map((s) => (
          <div
            key={s.value}
            className="nova-glass-static"
            style={{ borderRadius: 20, padding: "2rem", textAlign: "center", border: `1px solid ${tokens.colors.brand.primary}20` }}
          >
            <div style={{ fontSize: 42, fontWeight: 800, color: tokens.colors.brand.primary, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 13, color: tokens.colors.neutral[500], lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Benefits() {
return (
<Section id="vorteile">
<div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 24 }}>Datenschutz einfach gestalten? NOMI hilft Ihnen!</div>
<div className="features" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
<BenefitCard title="Unsere KI-Assistentin: Nomi">
Nomi bearbeitet Ihre Anfragen zum Datenschutz. 
</BenefitCard>
<BenefitCard title="Automatisierte Risikoanalysen bei Datenschutzvorfällen">
Ein Mitarbeiter tippt einen Vorfall ein – und NOVA bewertet automatisch das Risiko.
</BenefitCard>
<BenefitCard title="Immer Verfügbar">
In der Nacht und auch am Wochenende. So bleibt die 72 Stunden Frist immer gewahrt.
</BenefitCard>
<BenefitCard title="Human in the loop">
Bei Vorfällen mit hohem Risiko bezieht bewertet ein Datenschutzexperte den Fall
</BenefitCard>
</div>
</Section>
);
}

function Steps() {
const itemStyle: React.CSSProperties = {
borderRadius: 16,
padding: 16,
};
return (
<Section id="so-funktionierts">
<div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 24 }}>So funktioniert NOVA</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
<div className="nova-glass-static" style={itemStyle}>
<div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 6 }}>1 · Antworten</div>
<div style={{ fontSize: 15, color: tokens.colors.neutral[500] }}>
Geführte Fragen zu Prozessen, Systemen & Risiken – ohne Vorwissen.
</div>
</div>
<div className="nova-glass-static" style={itemStyle}>
<div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 6 }}>2 · Bewertung</div>
<div style={{ fontSize: 15, color: tokens.colors.neutral[500] }}>
KI bewertet, priorisiert und erzeugt Maßnahmen mit Rechtsbezug.
</div>
</div>
<div className="nova-glass-static" style={itemStyle}>
<div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 6 }}>3 · Export & Umsetzung</div>
<div style={{ fontSize: 15, color: tokens.colors.neutral[500] }}>
PDF/JSON exportieren, Aufgaben zuweisen – fertig.
</div>
</div>
</div>
</Section>
);
}

function SocialProof() {
const quotes = [
{ text: "Endlich eine DSFA, die nicht weh tut – und juristisch sauber bleibt.", author: "M. Schneider", role: "Datenschutzkoordinator" },
{ text: "AI-Act Readiness war sonst ein eigenes Projekt. Jetzt ein Nachmittag.", author: "S. Wagner", role: "IT-Leiterin" },
{ text: "Bericht raus, Maßnahmen klar, Auditor zufrieden.", author: "T. Köhler", role: "DSB" },
];

useEffect(() => {
if (!document.querySelector('#marquee-animation-style')) {
const style = document.createElement('style');
style.id = 'marquee-animation-style';
style.textContent = `
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
.marquee-container {
  overflow: hidden;
  background: rgba(63, 178, 146, 0.12);
  padding: 24px 0;
  margin-top: 15px;
  margin-bottom: 15px;
  border-top: 1px solid rgba(63, 178, 146, 0.3);
  border-bottom: 1px solid rgba(63, 178, 146, 0.3);
}
.marquee-track {
  display: flex;
  gap: 16px;
  animation: marquee 30s linear infinite;
  width: fit-content;
}
.marquee-track:hover {
  animation-play-state: paused;
}
`;
document.head.appendChild(style);
}
}, []);

return (
<div style={{ background: "rgba(63, 178, 146, 0.15)", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", paddingTop: 24, paddingBottom: 24 }}>
<Section id="stimmen">
<div style={{ fontSize: 32, fontWeight: 800, color: tokens.colors.neutral[900], marginBottom: 24 }}>Was Nutzer sagen</div>
<div className="marquee-container">
<div className="marquee-track" style={{ position: "relative", zIndex: 2 }}>
{[...quotes, ...quotes].map((quote, i) => (
<div key={i} style={{ flex: "0 0 auto", width: 300 }}>
<div className="nova-glass-static" style={{ padding: 20, height: "100%" }}>
<p style={{ fontSize: 16, color: tokens.colors.neutral[900], marginBottom: 8 }}>"{quote.text}"</p>
<div style={{ fontSize: 14, color: tokens.colors.neutral[500] }}>{quote.author} · {quote.role}</div>
</div>
</div>
))}
</div>
</div>
</Section>
</div>
);
}

function FeatureBlock({ title, children }: React.PropsWithChildren<{ title: string }>) {
  const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr", gap: 24, alignItems: "center" };
  return (
    <div style={grid}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 16, color: tokens.colors.neutral[500] }}>{children}</div>
      </div>
    </div>
  );
}

function FeatureDeepDive() {
return (
<Section id="features">
<div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 24 }}>Die wichtigsten Features</div>
<div className="content" style={{ display: "grid", gap: 48 }}>
<FeatureBlock title="DSFA-Editor">
Standardisierte Risikoanalyse, Maßnahmenableitung mit Bezug zu EG 75 und Export – auditnah dokumentiert.
</FeatureBlock>
<FeatureBlock title="AI-Act-Wizard">
Geführte Einstufung (High-Risk/GPAI etc.), Deadlines sichtbar, Scoring nachvollziehbar und priorisierte Tasks.
</FeatureBlock>
<FeatureBlock title="Berichte &amp; VVT">
Revisionssichere PDF-Berichte und gepflegtes Verzeichnis der Verarbeitungstätigkeiten – mit wenigen Klicks.
</FeatureBlock>
</div>
</Section>
);
}

function Pricing() {
const Card = ({
name,
price,
features,
highlight = false,
}: {
name: string;
price: string;
features: string[];
highlight?: boolean;
}) => (
<div className="nova-glass-static" style={{ padding: 20, border: highlight ? `2px solid ${tokens.colors.brand.primary}` : "1px solid #e6e9ed" }}>
<div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.neutral[900], display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
<span>{name}</span>
{highlight && <span style={{ fontSize: 12, color: tokens.colors.brand.primary }}>Empfohlen</span>}
</div>
<div style={{ fontSize: 28, fontWeight: 600, marginTop: 8, marginBottom: 12 }}>{price}</div>
<ul style={{ margin: 0, paddingLeft: 18, color: tokens.colors.neutral[500] }}>
{features.map((f, i) => (
<li key={i} style={{ marginBottom: 6 }}>{f}</li>
))}
</ul>
<Link to="/Gespraech-vereinbaren" className="nova-btn nova-btn-primary" style={{ marginTop: 16, display: "inline-block" }}>
  Gespräch vereinbaren
</Link>
</div>
);

return (
<div style={{ background: "linear-gradient(135deg, #ff1d8a 0%, #ff4da6 100%)", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", paddingTop: 48, paddingBottom: 48 }}>
<Section id="preise">
<div style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 24 }}>Preise</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
<Card name="Starter" price="Kostenlos" features={["Demo-Daten", "AI-Act-Wizard (Basis)", "PDF/JSON-Export"]} />
<Card
name="Pro"
price="€ / Nutzer / Monat"
features={["DSFA komplett", "AI-Act-Wizard (voll)", "VVT & Audits", "Team-Rollen"]}
highlight
/>
<Card name="Enterprise" price="Auf Anfrage" features={["SLA & Support", "Mandantenfähigkeit", "SSO", "Eigene Compliance-Templates"]} />
</div>
</Section>
</div>
);
}

function FAQ() {
const items = [
{ q: "Brauche ich Vorkenntnisse?", a: "Nein. Der Wizard führt Schritt für Schritt durch DSFA und AI-Act-Bewertung." },
{ q: "Kann ich Berichte exportieren?", a: "Ja, als PDF und JSON. Vorlagen sind anpassbar." },
{ q: "Ist das für Berater geeignet?", a: "Ja. Rollen/Rechte und Mandanten-Strukturen sind vorgesehen." },
{ q: "Wie sicher sind meine Daten?", a: "EU-Hosting, Verschlüsselung, minimalistische Logs – Datenschutz by Design." },
];
const [open, setOpen] = useState<number | null>(0);

return (
<Section id="faq">
<div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.neutral[900], marginBottom: 12 }}>FAQ</div>
<div>
{items.map((it, i) => (
<div key={i} className="nova-glass-static" style={{ padding: 16, marginBottom: 12 }}>
<button
aria-expanded={open === i}
onClick={() => setOpen(open === i ? null : i)}
style={{ all: "unset", cursor: "pointer", display: "block", width: "100%" }}
>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: tokens.colors.neutral[900] }}>
<span style={{ fontWeight: 600 }}>{it.q}</span>
<span style={{ fontSize: 20, lineHeight: 1 }}>{open === i ? "–" : "+"}</span>
</div>
</button>
{open === i && <div style={{ marginTop: 8, color: tokens.colors.neutral[500] }}>{it.a}</div>}
</div>
))}
</div>
</Section>
);
}

function FinalCTA() {
return (
<Section>
<div
className="nova-glass-static"
style={{
padding: 24,
display: "flex",
justifyContent: "space-between",
alignItems: "center",
flexWrap: "wrap",
gap: 12,
}}
>
<div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.neutral[900] }}>Jetzt in 2 Minuten starten</div>
<Link to="/Gespraech-vereinbaren" className="nova-btn nova-btn-primary">
Gespräch vereinbaren
</Link>
</div>
</Section>
);
}

export default function Landing() {

  return (
    <>
      <LandingNavbar />
      <main style={{ paddingTop: 80 }}>
        <Hero />
        <Benefits />
        <KiAccuracy />
        <Steps />
        <SocialProof />
        <FeatureDeepDive />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  );
}
