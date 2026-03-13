import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../styles/tokens";

const STORAGE_KEY = "nova_training_dsgvo_v2";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const MODULES = [
  {
    id: 1,
    title: "Was sind personenbezogene Daten?",
    icon: "🔍",
    content: `Nach Art. 4 Nr. 1 DSGVO sind personenbezogene Daten alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen. Das Gesetz stellt dabei auf die natürliche Person – also den Menschen – ab; juristische Personen wie GmbHs oder Vereine sind grundsätzlich nicht geschützt.

Ein direkter Personenbezug liegt vor, wenn aus der Information alleine klar wird, um wen es sich handelt – zum Beispiel beim Namen oder einer Foto. Indirekter Personenbezug liegt vor, wenn die Information alleine keine Rückschlüsse erlaubt, aber in Kombination mit anderen Daten eine Identifizierung möglich macht, zum Beispiel eine IP-Adresse, eine Kundennummer oder ein Standortdatensatz.

Besonders sensible Datenkategorien – darunter Gesundheitsdaten, biometrische Daten, religiöse Überzeugungen oder Gewerkschaftszugehörigkeit – werden durch Art. 9 DSGVO besonders geschützt und dürfen grundsätzlich nur unter sehr engen Voraussetzungen verarbeitet werden.

In der Praxis gilt: Bevor Sie Daten erheben, speichern oder weitergeben, fragen Sie sich, ob diese Daten – allein oder kombiniert – eine Person identifizierbar machen. Ist die Antwort ja, greifen die Pflichten der DSGVO.`,
  },
  {
    id: 2,
    title: "Rechtsgrundlagen der Datenverarbeitung",
    icon: "⚖️",
    content: `Das Prinzip der DSGVO lautet: Jede Verarbeitung personenbezogener Daten ist verboten, es sei denn, sie ist durch eine der in Art. 6 Abs. 1 DSGVO genannten Rechtsgrundlagen gestattet – sogenanntes Verbotsprinzip mit Erlaubnisvorbehalt.

Die sechs Rechtsgrundlagen im Überblick:

• Einwilligung (Art. 6 Abs. 1 lit. a): Freiwillig, informiert, eindeutig, spezifisch und jederzeit widerrufbar. Eine vorangekreuzte Checkbox reicht nicht aus.
• Vertragserfüllung (lit. b): Verarbeitung ist notwendig, um einen Vertrag mit der Person zu erfüllen oder vorvertragliche Maßnahmen zu treffen.
• Rechtliche Verpflichtung (lit. c): Zum Beispiel steuerliche Aufbewahrungspflichten.
• Schutz lebenswichtiger Interessen (lit. d): In Notfällen, wenn Leib und Leben gefährdet sind.
• Öffentliche Aufgabe / öffentliches Interesse (lit. e): Für Behörden und öffentliche Stellen.
• Berechtigte Interessen (lit. f): Der Verantwortliche oder Dritte haben ein berechtigtes Interesse, das die Interessen der betroffenen Person nicht überwiegt – Abwägung erforderlich.

Wichtig: Die Rechtsgrundlage muss vor Beginn der Verarbeitung feststehen und dokumentiert sein. Ein Wechsel der Rechtsgrundlage im Nachhinein ist nicht ohne weiteres möglich.`,
  },
  {
    id: 3,
    title: "Rechte der betroffenen Personen",
    icon: "👤",
    content: `Die DSGVO räumt betroffenen Personen umfangreiche Rechte ein, die in den Artikeln 15 bis 22 geregelt sind. Als Mitarbeiter sind Sie oft der erste Kontaktpunkt, wenn eine Person ihre Rechte geltend macht.

• Auskunftsrecht (Art. 15): Jede Person kann fragen, ob und welche Daten über sie verarbeitet werden, zu welchem Zweck und wie lange.
• Recht auf Berichtigung (Art. 16): Unrichtige Daten müssen korrigiert werden.
• Recht auf Löschung / "Recht auf Vergessenwerden" (Art. 17): Unter bestimmten Voraussetzungen müssen Daten gelöscht werden – z.B. wenn der Zweck entfällt oder die Einwilligung widerrufen wurde.
• Recht auf Einschränkung (Art. 18): Die Verarbeitung kann temporär eingeschränkt werden, z.B. während eine Berichtigung geprüft wird.
• Recht auf Datenübertragbarkeit (Art. 20): Daten können in strukturierter Form herausverlangt werden, um sie zu einem anderen Anbieter zu übertragen.
• Widerspruchsrecht (Art. 21): Gegen Verarbeitungen auf Basis berechtigter Interessen kann widersprochen werden.

Fristen: Anfragen sind ohne unangemessene Verzögerung, spätestens aber innerhalb eines Monats zu beantworten. Bei komplexen Fällen kann eine Verlängerung auf drei Monate erfolgen. Leiten Sie Betroffenenanfragen immer sofort an die zuständige Stelle weiter.`,
  },
  {
    id: 4,
    title: "Datenpannen und Meldepflichten",
    icon: "🚨",
    content: `Eine Datenpanne (Datenschutzverletzung nach Art. 4 Nr. 12 DSGVO) liegt vor, wenn personenbezogene Daten versehentlich oder unbefugt vernichtet, verloren, verändert oder offenbart werden. Beispiele: verlorene USB-Sticks mit Kundendaten, an den falschen Empfänger gesendete E-Mails, Hackerangriffe auf Datenbanken oder gestohlene Laptops ohne Verschlüsselung.

Meldepflichten nach DSGVO:

• An die Aufsichtsbehörde (Art. 33): Wenn die Verletzung voraussichtlich zu einem Risiko für die Rechte und Freiheiten von Personen führt, muss der Verantwortliche dies innerhalb von 72 Stunden melden – ab dem Zeitpunkt, zu dem er Kenntnis erlangt.
• An die Betroffenen (Art. 34): Bei hohem Risiko für Betroffene sind diese direkt und unverzüglich zu informieren.

Die 72-Stunden-Frist ist absolut. Daher gilt: Jeder Mitarbeiter, der eine mögliche Datenpanne bemerkt – sei es ein falsch versandtes Fax oder ein verlorenes Gerät – muss dies sofort intern melden. Nur so kann das Unternehmen die Frist einhalten. Schweigen oder Abwarten ist keine Option.`,
  },
  {
    id: 5,
    title: "Auftragsverarbeitung und AV-Vertrag",
    icon: "📄",
    content: `Wenn ein Unternehmen personenbezogene Daten nicht selbst verarbeitet, sondern einen externen Dienstleister damit beauftragt – zum Beispiel einen Cloud-Anbieter, ein Lohnbüro oder einen IT-Support –, spricht man von Auftragsverarbeitung (Art. 28 DSGVO).

Der Auftragsverarbeiter handelt ausschließlich auf Weisung des Verantwortlichen und darf die Daten nicht für eigene Zwecke nutzen.

Pflichten:

• Es muss zwingend ein schriftlicher Auftragsverarbeitungsvertrag (AV-Vertrag) geschlossen werden (Art. 28 Abs. 3 DSGVO). Ohne diesen Vertrag ist die Datenübermittlung rechtswidrig.
• Der AV-Vertrag muss bestimmte Mindestinhalte haben: Gegenstand und Dauer, Art und Zweck der Verarbeitung, Weisungsbindung, Sicherheitsmaßnahmen, Unterauftragsverarbeiter-Regelung, Rückgabe/Löschung der Daten nach Auftragsende.
• Der Verantwortliche ist verpflichtet, seinen Auftragsverarbeiter regelmäßig zu kontrollieren – durch Audits, Zertifikate oder Fragebögen.

Praxisbeispiel: Nutzen Sie Google Workspace, Microsoft 365 oder einen externen Newsletter-Dienst? Dann verarbeiten diese Anbieter personenbezogene Daten in Ihrem Auftrag. Ein gültiger AV-Vertrag mit jedem dieser Anbieter ist zwingend erforderlich.`,
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Eine IP-Adresse gilt nach der DSGVO als personenbezogenes Datum. Warum?",
    options: [
      "Weil IP-Adressen immer einen Namen beinhalten",
      "Weil sie in Kombination mit anderen Daten eine Person identifizierbar machen können",
      "Weil sie nur von Behörden genutzt werden dürfen",
      "Weil IP-Adressen immer Standortdaten enthalten",
    ],
    correct: 1,
    explanation:
      "IP-Adressen können in Kombination mit anderen Daten (z.B. beim Internetprovider) einer Person zugeordnet werden. Das reicht für Personenbezug nach Art. 4 Nr. 1 DSGVO aus – auch ohne direkten Namen.",
  },
  {
    id: 2,
    question: "Sie möchten Kundendaten für einen Werbenewsletter nutzen. Welche Rechtsgrundlage ist am geeignetsten?",
    options: [
      "Berechtigte Interessen (Art. 6 Abs. 1 lit. f)",
      "Vertragserfüllung (Art. 6 Abs. 1 lit. b)",
      "Einwilligung (Art. 6 Abs. 1 lit. a)",
      "Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c)",
    ],
    correct: 2,
    explanation:
      "Für Werbezwecke ist die Einwilligung die primäre Rechtsgrundlage. Sie muss freiwillig, informiert und eindeutig erteilt werden – vorangekreuzte Kästchen genügen nicht.",
  },
  {
    id: 3,
    question: "Eine Person stellt eine Auskunftsanfrage per E-Mail. Innerhalb welcher Frist müssen Sie antworten?",
    options: [
      "7 Tage",
      "14 Tage",
      "1 Monat (verlängerbar auf 3 Monate bei Komplexität)",
      "3 Monate ohne Ausnahmen",
    ],
    correct: 2,
    explanation:
      "Gemäß Art. 12 Abs. 3 DSGVO muss spätestens innerhalb eines Monats geantwortet werden. Bei komplexen Fällen sind weitere zwei Monate möglich – die Person ist darüber zu informieren.",
  },
  {
    id: 4,
    question: "Sie bemerken, dass Sie gestern versehentlich eine E-Mail mit Kundendaten an den falschen Empfänger gesendet haben. Was tun Sie?",
    options: [
      "Nichts – ein einmaliger Fehler ist harmlos",
      "Den Empfänger bitten, die E-Mail zu löschen, ohne es intern zu melden",
      "Den Vorfall sofort intern melden, damit das Unternehmen die 72-Stunden-Meldepflicht prüfen kann",
      "Abwarten, ob sich der Empfänger beschwert",
    ],
    correct: 2,
    explanation:
      "Art. 33 DSGVO verlangt die Meldung an die Aufsichtsbehörde innerhalb von 72 Stunden ab Kenntnis des Unternehmens. Daher muss jeder Mitarbeiter solche Vorfälle sofort intern melden.",
  },
  {
    id: 5,
    question: "Sie beauftragen einen externen IT-Dienstleister mit Zugriff auf Ihre Kundendatenbank. Was ist zwingend erforderlich?",
    options: [
      "Eine mündliche Vereinbarung über Vertraulichkeit",
      "Ein schriftlicher Auftragsverarbeitungsvertrag (AV-Vertrag) nach Art. 28 DSGVO",
      "Ein einfaches NDA (Non-Disclosure Agreement)",
      "Eine Registrierung beim Landesdatenschutzbeauftragten",
    ],
    correct: 1,
    explanation:
      "Ein schriftlicher AV-Vertrag nach Art. 28 DSGVO ist gesetzlich vorgeschrieben, sobald ein externer Dienstleister personenbezogene Daten in Ihrem Auftrag verarbeitet. Ohne diesen Vertrag ist die Übermittlung rechtswidrig.",
  },
];

