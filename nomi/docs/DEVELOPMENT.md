# Development Guide

## Requirements
- Node.js 18+
- Firebase project with Auth + Firestore

## Local Setup
```bash
npm install
npm run dev
npm run dev:api
```

## Environment Variables
Copy `.env.example` to `.env` and fill in credentials.

## Testing
```bash
npm run test
npm run test:coverage
npm run test:e2e
```

## Linting/Formatting
```bash
npm run lint
npm run format
```

## Folder Conventions
- `src/features`: page-level features
- `src/components`: reusable UI
- `src/services`: business logic + data access
- `src/lib`: utilities
- `src/types`: shared types

## API Proxy
The AI proxy runs on `AI_SERVER_PORT` and forwards requests to Anthropic.
