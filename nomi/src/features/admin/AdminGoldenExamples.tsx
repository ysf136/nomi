import { useState, useEffect, useCallback } from "react";
import { tokens } from "../../styles/tokens";
import { useAuth } from "../../auth/AuthContext";
import {
  getAllGoldenExamples,
  addGoldenExample,
  updateGoldenExample,
  deleteGoldenExample,
  type GoldenExample,
  type GoldenDomain,
} from "../../services/golden-examples.service";

const DOMAINS: { id: GoldenDomain; label: string }[] = [
  { id: "incident", label: "Vorfälle" },
  { id: "avv", label: "AVV-Prüfung" },
  { id: "compliance", label: "Compliance" },
];

const domainColor: Record<GoldenDomain, string> = {
  incident: "#e74c3c",
  avv: "#f39c12",
  compliance: tokens.colors.brand.primary,
};

type FormState = {
  domain: GoldenDomain;
  title: string;
  inputJson: string;
  outputJson: string;
  notes: string;
  active: boolean;
};

const emptyForm: FormState = {
  domain: "incident",
  title: "",
  inputJson: "",
  outputJson: "",
  notes: "",
  active: true,
};

/* ── Example templates for each domain ────────────────────── */
const TEMPLATES: Record<GoldenDomain, { input: string; output: string }> = {
  incident: {
    input: JSON.stringify(
      {
        description: "Ein Mitarbeiter hat versehentlich eine E-Mail mit 500 Kundenadressen an den falschen Empfänger gesendet.",
        incidentType: "datenleck",
        affectedPeople: "500 Kunden",
        actionsTaken: "E-Mail-Rückruf angefordert, IT informiert",
        date: "2025-03-10",
      },
      null,
      2,
    ),
    output: JSON.stringify(
      {
        summary: "Versehentlicher E-Mail-Versand von 500 Kundenadressen an falschen Empfänger",
        risk_level: "hoch",
        art33_required: true,
        art33_reasoning: "Risiko für Rechte und Freiheiten der 500 betroffenen Kunden – Meldung an LfD innerhalb 72h erforderlich.",
        art34_required: true,
        art34_reasoning: "Hohes Risiko: Personenbezogene Daten wurden an unbefugte Dritte übermittelt.",
        measures: [
          "E-Mail-Rückruf sicherstellen",
          "Empfänger zur Löschung auffordern",
          "Betroffene informieren",
          "Prozessoptimierung E-Mail-Verteiler",
        ],
      },
      null,
      2,
    ),
  },
  avv: {
    input: JSON.stringify(
      {
        fileName: "AVV_Dienstleister_XY.pdf",
        documentText: "(Auszug) Gegenstand, Art und Zweck der Verarbeitung ...",
      },
      null,
      2,
    ),
    output: JSON.stringify(
      {
        summary: "AVV enthält die Kernpflichten nach Art. 28 DSGVO, jedoch fehlen TOMs im Detail.",
        conformity_score: 72,
        risks: ["Fehlende detaillierte TOMs", "Keine Regelung zu Sub-Auftragsverarbeitern"],
        missing_clauses: ["Art. 28 Abs. 3 lit. h – Löschpflichten"],
        recommendations: [{ item: "TOMs ergänzen", priority: "hoch" }],
        international_transfers: "Keine Drittlandübermittlung erkennbar",
        toms: "Nur allgemein beschrieben, keine konkreten Maßnahmen",
      },
      null,
      2,
    ),
  },
  compliance: {
    input: JSON.stringify(
      {
        name: "ChatBot für Kundenservice",
        description: "KI-basierter Chatbot für First-Level-Support mit Kundendaten",
        useCases: ["Kundenservice", "Ticketing"],
        exposure: "Kunden",
      },
      null,
      2,
    ),
    output: JSON.stringify(
      {
        category: "LimitedRisk",
        summary: "Chatbot fällt unter begrenztes Risiko (AI Act Art. 52) – Transparenzpflichten.",
        legalReferences: ["AI Act Art. 52", "DSGVO Art. 22"],
        obligations: ["Kennzeichnung als KI-System", "DSFA prüfen"],
        deadlines: ["Transparenzpflicht ab Anwendung"],
        priority: "medium",
      },
      null,
      2,
    ),
  },
};