type Screen = "overview" | "module" | "quiz" | "result";

interface SavedState {
  completedModules: number[];
  quizPassed: boolean;
  lastScore: number;
}

export default function Training() {
  const nav = useNavigate();
  const NOVA_GREEN = tokens.colors.brand.primary;
  const NOVA_DARK = tokens.colors.neutral[900];

  const [screen, setScreen] = useState<Screen>("overview");
  const [activeModule, setActiveModule] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [quizPassed, setQuizPassed] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const saved: SavedState = JSON.parse(raw);
        setCompletedModules(saved.completedModules || []);
        setQuizPassed(saved.quizPassed || false);
        setLastScore(saved.lastScore || 0);
      } catch {}
    }
  }, []);

  const saveState = (mods: number[], passed: boolean, score: number) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedModules: mods, quizPassed: passed, lastScore: score }));
  };

  const markModuleRead = (id: number) => {
    if (!completedModules.includes(id)) {
      const updated = [...completedModules, id];
      setCompletedModules(updated);
      saveState(updated, quizPassed, lastScore);
    }
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    QUIZ.forEach((q) => { if (quizAnswers[q.id] === q.correct) correct++; });
    const score = Math.round((correct / QUIZ.length) * 100);
    const passed = score >= 80;
    setLastScore(score);
    setQuizPassed(passed);
    saveState(completedModules, passed, score);
    setScreen("result");
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setScreen("quiz");
  };

  const allModulesRead = MODULES.every((m) => completedModules.includes(m.id));

  // ── Overview screen ──
  if (screen === "overview") {
    return (
      <div style={{ padding: "2rem 1rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="nova-glass-static" style={{ borderRadius: 20, padding: "2rem", marginBottom: "1.5rem" }}>
            <button onClick={() => nav("/welcome")} className="nova-btn nova-btn-ghost nova-btn-sm" style={{ marginBottom: "1rem" }}>
              &larr; Zurück
            </button>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ margin: "0 0 8px", color: NOVA_DARK, fontSize: 26 }}>📚 DSGVO-Grundlagen für Mitarbeiter</h1>
                <p style={{ margin: 0, color: "#6B7280", fontSize: 15, lineHeight: 1.6 }}>
                  Praxisnahe Einführung in die wichtigsten Datenschutzpflichten – verständlich aufbereitet für alle Mitarbeiter.
                </p>
              </div>
              {quizPassed && (
                <div style={{ background: `${NOVA_GREEN}18`, border: `1px solid ${NOVA_GREEN}40`, borderRadius: 12, padding: "10px 16px", fontSize: 13, color: NOVA_GREEN, fontWeight: 600, whiteSpace: "nowrap" }}>
                  ✓ Schulung bestanden ({lastScore}%)
                </div>
              )}
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
                <span>Module gelesen</span>
                <span>{completedModules.length} / {MODULES.length}</span>
              </div>
              <div style={{ height: 8, background: "rgba(0,0,0,0.06)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ width: `${(completedModules.length / MODULES.length) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${NOVA_GREEN}, #2d9d7f)`, borderRadius: 6, transition: "width 0.4s ease" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            {MODULES.map((m) => {
              const done = completedModules.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => { setActiveModule(m.id - 1); setScreen("module"); }}
                  style={{
                    all: "unset", cursor: "pointer", display: "block",
                    background: done ? `linear-gradient(135deg, ${NOVA_GREEN}12, ${NOVA_GREEN}06)` : "rgba(255,255,255,0.72)",
                    border: `1px solid ${done ? NOVA_GREEN + "40" : "rgba(255,255,255,0.25)"}`,
                    borderRadius: 16, padding: "1.25rem",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 24 }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: NOVA_DARK, fontSize: 14 }}>Modul {m.id}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF" }}>5–10 Min Lektüre</div>
                    </div>
                    {done && <span style={{ color: NOVA_GREEN, fontSize: 18, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ fontWeight: 600, color: NOVA_DARK, fontSize: 14, lineHeight: 1.4 }}>{m.title}</div>
                </button>
              );
            })}
          </div>

          <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 700, color: NOVA_DARK, fontSize: 16, marginBottom: 4 }}>🎯 Abschluss-Quiz</div>
              <div style={{ color: "#6B7280", fontSize: 14 }}>
                {allModulesRead
                  ? "Alle Module gelesen – testen Sie jetzt Ihr Wissen (5 Fragen, min. 80% zum Bestehen)."
                  : `Bitte lesen Sie zunächst alle ${MODULES.length - completedModules.length} verbleibenden Module.`}
              </div>
            </div>
            <button
              onClick={resetQuiz}
              disabled={!allModulesRead}
              className="nova-btn nova-btn-primary"
              style={{ borderRadius: 999, padding: "10px 28px", opacity: allModulesRead ? 1 : 0.45 }}
            >
              {quizPassed ? "Quiz wiederholen" : "Quiz starten"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Module screen ──
  if (screen === "module") {
    const mod = MODULES[activeModule];
    const done = completedModules.includes(mod.id);
    return (
      <div style={{ padding: "2rem 1rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
            <button onClick={() => setScreen("overview")} className="nova-btn nova-btn-ghost nova-btn-sm">&larr; Übersicht</button>
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>Modul {mod.id} von {MODULES.length}</div>
          </div>
          <div className="nova-glass-static" style={{ borderRadius: 20, padding: "2.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
              <span style={{ fontSize: 32 }}>{mod.icon}</span>
              <div>
                <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>MODUL {mod.id}</div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: NOVA_DARK }}>{mod.title}</h2>
              </div>
            </div>
            <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>{mod.content}</div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setScreen("overview")} className="nova-btn nova-btn-ghost">&larr; Zurück zur Übersicht</button>
            <div style={{ display: "flex", gap: 12 }}>
              {activeModule > 0 && (
                <button onClick={() => setActiveModule(activeModule - 1)} className="nova-btn nova-btn-ghost">‹ Vorheriges</button>
              )}
              {!done ? (
                <button
                  onClick={() => {
                    markModuleRead(mod.id);
                    if (activeModule < MODULES.length - 1) setActiveModule(activeModule + 1);
                    else setScreen("overview");
                  }}
                  className="nova-btn nova-btn-primary"
                  style={{ borderRadius: 999 }}
                >
                  {activeModule < MODULES.length - 1 ? "Gelesen & Weiter →" : "Gelesen & Zur Übersicht"}
                </button>
              ) : (
                activeModule < MODULES.length - 1 ? (
                  <button onClick={() => setActiveModule(activeModule + 1)} className="nova-btn nova-btn-primary" style={{ borderRadius: 999 }}>
                    Nächstes Modul →
                  </button>
                ) : (
                  <button onClick={() => setScreen("overview")} className="nova-btn nova-btn-primary" style={{ borderRadius: 999 }}>
                    Zur Übersicht
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz screen ──
  if (screen === "quiz") {
    return (
      <div style={{ padding: "2rem 1rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
            <button onClick={() => setScreen("overview")} className="nova-btn nova-btn-ghost nova-btn-sm">&larr; Abbrechen</button>
          </div>
          <div className="nova-glass-static" style={{ borderRadius: 20, padding: "2rem", marginBottom: "1.5rem" }}>
            <h2 style={{ margin: "0 0 6px", color: NOVA_DARK }}>🎯 Abschluss-Quiz</h2>
            <p style={{ margin: "0 0 1.5rem", color: "#6B7280", fontSize: 14 }}>5 Fragen · Min. 80% zum Bestehen · Wählen Sie die beste Antwort</p>
            {QUIZ.map((q, qi) => (
              <div key={q.id} style={{ marginBottom: qi < QUIZ.length - 1 ? "2rem" : 0 }}>
                <div style={{ fontWeight: 700, color: NOVA_DARK, marginBottom: "0.75rem", fontSize: 15 }}>
                  {qi + 1}. {q.question}
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: oi })}
                      style={{
                        all: "unset", cursor: "pointer", display: "block",
                        padding: "10px 14px", borderRadius: 10, fontSize: 14, fontWeight: 500,
                        transition: "all 0.15s",
                        background: quizAnswers[q.id] === oi ? `${NOVA_GREEN}20` : "rgba(0,0,0,0.03)",
                        border: `1.5px solid ${quizAnswers[q.id] === oi ? NOVA_GREEN : "transparent"}`,
                        color: quizAnswers[q.id] === oi ? NOVA_GREEN : "#374151",
                      }}
                    >
                      <span style={{ marginRight: 8, fontSize: 13, opacity: 0.5 }}>{String.fromCharCode(65 + oi)}.</span> {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(quizAnswers).length < QUIZ.length}
              className="nova-btn nova-btn-primary"
              style={{ borderRadius: 999, padding: "12px 36px", opacity: Object.keys(quizAnswers).length < QUIZ.length ? 0.45 : 1 }}
            >
              Auswerten →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Result screen ──
  const correctCount = QUIZ.filter((q) => quizAnswers[q.id] === q.correct).length;
  return (
    <div style={{ padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div className="nova-glass-static" style={{ borderRadius: 20, padding: "2.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{quizPassed ? "🎉" : "📝"}</div>
          <h2 style={{ margin: "0 0 8px", color: NOVA_DARK, fontSize: 24 }}>
            {quizPassed ? "Schulung bestanden!" : "Nicht bestanden – versuchen Sie es erneut"}
          </h2>
          <div style={{ fontSize: 48, fontWeight: 800, color: quizPassed ? NOVA_GREEN : "#EF4444", margin: "12px 0" }}>{lastScore}%</div>
          <div style={{ color: "#6B7280", fontSize: 15 }}>
            {correctCount} von {QUIZ.length} Fragen richtig · Mindestens 80% erforderlich
          </div>
          {quizPassed && (
            <div style={{ marginTop: 16, padding: "10px 20px", background: `${NOVA_GREEN}12`, border: `1px solid ${NOVA_GREEN}30`, borderRadius: 12, display: "inline-block", fontSize: 13, color: NOVA_GREEN, fontWeight: 600 }}>
              ✓ Erfolgreich abgeschlossen am {new Date().toLocaleDateString("de-DE")}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
          {QUIZ.map((q, qi) => {
            const userAnswer = quizAnswers[q.id];
            const isCorrect = userAnswer === q.correct;
            return (
              <div
                key={q.id}
                className="nova-glass-static"
                style={{ borderRadius: 16, padding: "1.25rem", borderLeft: `4px solid ${isCorrect ? NOVA_GREEN : "#EF4444"}` }}
              >
                <div style={{ fontWeight: 700, color: NOVA_DARK, marginBottom: 6, fontSize: 14 }}>
                  {isCorrect ? "✓" : "✗"} Frage {qi + 1}: {q.question}
                </div>
                <div style={{ fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: "#9CA3AF" }}>Ihre Antwort: </span>
                  <span style={{ color: isCorrect ? NOVA_GREEN : "#EF4444", fontWeight: 600 }}>{q.options[userAnswer]}</span>
                </div>
                {!isCorrect && (
                  <div style={{ fontSize: 13, marginBottom: 8 }}>
                    <span style={{ color: "#9CA3AF" }}>Richtige Antwort: </span>
                    <span style={{ color: NOVA_GREEN, fontWeight: 600 }}>{q.options[q.correct]}</span>
                  </div>
                )}
                <div style={{ fontSize: 13, color: "#4B5563", background: "rgba(0,0,0,0.03)", borderRadius: 8, padding: "8px 12px", lineHeight: 1.6 }}>
                  💡 {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {!quizPassed && (
            <button onClick={resetQuiz} className="nova-btn nova-btn-primary" style={{ borderRadius: 999, padding: "10px 28px" }}>
              Quiz wiederholen
            </button>
          )}
          <button onClick={() => setScreen("overview")} className="nova-btn nova-btn-ghost" style={{ borderRadius: 999, padding: "10px 28px" }}>
            Zur Übersicht
          </button>
          <button onClick={() => nav("/welcome")} className="nova-btn nova-btn-ghost" style={{ borderRadius: 999, padding: "10px 28px" }}>
            &larr; Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
