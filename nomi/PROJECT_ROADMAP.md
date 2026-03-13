# 🚀 NOVA Project Roadmap & Development Plan

**Status**: In Development (Phase 1)  
**Last Updated**: 2026-02-15  
**Target**: Professional SaaS-Grade Compliance Platform

---

## 📌 Projekt-Vision

NOVA ist eine **KI-gestützte Datenschutz-Compliance-Plattform**, die Unternehmen hilft, ihre Datenschutzpflichten einfach zu verwalten. Die Plattform nutzt Claude AI, um automatisiert Datenschutzvorfälle zu bewerten und Compliance-Anforderungen zu prüfen – mit Human-in-the-Loop für kritische Entscheidungen.

### Kernfeatures
- **AI Act Readiness Wizard** - Multi-Step AI-gestützte Compliance-Analyse
- **Intelligent Incident Management** - KI-basierte Vorfall-Bewertung mit DSGVO-Prüfung
- **AVV & Compliance Checks** - Automatisierte Vertragsanalyse
- **Human-in-the-Loop Reviews** - Kritische KI-Entscheidungen von Menschen überprüft
- **Audit Logging** - Vollständig nachvollziehbare KI-Entscheidungen
- **NOMI AI Assistant** - Context-aware Datenschutz-Chatbot

---

## 🎯 Qualitäts-Standards

Damit das nicht wie generische KI-Gencode aussieht, sondern wie professionell entwickelt:

✅ **Code Quality**: TypeScript strict, konsistent, dokumentiert  
✅ **Error Handling**: Aussagekräftige Meldungen, Graceful Degradation  
✅ **UX**: Loading States, Skeletons, keine unerwarteten Fehler  
✅ **Security**: Input Validation, Audit Logs, Rate Limiting  
✅ **Testing**: 70%+ Code Coverage, E2E Tests  
✅ **Docs**: API Docs, Architecture Docs, Dev Guidelines  

---

## 🔥 PHASE 1: Critical Fixes & Foundation (3-4 Tage)

### ✅ Task 1.1: Fix App.tsx HTML-Error [ASAP - 5 min]
**Status**: Not Started  
**Priority**: 🔴 CRITICAL

**Problem**: Doppelte `<main>` Tags auf Zeilen 72-73

```tsx
// FALSCH:
<main id="main-content">
  {children}
</main>
<main>{children}</main>  // ← DUPLICATE!

// RICHTIG:
<main id="main-content">
  {children}
</main>
```

**Acceptance Criteria**:
- [ ] HTML ist valid (kein doppelter main)
- [ ] Content wird nur 1x gerendert

---

### 📋 Task 1.2: Create Types/Models Structure [4-6h]
**Status**: Not Started  
**Priority**: 🟠 HIGH - Everything depends on this

**Files to Create**:
```
src/types/
├── models.ts              # Firestore Datenstrukturen
├── api.ts                 # API Request/Response Types
├── domain.ts              # Business Logic Types
├── errors.ts              # Error Types + Interfaces
└── compliance.ts          # DSGVO/AI Act specific
```

**Key Models** (approx. 800 LOC):

```typescript
// src/types/models.ts
export interface User {
  uid: string;
  email: string;
  displayName: string;
  companyName: string;
  role: 'admin' | 'reviewer' | 'user';
  createdAt: Date;
}

export interface Incident {
  id: string;
  userId: string;
  description: string;
  type: 'datenleck' | 'unauthorized-access' | 'loss' | 'other';
  affectedPersonCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'submitted' | 'reviewing' | 'completed';
  date: Date;
  time: string;
  actionsTaken: string;
  
  // KI-Analysis
  aiAnalysis?: IncidentAnalysis;
  aiGeneratedAt?: Date;
  
  // Human Review
  review?: Review;
  reviewedBy?: string;
  reviewedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentAnalysis {
  severity: 'low' | 'medium' | 'high' | 'critical';
  mustReportSupervisory: boolean;
  mustNotifyDataSubjects: boolean;
  deadline: Date;
  recommendations: string[];
  riskLevel: number; // 0-100
  confidence: number; // 0-100
}

export interface Review {
  status: 'pending' | 'approved' | 'rejected' | 'needs-info';
  comments: Comment[];
  decision: IncidentAnalysis;
  decidedAt: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: Date;
}

// ComplianceAssessment Types...
// AISystem Types...
```

