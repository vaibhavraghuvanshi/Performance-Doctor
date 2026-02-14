# Performance Doctor Backend

## Overview

This backend provides static analysis for React/React Native code using AST parsing and custom rules. It exposes an `/analyze` endpoint for the frontend to POST code and receive a structured analysis result.

## Structure

- `src/index.ts`: Express server entry point
- `src/analysis/`: AST analysis logic and rules
- `src/analysis/rules/`: Individual detection rules (e.g., inline functions, FlatList)
- `src/middleware/`: Request validation and error handling
- `src/types/`: Shared types for analysis results and issues
- `src/examples/`: Example components for testing rules
- `src/utils/`: Utility functions (e.g., JSON formatter)

## Development

- Install dependencies: `npm install`
- Start in dev mode: `npm run dev`
- Build: `npm run build`
- Start production: `npm start`

## API

- `POST /analyze` with `{ code: string }` in the body. Returns an `AnalysisResult` JSON.

## Extending

- Add new rules in `src/analysis/rules/` and export from `index.ts`.
- Update `analyzer.ts` to apply new rules.
