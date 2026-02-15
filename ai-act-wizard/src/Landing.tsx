import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "./auth/AuthContext";
import LandingNavbar from "./components/common/LandingNavbar";

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
  const NOVA_GREEN = "#3FB292";

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
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#183939", marginBottom: "0.5rem" }}>
          📊 Dein Datenschutz-Status
        </div>
        <div style={{ fontSize: "11px", color: "#999" }}>
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
          <span style={{ fontWeight: 600, fontSize: "13px", color: "#183939" }}>
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
          <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>Vorfälle</div>
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
          <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>Analysen</div>
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
    background: "linear-gradient(135deg, #f8f9fa 0%, #f0f7f5 100%)",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 64,
  }}
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
      gap: 48,
      alignItems: "center",
      padding: "80px 48px",
      position: "relative",
    }}
  >
    {/* Decorative background elements */}
    <div
      style={{
        position: "absolute",
        top: "-100px",
        right: "-100px",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, rgba(63, 178, 146, 0.1), rgba(24, 57, 57, 0.05))",
        filter: "blur(60px)",
        pointerEvents: "none",
      }}
    />

    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.4,
            marginBottom: 24,
            background: "linear-gradient(90deg, #3FB292 0%, #183939 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-1px",
          }}
        >
          Datenschutz. Klar geregelt. Dauerhaft gepflegt.
        </h1>
        
        <p
          style={{
            fontSize: 20,
            color: "var(--body)",
            lineHeight: 1.6,
            marginBottom: 16,
            fontWeight: 400,
          }}
        >
          Die intelligente KI-Lösung für modernes Datenschutz- und Compliance-Management.
        </p>
        
        <p
          style={{
            fontSize: 16,
            color: "#666",
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          Automatisierte Risikoanalysen, rechtskonforme Dokumentation und 24/7 Datenschutzberatung – alles in einer Plattform.
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
        <Link
          to="/Gespraech-vereinbaren"
          className="button"
          style={{
            padding: "16px 32px",
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 8,
            background: "linear-gradient(90deg, #3FB292, #2d9d7f)",
            color: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(63, 178, 146, 0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(63, 178, 146, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(63, 178, 146, 0.2)";
          }}
        >
          Jetzt Demo buchen
        </Link>
        <Link
          to="/demoanfordern"
          className="button secondary"
          style={{
            padding: "16px 32px",
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 8,
            background: "transparent",
            color: "#3FB292",
            border: "2px solid #3FB292",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(63, 178, 146, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          Info anfordern
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
          fontSize: 14,
          color: "#999",
          fontWeight: 500,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#3FB292", fontSize: 18 }}>✓</span>
          Intelligent
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#3FB292", fontSize: 18 }}>✓</span>
          Einfach
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#3FB292", fontSize: 18 }}>✓</span>
          Made in Europe
        </div>
      </div>
    </div>

    {/* Right side - Animated Dashboard Mockup */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <DashboardMockup />
    </div>
  </div>

  <style>{`
    @keyframes slide {
      0% { transform: translate(-50%, -50%); }
      100% { transform: translate(0, 0); }
    }
    
    @media (max-width: 768px) {
      .hero-section {
        border-radius: 16px !important;
      }
    }
  `}</style>
</header>
);
}

function BenefitCard({ title, children }: React.PropsWithChildren<{ title: string }>) {
return (
<div className="card" style={{ padding: 20 }}>
<div className="title" style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
<div style={{ fontSize: 15, color: "var(--body)" }}>{children}</div>
</div>
);
}

function Benefits() {
return (
<Section id="vorteile">
<div className="title" style={{ marginBottom: 24 }}>Datenschutz einfach gestalten? NOMI hilft Ihnen!</div>
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
background: "var(--card-bg)",
borderRadius: 16,
boxShadow: "var(--card-shadow)",
padding: 16,
};
return (
<Section id="so-funktionierts">
<div className="title" style={{ marginBottom: 24 }}>So funktioniert NOVA</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
<div style={itemStyle}>
<div className="title" style={{ marginBottom: 6 }}>1 · Antworten</div>
<div style={{ fontSize: 15, color: "var(--body)" }}>
Geführte Fragen zu Prozessen, Systemen & Risiken – ohne Vorwissen.
</div>
</div>
<div style={itemStyle}>
<div className="title" style={{ marginBottom: 6 }}>2 · Bewertung</div>
<div style={{ fontSize: 15, color: "var(--body)" }}>
KI bewertet, priorisiert und erzeugt Maßnahmen mit Rechtsbezug.
</div>
</div>
<div style={itemStyle}>
<div className="title" style={{ marginBottom: 6 }}>3 · Export & Umsetzung</div>
<div style={{ fontSize: 15, color: "var(--body)" }}>
PDF/JSON exportieren, Aufgaben zuweisen – fertig.
</div>
</div>
</div>
</Section>
);
}

function Quote({ text, author, role }: { text: string; author: string; role: string }) {
return (
<div className="card" style={{ padding: 20 }}>
<p style={{ fontSize: 16, color: "var(--headline)", marginBottom: 8 }}>“{text}”</p>
<div style={{ fontSize: 14, color: "var(--body)" }}>{author} · {role}</div>
</div>
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
<div className="title" style={{ marginBottom: 24, fontSize: 32, fontWeight: 800, color: "#183939" }}>Was Nutzer sagen</div>
<div className="marquee-container">
<div className="marquee-track" style={{ position: "relative", zIndex: 2 }}>
{[...quotes, ...quotes].map((quote, i) => (
<div key={i} style={{ flex: "0 0 auto", width: 300 }}>
<div className="card" style={{ padding: 20, height: "100%" }}>
<p style={{ fontSize: 16, color: "var(--headline)", marginBottom: 8 }}>"{quote.text}"</p>
<div style={{ fontSize: 14, color: "var(--body)" }}>{quote.author} · {quote.role}</div>
</div>
</div>
))}
</div>
</div>
</Section>
</div>
);
}

function FeatureBlock({ title, children, reverse = false }: React.PropsWithChildren<{ title: string; reverse?: boolean }>) {
  const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr", gap: 24, alignItems: "center" };
  return (
    <div style={grid}>
      <div>
        <div className="title" style={{ marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 16, color: "var(--body)" }}>{children}</div>
      </div>
    </div>
  );
}

function FeatureDeepDive() {
return (
<Section id="features">
<div className="title" style={{ marginBottom: 24 }}>Die wichtigsten Features</div>
<div className="content" style={{ display: "grid", gap: 48 }}>
<FeatureBlock title="DSFA-Editor">
Standardisierte Risikoanalyse, Maßnahmenableitung mit Bezug zu EG 75 und Export – auditnah dokumentiert.
</FeatureBlock>
<FeatureBlock title="AI-Act-Wizard" reverse>
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
<div className="card" style={{ padding: 20, border: highlight ? "2px solid var(--primary)" : "1px solid #e6e9ed" }}>
<div className="title" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
<span>{name}</span>
{highlight && <span style={{ fontSize: 12, color: "var(--primary)" }}>Empfohlen</span>}
</div>
<div style={{ fontSize: 28, fontWeight: 600, marginTop: 8, marginBottom: 12 }}>{price}</div>
<ul style={{ margin: 0, paddingLeft: 18, color: "var(--body)" }}>
{features.map((f, i) => (
<li key={i} style={{ marginBottom: 6 }}>{f}</li>
))}
</ul>
<Link to="/Gespraech-vereinbaren" className="button" style={{ marginTop: 16, display: "inline-block" }}>
  Gespräch vereinbaren
</Link>
</div>
);

return (
<div style={{ background: "linear-gradient(135deg, #ff1d8a 0%, #ff4da6 100%)", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", paddingTop: 48, paddingBottom: 48 }}>
<Section id="preise">
<div className="title" style={{ marginBottom: 24, color: "white" }}>Preise</div>
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
<div className="title" style={{ marginBottom: 12 }}>FAQ</div>
<div>
{items.map((it, i) => (
<div key={i} className="card" style={{ padding: 16, marginBottom: 12 }}>
<button
aria-expanded={open === i}
onClick={() => setOpen(open === i ? null : i)}
style={{ all: "unset", cursor: "pointer", display: "block", width: "100%" }}
>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--headline)" }}>
<span style={{ fontWeight: 600 }}>{it.q}</span>
<span style={{ fontSize: 20, lineHeight: 1 }}>{open === i ? "–" : "+"}</span>
</div>
</button>
{open === i && <div style={{ marginTop: 8, color: "var(--body)" }}>{it.a}</div>}
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
className="card"
style={{
padding: 24,
display: "flex",
justifyContent: "space-between",
alignItems: "center",
flexWrap: "wrap",
gap: 12,
}}
>
<div className="title">Jetzt in 2 Minuten starten</div>
<Link to="/Gespraech-vereinbaren" className="button">
Gespräch vereinbaren
</Link>
</div>
</Section>
);
}

export default function Landing() {
  const { user } = useAuth();

  return (
    <>
      <LandingNavbar />
      <main style={{ paddingTop: 80 }}>
        <Hero />
        <Benefits />
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