**Acceptance Criteria**:
- [ ] Alle Firestore Collections haben TypeScript Models
- [ ] Models sind in separaten Files organisiert
- [ ] Alle Models haben `id` und `createdAt`
- [ ] Tests können Models importieren

---

### 🔌 Task 1.3: Central API Client Abstraction [2-3h]
**Status**: Not Started  
**Priority**: 🟠 HIGH

**File**: `src/services/api.client.ts`

**Features**:
```typescript
export class ApiClient {
  private baseURL: string;
  private authToken: string;

  // Zentrale Methods
  async get<T>(path: string): Promise<T> { }
  async post<T>(path: string, data: any): Promise<T> { }
  async put<T>(path: string, data: any): Promise<T> { }
  async delete(path: string): Promise<void> { }

  // Request/Response Interceptors
  private addAuthHeader() { }
  private handleErrors() { }
  private retryOnFailure() { }
}

// Usage:
const api = new ApiClient();
const incidents = await api.get<Incident[]>('/api/incidents');
```

**Acceptance Criteria**:
- [ ] API Client ist zentral und wiederverwendbar
- [ ] Error Handling ist konsistent
- [ ] Requests haben Timeout (15 Sekunden)
- [ ] Auth Token wird automatisch angehängt

---

### ✔️ Task 1.4: Validation Schema Layer (Zod) [3-4h]
**Status**: Not Started  
**Priority**: 🟠 HIGH

**Files**:
```
src/lib/
├── validation-schemas.ts   # Zod Schemas
├── validators.ts           # Validation Functions
└── sanitizers.ts           # Input Sanitization
```

**Example**:
```typescript
import { z } from 'zod';

export const incidentSchema = z.object({
  description: z.string()
    .min(10, 'Mindestens 10 Zeichen')
    .max(5000, 'Maximum 5000 Zeichen'),
  affectedPeople: z.number()
    .int()
    .min(1, 'Mindestens 1 Person betroffen'),
  date: z.date().refine(d => d <= new Date()),
});

// Usage:
try {
  const validated = incidentSchema.parse(formData);
} catch (error) {
  // User-friendly error messages
}
```

**Acceptance Criteria**:
- [ ] Alle API Payloads werden validiert
- [ ] Fehler-Messages sind deutschsprachig und hilfreich
- [ ] Input wird sanitized (XSS-Protection)
- [ ] 100% der POST/PUT endpoints haben Validation

---

## ⚙️ PHASE 2: KI-Integration & Core Logic (4-5 Tage)

### 🤖 Task 2.1: Claude API Integration [6-8h]
**Status**: Not Started  
**Priority**: 🔴 CRITICAL - Core Feature

**File**: `src/services/claude.service.ts`

**What to Implement**:
```typescript
export interface ClaudeConfig {
  apiKey: string;
  model: 'claude-3-5-sonnet-20241022';
  maxTokens: number;
  temperature: number;
}

export class ClaudeService {
  // Incident Analysis
  async analyzeIncident(incident: Incident): Promise<IncidentAnalysis> {
    // Uses incidentAssessment.ts prompt
    // Returns structured IncidentAnalysis
  }

  // Compliance Assessment
  async assessCompliance(system: AISystem): Promise<ComplianceAssessment> {
    // Uses complianceAnalysis.ts prompt
  }

  // Streaming responses for Chat
  async *streamResponse(prompt: string): AsyncGenerator<string> {
    // Yields chunks as they arrive
  }

  // Token counting (Cost estimation)
  estimateCost(prompt: string): { tokens: number; estimatedCost: number } {
    // Helps prevent runoff costs
  }
}
```

**Required Dependencies**:
```bash
npm install @anthropic-ai/sdk
```

**Acceptance Criteria**:
- [ ] Claude API ist konfigurierbar
- [ ] Error Handling für API Ausfälle
- [ ] Token Counting implementiert
- [ ] Streaming ist funktional
- [ ] Tests für alle Methods vorhanden

---

### 👥 Task 2.2: Human-in-the-Loop System [8-10h]
**Status**: Not Started  
**Priority**: 🔴 CRITICAL - SaaS Essential

