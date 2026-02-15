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

/* ---------------------- Wizard ---------------------- */
export default function AiActWizard() {
  const [step, setStep] = useState(1)
  const [org, setOrg] = useState<OrgProfile>({ name: "", size: "mittel", roles: [] })
  const [systems, setSystems] = useState<AISystem[]>([exampleSystem()])

  const assessment = useMemo(() => assessOrg(org, systems), [org, systems])

  const labels = ["Organisation", "Systeme", "Governance", "Vorprüfung", "Ergebnis"]

  return (
    <div className="container content" style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h1 className="title mb-4">AI-Act-Readiness-Wizard</h1>

      {/* Step indicator */}
      <div className="mb-6 flex gap-2">
        {labels.map((l, i) => (
          <div key={l} className={`px-3 py-1 rounded ${i + 1 === step ? "bg-green-600 text-white" : "bg-gray-200"}`}>
            {i + 1}. {l}
          </div>
        ))}
      </div>

      {/* STEP 1: Organisation */}
      {step === 1 && (
        <div>
          <h2 className="font-semibold mb-3">Organisation</h2>
          <label className="block text-sm">Name</label>
          <input
            className="border rounded px-3 py-2 mb-3 w-full"
            value={org.name}
            onChange={(e) => setOrg({ ...org, name: e.target.value })}
          />

          <label className="block text-sm">Größe</label>
          <select
            className="border rounded px-3 py-2 mb-3 w-full"
            value={org.size}
            onChange={(e) => setOrg({ ...org, size: e.target.value as OrgProfile["size"] })}
          >
            <option value="Kleinst/klein">Kleinst/klein</option>
            <option value="mittel">Mittel</option>
            <option value="groß">Groß</option>
          </select>

          <fieldset className="mb-3">
            <legend className="text-sm">Rollen</legend>
            {(["Provider", "Deployer", "Importer", "Distributor"] as OrgProfile["roles"]).map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm mb-1">
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
        <div>
          <h2 className="font-semibold mb-3">Systeme</h2>
          {systems.map((s, idx) => (
            <div key={s.id} className="border rounded p-3 mb-3">
              <label className="block text-sm">Name</label>
              <input
                className="border rounded px-3 py-2 mb-3 w-full"
                value={s.name}
                onChange={(e) => updateSystem(idx, { name: e.target.value })}
              />

              <label className="block text-sm">Rolle (System)</label>
              <select
                className="border rounded px-3 py-2 mb-3 w-full"
                value={s.providerOrDeployer}
                onChange={(e) => updateSystem(idx, { providerOrDeployer: e.target.value as AISystem["providerOrDeployer"] })}
              >
                <option value="Provider">Provider</option>
                <option value="Deployer">Deployer</option>
              </select>

              <label className="block text-sm">Exposure</label>
              <select
                className="border rounded px-3 py-2 mb-3 w-full"
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
            className="px-3 py-2 rounded bg-gray-100 border"
            onClick={() => setSystems((arr) => [...arr, exampleSystem()])}
          >
            + weiteres System
          </button>
        </div>
      )}

      {/* STEP 3: Governance */}
      {step === 3 && (
        <div>
          <h2 className="font-semibold mb-3">Governance</h2>
          {systems.map((s, idx) => (
            <div key={s.id} className="border rounded p-3 mb-3">
              <ControlSelect label="Risikomanagement (Art. 9)" value={s.governance.rms} onChange={(m) => updateGovernance(idx, { rms: m })} />
              <ControlSelect label="Technische Doku (Art. 11)" value={s.governance.techDoc} onChange={(m) => updateGovernance(idx, { techDoc: m })} />
              <ControlSelect label="Human Oversight (Art. 14)" value={s.governance.oversight} onChange={(m) => updateGovernance(idx, { oversight: m })} />
            </div>
          ))}
        </div>
      )}

      {/* STEP 4: Vorprüfung */}
      {step === 4 && (
        <div>
          <h2 className="font-semibold mb-3">Vorprüfung</h2>
          {systems.map((s) => {
            const cat = categorizeSystem(s)
            const sc = calcSystemScore(s)
            return (
              <div key={s.id} className="border rounded p-3 mb-3">
                <div>{s.name || "System"} – {cat} (Score: {sc})</div>
                <ul className="list-disc ml-6 text-sm">
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
        <div>
          <h2 className="font-semibold mb-3">Ergebnis</h2>
          <div className="text-xl mb-2">{assessment.readinessScore} / 100 – {assessment.scoreBand}</div>
          <h3 className="font-semibold">Systeme</h3>
          <ul>
            {assessment.systems.map((sa) => (
              <li key={sa.systemId}>{sa.name} – {sa.category} (Score: {sa.systemScore})</li>
            ))}
          </ul>
          <h3 className="font-semibold mt-3">Maßnahmen</h3>
          <ol className="list-decimal ml-6">
            {assessment.prioritizedActions.map((a) => (
              <li key={a.label}>{a.label}</li>
            ))}
          </ol>

          <div className="flex gap-3 mt-4">
            <button onClick={() => downloadPDF(assessment)} className="border px-3 py-2 rounded">PDF exportieren</button>
            <button onClick={() => downloadJSON(assessment)} className="border px-3 py-2 rounded">JSON exportieren</button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))} className="px-4 py-2 border rounded">
          Zurück
        </button>
        {step < 5 ? (
          <button onClick={() => setStep((s) => s + 1)} className="px-4 py-2 bg-green-600 text-white rounded">
            Weiter
          </button>
        ) : (
          <button onClick={() => setStep(1)} className="px-4 py-2 bg-gray-900 text-white rounded">
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
  <div className="mb-2">
    <label className="block text-sm">{label}</label>
    <select
      className="border rounded px-3 py-2 w-full"
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
