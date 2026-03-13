import React, { useState, useMemo } from "react"
import {
  assessOrg,
  OrgProfile,
  AISystem,
  Governance,
  categorizeSystem,
  calcSystemScore,
  buildObligations,
} from "../../lib/ai_act_scoring"
import { downloadJSON, downloadPDF } from "../../lib/exporters"
import AIPoweredBadge from "../../components/common/AIPoweredBadge"

/* ---------------------- Wizard ---------------------- */
export default function AiActWizard() {
  const [step, setStep] = useState(1)
  const [org, setOrg] = useState<OrgProfile>({ name: "", size: "mittel", roles: [] })
  const [systems, setSystems] = useState<AISystem[]>([exampleSystem()])

  const assessment = useMemo(() => assessOrg(org, systems), [org, systems])

  const labels = ["Organisation", "Systeme", "Governance", "Vorprüfung", "Ergebnis"]

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700 }}>AI-Act-Readiness-Wizard</h1>
        <AIPoweredBadge tooltip="KI-gestützte Analyse nach EU AI Act und DSGVO" />
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {labels.map((l, i) => (
          <div key={l} className={i + 1 === step ? "nova-badge nova-badge-success" : "nova-badge"} style={{ fontSize: 13 }}>
            {i + 1}. {l}
          </div>
        ))}
      </div>

      {/* STEP 1: Organisation */}
      {step === 1 && (
        <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", fontWeight: 600 }}>Organisation</h2>
          <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Name</label>
          <input
            className="nova-input"
            style={{ marginBottom: 12 }}
            value={org.name}
            onChange={(e) => setOrg({ ...org, name: e.target.value })}
          />

          <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Größe</label>
          <select
            className="nova-input"
            style={{ marginBottom: 12 }}
            value={org.size}
            onChange={(e) => setOrg({ ...org, size: e.target.value as OrgProfile["size"] })}
          >
            <option value="Kleinst/klein">Kleinst/klein</option>
            <option value="mittel">Mittel</option>
            <option value="groß">Groß</option>
          </select>

          <fieldset style={{ marginBottom: 12, border: "none", padding: 0 }}>
            <legend style={{ fontSize: 14, marginBottom: 4 }}>Rollen</legend>
            {(["Provider", "Deployer", "Importer", "Distributor"] as OrgProfile["roles"]).map((r) => (
              <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 4 }}>
                <input
                  type="checkbox"
                  checked={org.roles.includes(r)}
                  onChange={(e) =>
                    setOrg((prev) => ({
                      ...prev,
                      roles: e.target.checked ? [...prev.roles, r] : prev.roles.filter((x) => x !== r),
                    }))
                  }
                />
                {r}
              </label>
            ))}
          </fieldset>
        </div>
      )}

      {/* STEP 2: Systeme */}
      {step === 2 && (
        <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", fontWeight: 600 }}>Systeme</h2>
          {systems.map((s, idx) => (
            <div key={s.id} style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "1rem", marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Name</label>
              <input
                className="nova-input"
                style={{ marginBottom: 12 }}
                value={s.name}
                onChange={(e) => updateSystem(idx, { name: e.target.value })}
              />

              <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Rolle (System)</label>
              <select
                className="nova-input"
                style={{ marginBottom: 12 }}
                value={s.providerOrDeployer}
                onChange={(e) => updateSystem(idx, { providerOrDeployer: e.target.value as AISystem["providerOrDeployer"] })}
              >
                <option value="Provider">Provider</option>
                <option value="Deployer">Deployer</option>
              </select>

              <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Exposure</label>
              <select
                className="nova-input"
                style={{ marginBottom: 12 }}
                value={s.exposure}
                onChange={(e) => updateSystem(idx, { exposure: e.target.value as AISystem["exposure"] })}
              >
                <option>PoC/Pilot</option>
                <option>Intern begrenzt</option>
                <option>Unternehmensweit/Kundenseitig</option>
              </select>
            </div>
          ))}
          <button
            className="nova-btn nova-btn-ghost nova-btn-sm"
            onClick={() => setSystems((arr) => [...arr, exampleSystem()])}
          >
            + weiteres System
          </button>
        </div>
      )}

      {/* STEP 3: Governance */}
      {step === 3 && (
        <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", fontWeight: 600 }}>Governance</h2>
          {systems.map((s, idx) => (
            <div key={s.id} style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "1rem", marginBottom: 12 }}>
              <ControlSelect label="Risikomanagement (Art. 9)" value={s.governance.rms} onChange={(m) => updateGovernance(idx, { rms: m })} />
              <ControlSelect label="Technische Doku (Art. 11)" value={s.governance.techDoc} onChange={(m) => updateGovernance(idx, { techDoc: m })} />
              <ControlSelect label="Human Oversight (Art. 14)" value={s.governance.oversight} onChange={(m) => updateGovernance(idx, { oversight: m })} />
            </div>
          ))}
        </div>
      )}

      {/* STEP 4: Vorprüfung */}
      {step === 4 && (
        <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", fontWeight: 600 }}>Vorprüfung</h2>
          {systems.map((s) => {
            const cat = categorizeSystem(s)
            const sc = calcSystemScore(s)
            return (
              <div key={s.id} style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "1rem", marginBottom: 12 }}>
                <div style={{ fontWeight: 600 }}>{s.name || "System"} – {cat} (Score: {sc})</div>
                <ul style={{ paddingLeft: "1.5rem", fontSize: 14, marginTop: 8 }}>
                  {buildObligations(cat, s).map((o) => (
                    <li key={o.label}>{o.label} {o.deadline && `(bis ${o.deadline})`}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}

      {/* STEP 5: Ergebnis */}
      {step === 5 && (
        <div className="nova-glass-static" style={{ borderRadius: 16, padding: "1.5rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", fontWeight: 600 }}>Ergebnis</h2>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>{assessment.readinessScore} / 100 – {assessment.scoreBand}</div>
          <h3 style={{ fontWeight: 600 }}>Systeme</h3>
          <ul style={{ paddingLeft: "1.5rem" }}>
            {assessment.systems.map((sa) => (
              <li key={sa.systemId}>{sa.name} – {sa.category} (Score: {sa.systemScore})</li>
            ))}
          </ul>
          <h3 style={{ fontWeight: 600, marginTop: 12 }}>Maßnahmen</h3>
          <ol style={{ paddingLeft: "1.5rem" }}>
            {assessment.prioritizedActions.map((a) => (
              <li key={a.label}>{a.label}</li>
            ))}
          </ol>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button className="nova-btn nova-btn-secondary" onClick={() => downloadPDF(assessment)}>PDF exportieren</button>
            <button className="nova-btn nova-btn-secondary" onClick={() => downloadJSON(assessment)}>JSON exportieren</button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))} className="nova-btn nova-btn-secondary">
          Zurück
        </button>
        {step < 5 ? (
          <button onClick={() => setStep((s) => s + 1)} className="nova-btn nova-btn-primary">
            Weiter
          </button>
        ) : (
          <button onClick={() => setStep(1)} className="nova-btn nova-btn-ghost">
            Neu beginnen
          </button>
        )}
      </div>
    </div>
  )

  // ----- Helpers -----
  function updateSystem(idx: number, patch: Partial<AISystem>) {
    setSystems((arr) => arr.map((s, i) => (i === idx ? { ...s, ...patch } : s)))
  }

  function updateGovernance(idx: number, patch: Partial<Governance>) {
    setSystems((arr) => arr.map((s, i) => (i === idx ? { ...s, governance: { ...s.governance, ...patch } } : s)))
  }
}

/* ---------------------- Controls ---------------------- */
const ControlSelect: React.FC<{ label: string; value: number; onChange: (m: any) => void }> = ({ label, value, onChange }) => (
  <div style={{ marginBottom: 8 }}>
    <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>{label}</label>
    <select
      className="nova-input"
      value={String(value)}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value={0}>0 – nicht vorhanden</option>
      <option value={1}>1 – geplant</option>
      <option value={2}>2 – teilweise</option>
      <option value={3}>3 – vollständig</option>
    </select>
  </div>
)

/* ---------------------- Example Data ---------------------- */
function exampleSystem(): AISystem {
  return {
    id: Math.random().toString(36).slice(2),
    name: "",
    description: "",
    providerOrDeployer: "Deployer",
    useCases: [],
    annexIII: [],
    biometricFunctions: [],
    interactsWithHumans: false,
    generatesSyntheticContent: false,
    isGPAIModel: false,
    reliesOnGPAIFromOthers: false,
    exposure: "Intern begrenzt",
    governance: { rms: 0, dataGov: 0, techDoc: 0, logging: 0, oversight: 0, pmp: 0, qms: 0, supplierDocs: "keine" },
  }
}