**Architecture**:
```
src/features/approval/
├── ApprovalQueue.tsx       # Pending items list
├── ReviewPanel.tsx         # Detail view + decision
├── ApprovalService.ts      # Business logic
└── useApprovalStore.ts     # State management
```

**Data Model**:
```typescript
export interface ApprovalItem {
  id: string;
  type: 'incident' | 'compliance' | 'export';
  sourceId: string;
  aiFinalDecision: any;  // AI's recommendation
  
  // Review Status
  status: 'pending' | 'approved' | 'rejected' | 'needs-info';
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewerDecision?: any;  // If different from AI
  
  // Comments & Audit
  comments: ReviewComment[];
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  
  createdAt: Date;
}

export interface ReviewComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: Date;
}
```

**Workflows**:
1. **Incident Flow**: Submitted → AI analyzes → Pending review → Approved/Rejected → Closed
2. **AVV Flow**: Uploaded → AI checks → Pending review → Approved → Stored
3. **Export Flow**: Requested → Data prepared → Review → Exported

**Acceptance Criteria**:
- [ ] Approval Queue zeigt alle pending items
- [ ] Reviewer sieht AI-decision und kann approve/reject
- [ ] Comments können hinzugefügt werden
- [ ] 24h SLA wird tracked
- [ ] Notifications bei neuen Items (Email + In-App)

---

### 📝 Task 2.3: Audit Logging System [4-5h]
**Status**: Not Started  
**Priority**: 🟠 HIGH - Compliance Requirement

**File**: `src/services/audit.service.ts`

**Log Entry Format**:
```typescript
export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: 'ai-analysis' | 'ai-decision' | 'manual-decision' | 'export' | 'delete';
  
  // What was processed
  entityType: 'incident' | 'compliance' | 'system';
  entityId: string;
  
  // AI Context (if action was AI-analysis)
  aiProvider?: 'claude' | 'openai';
  aiModel?: string;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCost?: number;
  
  // Decision Context
  aiDecision?: Record<string, any>;
  aiConfidence?: number;
  humanDecision?: Record<string, any>;
  humanApproved: boolean;
  
  // TODO: Weitere compliance-relevante Felder
  
  createdAt: Date;
}
```

**Every AI Call logs**:
- What input was given
- What Claude decided
- Confidence score
- Cost
- Whether human approved/rejected
- If different, what human decided

**Acceptance Criteria**:
- [ ] Jeder AI-Call wird geloggt
- [ ] Logs enthalten vollständige Audit Trail
- [ ] Logs können nach Entity gefiltert werden
- [ ] Logs sind immutable (können nicht gelöscht werden)
- [ ] Firestone-Struktur für effiziente Queries

---

## 🎨 PHASE 3: UX & Navigation (2-3 Tage)

### 🧭 Task 3.1: Redesign Sidebar Navigation [4-5h]
**Status**: Not Started  
**Priority**: 🔴 CRITICAL - Huge UX Impact

**Current**: Just `<aside>` mit "N"  
**Target**: Professionelle Sidebar mit Navigation

**File**: `src/components/common/Sidebar.tsx` (Rewrite)

**Design**:
```
┌─ NOVA Logo ─────┐
│ 🏠 Dashboard    │  <- Active indicator
│ ⚠️ Incidents    │
│ ✓ Compliance    │
│ 📊 Reports      │
│ 📚 Training     │
│ ⚙️ Settings     │
└─────────────────┘
```

**Features**:
- 250px normal width, 72px collapsed on small screens
- Active route indicator
- Icons + Labels
- Hover effects
- Keyboard navigation
- Accessibility (ARIA labels)

**Acceptance Criteria**:
- [ ] Sidebar ist 250px wide auf Desktop
- [ ] Collapses to 72px on mobile
- [ ] Active route ist highlighted
- [ ] All main routes sind navigierbar
- [ ] Icons sind konsistent
- [ ] Mobile friendly

---

### 📱 Task 3.2: Improve Dashboard Layout [2-3h]
**Status**: Not Started  
**Priority**: 🟠 MEDIUM

**Current**: Generic layout  
**Target**: Professional dashboard mit fokussierten Metriken