export default function AdminGoldenExamples() {
  const { user } = useAuth();
  const [examples, setExamples] = useState<GoldenExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<GoldenDomain | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setExamples(await getAllGoldenExamples());
    } catch {
      setError("Fehler beim Laden der Goldstandard-Daten.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startNew(domain?: GoldenDomain) {
    const d = domain ?? "incident";
    setForm({ ...emptyForm, domain: d });
    setEditId(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(ex: GoldenExample) {
    setForm({
      domain: ex.domain,
      title: ex.title,
      inputJson: JSON.stringify(ex.input, null, 2),
      outputJson: JSON.stringify(ex.output, null, 2),
      notes: ex.notes ?? "",
      active: ex.active,
    });
    setEditId(ex.id);
    setShowForm(true);
    setError("");
  }

  function loadTemplate() {
    const t = TEMPLATES[form.domain];
    setForm((f) => ({ ...f, inputJson: t.input, outputJson: t.output }));
  }

  async function handleSave() {
    setError("");
    if (!form.title.trim()) {
      setError("Titel ist erforderlich.");
      return;
    }
    let input: Record<string, unknown>;
    let output: Record<string, unknown>;
    try {
      input = JSON.parse(form.inputJson);
    } catch {
      setError("Eingabe-JSON ist ungültig.");
      return;
    }
    try {
      output = JSON.parse(form.outputJson);
    } catch {
      setError("Ausgabe-JSON ist ungültig.");
      return;
    }

    setSaving(true);
    try {
      const data = {
        domain: form.domain,
        title: form.title.trim(),
        input,
        output,
        notes: form.notes.trim() || undefined,
        active: form.active,
        source: "manual" as const,
        createdBy: user?.uid ?? "admin",
      };

      if (editId) {
        await updateGoldenExample(editId, data);
      } else {
        await addGoldenExample(data);
      }
      setShowForm(false);
      await load();
    } catch {
      setError("Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Dieses Goldstandard-Beispiel wirklich löschen?")) return;
    await deleteGoldenExample(id);
    await load();
  }

  async function toggleActive(ex: GoldenExample) {
    await updateGoldenExample(ex.id, { active: !ex.active });
    await load();
  }

  const filtered =
    filter === "all" ? examples : examples.filter((e) => e.domain === filter);

  const counts = {
    all: examples.length,
    incident: examples.filter((e) => e.domain === "incident").length,
    avv: examples.filter((e) => e.domain === "avv").length,
    compliance: examples.filter((e) => e.domain === "compliance").length,
  };

  const activeCounts = {
    incident: examples.filter((e) => e.domain === "incident" && e.active).length,
    avv: examples.filter((e) => e.domain === "avv" && e.active).length,
    compliance: examples.filter((e) => e.domain === "compliance" && e.active).length,
  };

  /* ── Styles ─────────────────────────────────────────────── */
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(12px)",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.06)",
    padding: 24,
    marginBottom: 16,
  };
  const badge = (color: string): React.CSSProperties => ({
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
    background: `${color}18`,
    color,
  });
  const btnPrimary: React.CSSProperties = {
    background: tokens.colors.brand.primary,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 20px",
    fontWeight: 600,
    cursor: "pointer",
  };
  const btnGhost: React.CSSProperties = {
    background: "transparent",
    color: tokens.colors.brand.primary,
    border: `1px solid ${tokens.colors.brand.primary}`,
    borderRadius: 8,
    padding: "8px 16px",
    fontWeight: 600,
    cursor: "pointer",
  };
  const textArea: React.CSSProperties = {
    width: "100%",
    minHeight: 120,
    fontFamily: "monospace",
    fontSize: 13,
    padding: 12,
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.12)",
    resize: "vertical",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: tokens.colors.neutral[900], margin: 0 }}>
            Goldstandard-Daten
          </h1>
          <p style={{ color: tokens.colors.neutral[500], marginTop: 4 }}>
            Verifizierte Referenzfälle für Few-Shot KI-Training
          </p>
        </div>
        <button style={btnPrimary} onClick={() => startNew()}>
          + Neues Beispiel
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {DOMAINS.map((d) => (
          <div key={d.id} style={{ ...card, textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: domainColor[d.id] }}>
              {activeCounts[d.id]}
              <span style={{ fontSize: 16, color: tokens.colors.neutral[400] }}>
                /{counts[d.id]}
              </span>
            </div>
            <div style={{ fontSize: 14, color: tokens.colors.neutral[600], marginTop: 4 }}>
              {d.label} (aktiv/gesamt)
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{ id: "all" as const, label: "Alle" }, ...DOMAINS].map((d) => (
          <button
            key={d.id}
            onClick={() => setFilter(d.id)}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              border: filter === d.id ? "none" : "1px solid rgba(0,0,0,0.12)",
              background: filter === d.id ? tokens.colors.brand.primary : "#fff",
              color: filter === d.id ? "#fff" : tokens.colors.neutral[600],
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {d.label} ({d.id === "all" ? counts.all : counts[d.id]})
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ ...card, border: `2px solid ${tokens.colors.brand.primary}33`, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            {editId ? "Beispiel bearbeiten" : "Neues Goldstandard-Beispiel"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontWeight: 600, fontSize: 13 }}>Domain</label>
              <select
                value={form.domain}
                onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value as GoldenDomain }))}
                style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", marginTop: 4 }}
              >
                {DOMAINS.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: 13 }}>Titel</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="z.B. E-Mail-Fehlversand 500 Kunden"
                style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", marginTop: 4 }}
              />
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: 8 }}>
            <button onClick={loadTemplate} style={{ ...btnGhost, fontSize: 12, padding: "4px 12px" }}>
              Beispiel-Template laden
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontWeight: 600, fontSize: 13 }}>Eingabe (JSON)</label>
              <textarea
                value={form.inputJson}
                onChange={(e) => setForm((f) => ({ ...f, inputJson: e.target.value }))}
                placeholder='{"description": "...", ...}'
                style={{ ...textArea, marginTop: 4 }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: 13 }}>Korrekte Bewertung (JSON)</label>
              <textarea
                value={form.outputJson}
                onChange={(e) => setForm((f) => ({ ...f, outputJson: e.target.value }))}
                placeholder='{"risk_level": "hoch", ...}'
                style={{ ...textArea, marginTop: 4 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, fontSize: 13 }}>Notizen (optional)</label>
            <input
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="z.B. Verifiziert durch RA Müller, 10.03.2026"
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", marginTop: 4 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Aktiv (wird in KI-Prompts eingespeist)</span>
            </label>
          </div>

          {error && (
            <p style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12 }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleSave} disabled={saving} style={btnPrimary}>
              {saving ? "Speichern..." : editId ? "Aktualisieren" : "Speichern"}
            </button>
            <button onClick={() => setShowForm(false)} style={btnGhost}>Abbrechen</button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p style={{ textAlign: "center", color: tokens.colors.neutral[400] }}>Laden…</p>
      ) : filtered.length === 0 ? (
        <div style={{ ...card, textAlign: "center" }}>
          <p style={{ color: tokens.colors.neutral[500], marginBottom: 12 }}>
            Noch keine Goldstandard-Beispiele vorhanden.
          </p>
          <p style={{ color: tokens.colors.neutral[400], fontSize: 13 }}>
            Erstelle verifizierte Referenzfälle, damit die KI bei jeder Analyse kontextbezogener und genauer arbeitet.
          </p>
        </div>
      ) : (
        filtered.map((ex) => (
          <div key={ex.id} style={{ ...card, opacity: ex.active ? 1 : 0.6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <span style={badge(domainColor[ex.domain])}>
                    {DOMAINS.find((d) => d.id === ex.domain)?.label}
                  </span>
                  <span style={badge(ex.active ? "#27ae60" : "#999")}>
                    {ex.active ? "Aktiv" : "Inaktiv"}
                  </span>
                  {ex.source === "promoted" && (
                    <span style={badge("#8e44ad")}>Promoted</span>
                  )}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: tokens.colors.neutral[800] }}>
                  {ex.title}
                </h3>
                {ex.notes && (
                  <p style={{ fontSize: 12, color: tokens.colors.neutral[500], marginTop: 4 }}>{ex.notes}</p>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => toggleActive(ex)} style={{ ...btnGhost, fontSize: 12, padding: "4px 10px" }}>
                  {ex.active ? "Deaktivieren" : "Aktivieren"}
                </button>
                <button onClick={() => startEdit(ex)} style={{ ...btnGhost, fontSize: 12, padding: "4px 10px" }}>
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(ex.id)}
                  style={{ ...btnGhost, fontSize: 12, padding: "4px 10px", color: "#e74c3c", borderColor: "#e74c3c" }}
                >
                  Löschen
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.colors.neutral[400], marginBottom: 4 }}>
                  EINGABE
                </div>
                <pre style={{ fontSize: 11, background: "rgba(0,0,0,0.03)", padding: 10, borderRadius: 8, overflow: "auto", maxHeight: 150, margin: 0 }}>
                  {JSON.stringify(ex.input, null, 2)}
                </pre>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.colors.neutral[400], marginBottom: 4 }}>
                  KORREKTE BEWERTUNG
                </div>
                <pre style={{ fontSize: 11, background: "rgba(0,0,0,0.03)", padding: 10, borderRadius: 8, overflow: "auto", maxHeight: 150, margin: 0 }}>
                  {JSON.stringify(ex.output, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Info box */}
      <div style={{ ...card, background: `${tokens.colors.brand.primary}08`, marginTop: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: tokens.colors.neutral[800], marginBottom: 8 }}>
          Wie funktioniert das Few-Shot Training?
        </h3>
        <ol style={{ fontSize: 13, color: tokens.colors.neutral[600], lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
          <li>Erstelle verifizierte Referenzfälle mit korrekter Eingabe und erwarteter Bewertung.</li>
          <li>Aktivierte Beispiele (max. 3 pro Domain) werden bei jeder KI-Analyse automatisch in den Prompt eingespeist.</li>
          <li>Claude orientiert sich an Stil, Detailtiefe und Bewertungslogik dieser Referenzfälle.</li>
          <li>Nutze die Feedback-Buttons auf KI-Ergebnissen, um gute Analysen direkt als Goldstandard zu speichern.</li>
        </ol>
      </div>
    </div>
  );
}
