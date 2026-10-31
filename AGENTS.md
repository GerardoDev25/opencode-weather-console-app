# AGENTS.md

## Project

- Bun + TypeScript Weather CLI tutorial app. Entry point: `index.ts` (currently a stub).
- `README.md` (Spanish) is the product spec: menu layout, options, and API flow come from there — match it when implementing. Final deliverable is a compiled executable binary.
- Workspace contains other numbered sibling projects (e.g. `01-demo`); each repo is self-contained.

## Commands

- Install: `bun install` (repo uses bun.lock — do not use npm/node)
- Run: `bun index.ts`
- Typecheck: `bunx tsc --noEmit` (no scripts defined in package.json; there are no test or lint configs — do not invent commands)

## OpenMeteo API (no API key required)

Two-step flow documented in the README:

1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
2. Weather: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`

## Env & config

- `.env` files and `out/`/`dist/` are gitignored; dotenv is not the current pattern.
- tsconfig uses `strict`, `noUncheckedIndexedAccess` (array/record indexing returns `T | undefined`), `verbatimModuleSyntax` (use `import type` for type-only imports), and `allowImportingTsExtensions` (either omit or include the extension in imports — pick one and stay consistent).

## State & persistence (from spec)

- The app must support a default city and a list of saved cities, plus a temperature-unit setting (°C/°F). Persistence mechanism is not specified — a local JSON file written with Bun's file APIs (`Bun.write`/`Bun.file`) is the idiomatic Bun choice.
- Menu output format is prescribed in the README ("Ejemplo del menú" section); re-read it before implementing the UI.