**Components**:
- Compliance Score (große Visualisierung)
- Pending Approvals (Quick Action)
- Upcoming Deadlines (Calendar view)
- Recent Incidents (List)
- Training Progress (Progress bars)

---

## 🔒 PHASE 4: Security & Error Handling (2-3 Tage)

### 🛡️ Task 4.1: Firebase Security Rules [2-3h]
**Status**: Not Started  
**Priority**: 🟠 HIGH

**File**: `firestore.rules`

**Rules**:
```
- Users können nur ihre eigenen Daten sehen
- Reviewer/Admin können Approvals sehen
- Audit Logs sind read-only für relevant users
- Keine public Daten (alles authentiziert)
```

---

### 🔄 Task 4.2: Error Recovery & Resilience [3-4h]
**Status**: Not Started  
**Priority**: 🟠 HIGH

**Implement in** `src/lib/error-recovery.ts`:
```typescript
// Exponential Backoff Retry
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// Circuit Breaker Pattern
export class CircuitBreaker {
  private failureCount = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  async execute(fn: () => Promise<any>) {
    if (this.state === 'open') {
      throw new Error('Circuit breaker is open');
    }
    // ... logic
  }
}
```

---

### ✅ Task 4.3: Input Validation & Sanitization [2-3h]
**Status**: Not Started  
**Priority**: 🟠 HIGH

**Already started in Task 1.4** - just need to apply everywhere:
- Form submissions
- API endpoints
- File uploads
- User comments

---

## 🧪 PHASE 5: Testing (5-7 Tage)

### 📋 Task 5.1: Unit Tests (Foundation) [8-10h]
**Status**: Not Started  
**Priority**: 🟠 HIGH

**Test Coverage Target**: 70%

**Priority Tests**:
1. Claude Service (Prompt generation, parsing)
2. Validation Schemas (All happy + error paths)
3. Error Handler (All error types)
4. Approval Logic (Status transitions)
5. Incident Analysis parsing

**Structure**:
```
src/__tests__/
├── services/
│   ├── claude.service.test.ts
│   ├── api.client.test.ts
│   └── audit.service.test.ts
├── lib/
│   ├── validators.test.ts
│   └── error-recovery.test.ts
└── features/
    ├── incident/
    └── approval/
```

---

### 🔗 Task 5.2: Integration Tests [6-8h]
**Status**: Not Started  
**Priority**: 🟠 MEDIUM

**Test Scenarios**:
1. Create Incident → AI analyzes → Appears in Queue → Reviewer approves
2. Upload AVV → AI checks → Shows results
3. Auth flow → Dashboard loads → Incidents fetch
4. Error scenarios (Network down, API error, etc.)

**Tools**: Vitest + Firebase Emulator

---

### 🎬 Task 5.3: E2E Tests (User Flows) [8-10h]
**Status**: Not Started  
**Priority**: 🟠 MEDIUM

**Critical User Flows**:
1. Login → Dashboard → Create Incident → Review → Approve
2. Login → View Reports → Export PDF
3. Login → Settings → Change Company Info → Save
4. Create Incident → See AI Analysis → Request More Info → Submit

**Tool**: Playwright

---

## 📚 PHASE 6: Documentation (2-3 Tage)

### 📖 Task 6.1: API Documentation [2-3h]
**Status**: Not Started  
**Priority**: 🟠 MEDIUM

**Format**: OpenAPI 3.0 (Swagger UI)

**Endpoints to Document**:
```
POST /api/incidents              # Create incident
GET /api/incidents               # List user's incidents
GET /api/incidents/:id           # Get details
POST /api/incidents/:id/review   # Submit for review

POST /api/approval/             # Get pending approvals
PATCH /api/approval/:id         # Approve/Reject

GET /api/audit                  # Get audit logs
```

---

### 🏗️ Task 6.2: Architecture Documentation [2-3h]
**Status**: Not Started  
**Priority**: 🟠 MEDIUM

**Files to Create**:
```
docs/
├── ARCHITECTURE.md          # System design overview
├── DEVELOPMENT.md           # Setup & conventions
├── API_GUIDE.md             # How to use APIs
├── TESTING_GUIDE.md         # How to write tests
└── DEPLOYMENT.md            # Production setup
```

