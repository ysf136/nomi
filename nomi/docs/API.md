# NOVA API Guide

This document describes the internal API surface used by the frontend.

## Base URL

- Default: `/api`
- Override: `VITE_API_BASE_URL`

## Endpoints

### POST /api/incident-assistant
Analyzes a privacy incident and returns a structured assessment.

Request body:
```json
{
  "provider": "claude",
  "model": "claude-3-5-sonnet-20241022",
  "description": "string",
  "incident": {
    "description": "string",
    "incidentType": "string",
    "affectedPeople": "string",
    "actionsTaken": "string",
    "date": "YYYY-MM-DD",
    "time": "HH:mm",
    "severity": "low|medium|high|critical"
  }
}
```

Response body:
```json
{
  "summary": "string",
  "data_categories": ["string"],
  "data_subjects": { "gruppen": ["string"], "anzahl": "string" },
  "cia_impact": {
    "confidentiality": "string",
    "integrity": "string",
    "availability": "string"
  },
  "tom_relevance": ["string"],
  "risk_level": "niedrig|mittel|hoch",
  "art33_required": true,
  "art33_reasoning": "string",
  "art34_required": false,
  "art34_reasoning": "string",
  "measures": ["string"],
  "open_points": ["string"],
  "legal_analysis": "string",
  "doc_text": "string"
}
```

### POST /api/compliance-assistant
Assesses AI Act compliance for a system description.

Request body:
```json
{
  "provider": "claude",
  "model": "claude-3-5-sonnet-20241022",
  "system": {
    "name": "string",
    "description": "string",
    "useCases": ["string"],
    "exposure": "string"
  }
}
```

Response body:
```json
{
  "category": "Prohibited|HighRisk|GPAI|LimitedRisk|MinimalRisk",
  "summary": "string",
  "legalReferences": ["string"],
  "obligations": ["string"],
  "deadlines": ["string"],
  "priority": "low|medium|high|critical"
}
```

### GET /api/health
Health check endpoint for the AI proxy server.

Response body:
```json
{ "status": "ok" }
```

## Error Responses
All endpoints return a JSON error with a message:
```json
{ "message": "AI processing failed" }
```

## Notes
- `provider` defaults to `claude`.
- `model` defaults to `claude-3-5-sonnet-20241022`.
- Unsupported providers return HTTP 400.
