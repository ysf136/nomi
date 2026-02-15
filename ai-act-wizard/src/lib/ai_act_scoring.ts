/* =====================================================
   AI Act Readiness – Scoring Engine (v1.0)
   -----------------------------------------------------
   • Enthält Typen, Konstanten, Berechnungslogik
   • Keine React-Abhängigkeiten
   ===================================================== */

export type OrgProfile = {
  name: string
  size: 'Kleinst/klein' | 'mittel' | 'groß'
  sector?: string
  roles: Array<'Provider' | 'Deployer' | 'Importer' | 'Distributor'>
}

export type AnnexIII =
  | 'Biometrie'
  | 'Kritische Infrastruktur'
  | 'Bildung'
  | 'Beschäftigung'
  | 'Wesentliche Dienste'
  | 'Strafverfolgung'
  | 'Migration/Grenzen'
  | 'Justiz/Demokratie'

export type BiometricFn =
  | 'Echtzeit-RBI'
  | 'Emotionserkennung'
  | 'Kategorisierung nach sensiblen Merkmalen'

export type Maturity = 0 | 1 | 2 | 3

export type Governance = {
  rms: Maturity
  dataGov: Maturity
  techDoc: Maturity
  logging: Maturity
  oversight: Maturity
  pmp: Maturity
  qms: Maturity
  supplierDocs: 'vollständig' | 'teilweise' | 'keine'
  evidenceFreshMonths?: number
}

export type AISystem = {
  id: string
  name: string
  description?: string
  providerOrDeployer: 'Provider' | 'Deployer'
  useCases: string[]
  annexIII: AnnexIII[]
  biometricFunctions: BiometricFn[]
  interactsWithHumans: boolean
  generatesSyntheticContent: boolean
  isGPAIModel: boolean
  reliesOnGPAIFromOthers: boolean
  exposure: 'PoC/Pilot' | 'Intern begrenzt' | 'Unternehmensweit/Kundenseitig'
  hasSystemicRisk?: boolean
  governance: Governance
}

export type Obligation = {
  label: string
  legalRef?: string
  deadline?: string
  evidenceExamples?: string[]
}

export type SystemAssessment = {
  systemId: string
  name: string
  category: 'Verboten' | 'Hochrisiko' | 'Begrenztes Risiko' | 'GPAI' | 'GPAI (systemic risk)' | 'Minimal'
  systemScore: number
  obligations: Obligation[]
  redFlags: string[]
}

export type OrgAssessment = {
  org: OrgProfile
  systems: SystemAssessment[]
  readinessScore: number
  scoreBand: 'Ready' | 'Weitgehend bereit' | 'Teilweise bereit' | 'Kritisch' | 'Nicht bereit'
  prioritizedActions: Obligation[]
  scoringVersion: string
}

/* ---------------------- Constants ------------------- */
export const DATES = {
  PROHIBITIONS: '2025-02-02',
  GPAI: '2025-08-02',
  HIGHRISK: '2027-08-01',
}

const BASELINE_BY_CATEGORY: Record<SystemAssessment['category'], number> = {
  Verboten: 0,
  'Hochrisiko': 50,
  'GPAI (systemic risk)': 50,
  GPAI: 55,
  'Begrenztes Risiko': 65,
  Minimal: 75,
}

const CONTROL_POINTS = {
  rms: 8,
  dataGov: 8,
  techDoc: 8,
  logging: 4,
  oversight: 4,
  pmp: 3,
  qms: 6,
}

/* ---------------------- Helpers --------------------- */
const maturityFactor = (m: Maturity) => (m === 3 ? 1 : m === 2 ? 0.75 : m === 1 ? 0.25 : 0)

export function categorizeSystem(s: AISystem): SystemAssessment['category'] {
  if (s.biometricFunctions.includes('Echtzeit-RBI')) return 'Verboten'
  if (s.biometricFunctions.includes('Emotionserkennung')) return 'Verboten'
  if (s.biometricFunctions.includes('Kategorisierung nach sensiblen Merkmalen')) return 'Verboten'
  if (s.annexIII.length > 0) return 'Hochrisiko'
  if (s.isGPAIModel) return s.hasSystemicRisk ? 'GPAI (systemic risk)' : 'GPAI'
  if (s.interactsWithHumans || s.generatesSyntheticContent) return 'Begrenztes Risiko'
  return 'Minimal'
}

function deadlinePassed(deadline: string): boolean {
  return new Date().getTime() > new Date(deadline + 'T00:00:00').getTime()
}

function exposureFactor(e: AISystem['exposure']): number {
  return e === 'PoC/Pilot' ? 0.5 : e === 'Unternehmensweit/Kundenseitig' ? 2 : 1
}

function criticalityFactor(cat: SystemAssessment['category']): number {
  switch (cat) {
    case 'Verboten': return 4
    case 'Hochrisiko':
    case 'GPAI (systemic risk)': return 3
    case 'GPAI': return 2
    case 'Begrenztes Risiko': return 1.5
    default: return 1
  }
}

export function buildObligations(cat: SystemAssessment['category'], s: AISystem): Obligation[] {
  const o: Obligation[] = []
  if (cat === 'Verboten') {
    o.push({ label: 'Nutzung unverzüglich einstellen (Verbotene Praktik)', legalRef: 'AI Act – Unacceptable risk', deadline: DATES.PROHIBITIONS })
    return o
  }
  if (cat === 'Hochrisiko') {
    o.push(
      { label: 'Risikomanagementsystem implementieren', legalRef: 'Art. 9', deadline: DATES.HIGHRISK },
      { label: 'Data-Governance/Qualität', legalRef: 'Art. 10', deadline: DATES.HIGHRISK },
      { label: 'Technische Dokumentation', legalRef: 'Art. 11', deadline: DATES.HIGHRISK },
    )
  }
  if (cat === 'Begrenztes Risiko') {
    o.push({ label: 'Transparenzhinweis bei Interaktion', legalRef: 'Art. 50', deadline: '2026-08-01' })
  }
  if (s.isGPAIModel) {
    o.push({ label: 'GPAI-Transparenzdoku/Model Card', legalRef: 'Art. 53/55', deadline: DATES.GPAI })
  }
  return o
}

export function calcSystemScore(s: AISystem): number {
  const cat = categorizeSystem(s)
  if (cat === 'Verboten') return 0
  let score = BASELINE_BY_CATEGORY[cat]
  const g = s.governance
  score += CONTROL_POINTS.rms * maturityFactor(g.rms)
  score += CONTROL_POINTS.dataGov * maturityFactor(g.dataGov)
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function assessOrg(org: OrgProfile, systems: AISystem[]): OrgAssessment {
  const assessments: SystemAssessment[] = systems.map((s) => {
    const category = categorizeSystem(s)
    return { systemId: s.id, name: s.name, category, obligations: buildObligations(category, s), redFlags: [], systemScore: calcSystemScore(s) }
  })
  const readinessScore = Math.round(assessments.reduce((a, s) => a + s.systemScore, 0) / assessments.length || 0)
  let scoreBand: OrgAssessment['scoreBand'] = 'Nicht bereit'
  if (readinessScore >= 90) scoreBand = 'Ready'
  else if (readinessScore >= 75) scoreBand = 'Weitgehend bereit'
  else if (readinessScore >= 60) scoreBand = 'Teilweise bereit'
  else if (readinessScore >= 40) scoreBand = 'Kritisch'

  return { org, systems: assessments, readinessScore, scoreBand, prioritizedActions: [], scoringVersion: '1.0' }
}
