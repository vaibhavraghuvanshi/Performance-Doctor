
# Performance Doctor

Performance Doctor is a developer tool that uses AI to analyze React Native code, detect performance bottlenecks, and suggest practical optimizations quickly.

## Project Structure

- Frontend (Vite + React + TypeScript): [src/](src/)
- Backend API (TypeScript): [server/src/](server/src/)
- Shared root config: [package.json](package.json), [vite.config.ts](vite.config.ts), [tailwind.config.js](tailwind.config.js), [eslint.config.js](eslint.config.js)

## Repository Layout

- App entry: [src/main.tsx](src/main.tsx)
- Root app component: [src/App.tsx](src/App.tsx)
- Styling: [src/index.css](src/index.css)
- Frontend components: [src/components/](src/components/)
- Frontend services: [src/services/](src/services/)
- Frontend types: [src/types/](src/types/)
- Frontend utils: [src/utils/](src/utils/)
- Backend entry: [server/src/index.ts](server/src/index.ts)
- Backend analysis logic: [server/src/analysis/](server/src/analysis/)
- Backend middleware: [server/src/middleware/](server/src/middleware/)
- Backend types: [server/src/types/](server/src/types/)
- Backend utils: [server/src/utils/](server/src/utils/)
- Public assets: [public/](public/)
- Root type declarations: [types/issue.d.ts](types/issue.d.ts)

## Getting Started

### 1) Install dependencies

From repo root:

```bash
npm install
```

For backend:

```bash
cd server
npm install
```

### 2) Configure environment

- Root environment file: [.env](.env)
- Backend example env: [server/.env.example](server/.env.example)

Create `server/.env` from `server/.env.example` and set required values.

### 3) Run development servers

Frontend (from root):

```bash
npm run dev
```

Backend (from `server/`):

```bash
npm run dev
```

## Build

Frontend build (from root):

```bash
npm run build
```

Backend build (from `server/`):

```bash
npm run build
```

## Notes

- Frontend config: [tsconfig.app.json](tsconfig.app.json), [tsconfig.json](tsconfig.json), [tsconfig.node.json](tsconfig.node.json)
- Backend config: [server/tsconfig.json](server/tsconfig.json)
- CSS/PostCSS config: [postcss.config.cjs](postcss.config.cjs)
- HTML template: [index.html](index.html)

## License

See [LICENSE](LICENSE).
 