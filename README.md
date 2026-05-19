# Performance Doctor (frontend)

AI-assisted **React Native performance** analyzer: paste or upload TS/TSX, run **static AST rules** plus **Groq** suggestions, compare refactors, export reports, and review scorecards.

---

## MVP Phase 1 — status

| Area | What you get |
|------|----------------|
| **Monaco editor** | Full editor + read-only panels; **side-by-side** or **Monaco diff** refactor preview. |
| **Code input** | Paste, **file upload**, quick examples, platform (iOS / Android / both). |
| **RN-oriented analysis** | Server **Babel** traverse + RN-focused rules (lists, bridge hints, memo, etc.) merged with **LLM** output when `?ai=1`. |
| **AI suggestions** | Groq-powered issues + optional `fix` text; hybrid merge with AST dedupe. |
| **Refactor preview** | **Compare** screen: split view **or** unified **Diff view**. |
| **Scorecards** | Diagnosis score, metrics, severity groups; summary improvement cards. |
| **Report export** | Summary: **`.txt`**, **`.md`**, **`.json`** (full `AnalysisResult`, all issues + optimized code). |
| **Public beta** | Optional banner: set `VITE_PUBLIC_BETA=1` in the **root** env and restart Vite. Deploy/run notes below. |

Static analysis is **JS/TSX AST–based**, tuned for RN patterns—not a replacement for on-device profiling.

---

## Previously shipped (high level)

- **Hybrid pipeline**: `POST /analyze?ai=1` runs AST + Groq, merges in `server/src/analysis/mergeIssues.ts`, recomputes metrics.
- **API & dev UX**: Vite `/api` proxy, `VITE_API_URL` guard for `localhost:3000` without `/api`, client fetch timeout, Groq timeouts / fewer retries, optional `ANALYZE_API_KEY` relaxed outside `NODE_ENV=production`.
- **Primary buttons**: solid (no gradient) in `Button.tsx`.

---

## Quick start

### 1. Frontend (Vite — default port `3000`)

```bash
npm install
npm run dev
```

### 2. Backend (Express — default port `4000`)

From `server/`:

```bash
cd server && npm install && npm run dev
```

Set **`GROQ_API_KEY`** in `server/.env` for AI analysis.

### 3. Wire the dev proxy

Vite proxies **`/api/*`** → **`http://127.0.0.1:4000`** by default. If the API listens elsewhere:

```bash
# repo root .env.local (example)
VITE_API_PROXY_TARGET=http://127.0.0.1:3001
```

Do **not** set `VITE_API_URL=http://localhost:3000` without **`/api`** (the app corrects this in code, but `http://localhost:3000/api` is the explicit form).

### 4. Optional env

| Variable | Where | Purpose |
|----------|--------|---------|
| `VITE_PUBLIC_BETA` | Root | `1` → shows public beta banner. |
| `VITE_ANALYZE_API_KEY` | Root | Must match server `ANALYZE_API_KEY` when enforcing in **production**. |
| `ANALYZE_API_KEY` | Server | Optional; enforced only when `NODE_ENV=production` or `ANALYZE_API_KEY_FORCE=1`. |
| `ANALYZE_LLM_ONLY` | Server | `1` → skip AST merge (debug). |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production bundle |
| `npm run preview` | Preview production build |
| `cd server && npm run dev` | API server |
| `cd server && npm test` | Backend tests |

---

## Public beta / launch checklist

1. **Secrets**: `GROQ_API_KEY` on the server only; never commit `.env`.
2. **CORS / URL**: Production frontend should call the real API origin or same host reverse-proxy.
3. **Rate limits**: Tune `ANALYZE_RATE_LIMIT_*` on the server if needed.
4. **Beta flag**: `VITE_PUBLIC_BETA=1` for in-app messaging.
5. **Monitoring**: Log Groq failures and 5xx from `server` (your platform’s logger).

---

## Repo layout (frontend)

- `src/components/CodeEditor` — Monaco, upload, analyze CTA  
- `src/components/Comparison` — Split + diff refactor preview  
- `src/components/DiagnosisReport` — Issues, score, metrics  
- `src/components/Summary` — Scorecards, **multi-format export**, share  
- `src/services/api.ts` — `POST /api/analyze?ai=1`  
- `src/utils/reportExport.ts` — TXT / MD / JSON builders  

Backend: see **`server/README.md`**.

---

## License

Private / team use unless otherwise noted in the repository.