**Content Examples**:
- System architecture diagram (Mermaid)
- Data flow diagram (How incident flows through system)
- API patterns & conventions
- Error handling strategy
- Security models
- Performance considerations

---

## 🚀 PHASE 7: Performance & Monitoring (1-2 Tage)

### ⚡ Task 7.1: Performance Optimization [2-3h]
**Status**: Not Started
**Priority**: 🟠 MEDIUM

**Goals**:
- Bundle size < 500KB gzipped
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

**Optimizations**:
- Code splitting for routes
- Image optimization
- Lazy loading
- Memoization where needed

---

### 📊 Task 7.2: Monitoring & Analytics [2-3h]
**Status**: Not Started
**Priority**: 🟠 MEDIUM

**Implement**:
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)
- Usage analytics (optional)
- Logging service (cloud logging)

---

## 📋 Professional Development Checklist

### Code Quality Standards
- [ ] TypeScript strict mode enabled
- [ ] No `any` types without explanation
- [ ] JSDoc on all public functions
- [ ] No magic numbers (use constants)
- [ ] Naming conventions consistent
- [ ] No console.log in production code

### UX Standards
- [ ] Loading states on all async operations
- [ ] Skeleton loaders for content areas
- [ ] Error messages are helpful & actionable
- [ ] Success confirmations after mutations
- [ ] Toast notifications for feedback
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive (tested)
- [ ] WCAG AA contrast ratios

### Architecture Standards
- [ ] Service layer (business logic separated from UI)
- [ ] No circular dependencies
- [ ] Hooks are small & reusable
- [ ] Props are type-safe
- [ ] Error boundaries prevent full app crash
- [ ] State management is centralized

### Security Standards
- [ ] All inputs are validated
- [ ] XSS prevention (sanitize if custom HTML)
- [ ] CSRF tokens on forms
- [ ] Secrets in environment variables only
- [ ] Rate limiting on API calls
- [ ] Audit logs for critical actions

### Testing Standards
- [ ] 70%+ code coverage
- [ ] Happy path + error paths tested
- [ ] Integration tests for critical flows
- [ ] E2E tests for user workflows
- [ ] All tests pass before merge

---

## 📈 Project Timeline

```
Week 1: Phase 1 (Critical Fixes + Foundation)
  Mon: Task 1.1 (App.tsx) + 1.2 (Types) - START
  Tue-Wed: Task 1.3 (API Client) + 1.4 (Validation)
  Thu: Review + Refinements

Week 2: Phase 2 (KI Integration)
  Mon-Tue: Task 2.1 (Claude API)
  Wed-Thu: Task 2.2 (Approval System)
  Fri: Task 2.3 (Audit Logging)

Week 3: Phase 3 + 4 (UX + Security)
  Mon-Tue: Task 3.1 (Sidebar Redesign)
  Wed-Thu: Task 4 (Security/Recovery)
  Fri: Testing & Polish

Week 4: Phase 5 (Testing) - 1 Week
  Mon-Tue: Unit Tests
  Wed: Integration Tests
  Thu-Fri: E2E Tests

Week 5: Phase 6 + 7 (Docs + Monitoring)
  Mon-Tue: API + Architecture Docs
  Wed-Thu: Performance + Monitoring
  Fri: Final Review

Week 6: Launch Prep
  Polish, Bug Fixes, Security Audit, Deployment Prep
```

---

## 🎯 Success Metrics

When we're done, the platform will be:

✅ **Professional**: Polished, consistent, well-designed  
✅ **Reliable**: 99.9% uptime, graceful error handling  
✅ **Secure**: Input validation, audit trails, proper auth  
✅ **Testable**: 70%+ coverage, CI/CD pipeline  
✅ **Documentable**: API docs, dev guides, architecture docs  
✅ **Scalable**: Can handle growing user base & data  
✅ **Maintainable**: Clean code, clear structure, conventions  
✅ **SaaS-Ready**: Multi-tenant ready, billing integration ready  

---

## 📞 Questions?

If unclear on any task, ask before starting:
- Task dependencies unclear?
- Architecture questions?
- Technology choices?
- Priority changes?

---

**Remember**: We're building a **professional SaaS product**, not a side project. Every detail matters.

Let's ship something amazing! 🚀
