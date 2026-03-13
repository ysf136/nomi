# NOVA Architecture

## Overview
NOVA is a React + Firebase SaaS with an AI proxy server for compliance analysis.

### Layers
- UI: React components and feature modules
- Services: API client, AI provider, approval workflows, audit logging
- Data: Firebase Auth + Firestore
- AI Proxy: Express server that calls Anthropic

## High-Level Data Flow
1. User submits incident or compliance data.
2. Frontend validates and sanitizes input.
3. AI service calls the provider through the proxy.
4. Results are stored locally and optionally sent for review.
5. Approval workflow persists reviewer decisions in Firestore.

## Core Modules
- `src/services/ai.provider.ts`: provider-agnostic AI interface
- `src/services/ai.service.ts`: AI orchestration + fallback + audit logging
- `src/services/approval.service.ts`: approvals + comments
- `src/services/audit.service.ts`: audit log writes

## Security
- Firebase rules enforce user ownership and reviewer access.
- Audit logs are append-only.

## Error Handling
- Central helpers in `src/utils/errorHandler.ts`
- Circuit breaker + retry in `src/lib/error-recovery.ts`

## Observability
- `src/utils/logger.ts` sends logs to optional endpoint
- `src/lib/performance.ts` collects web vitals
