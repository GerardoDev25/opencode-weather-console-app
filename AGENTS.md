# AGENTS.md

## Project

- Bun + TypeScript Weather CLI tutorial app. Entry point: `src/index.ts`.
- Layered structure (see `references/file-system.md`): `src/actions/` (one module per user action), `src/presentation/` (menu, input, output), `src/storage/` (cities/settings persistence), `src/types/`, `src/api/` (OpenMeteo), `src/utils/`.
- `README.md` (Spanish) is the product spec: menu layout, options, and API flow come from there — match it when implementing. Final deliverable is a compiled executable binary.
- Workspace contains other numbered sibling projects (e.g. `01-demo`); each repo is self-contained.

## Commands

- Install: `bun install` (repo uses bun.lock — do not use npm/node)
- Run: `bun run src/index.ts` (or `bun run start`)
- Test: `bun test tests` (or `bun run test`; all test files live in `tests/`)
- Typecheck: `bun run typecheck` (`tsc --noEmit`; there is no lint config — do not invent commands)
- Build binary: `bun run build` (runs the test suite first and only compiles if it passes; outputs `out/weather`)

## OpenMeteo API (no API key required)

Two-step flow documented in the README:

1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
2. Weather: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`

## Env & config

- `.env` files and `out/`/`dist/` are gitignored; dotenv is not the current pattern.
- tsconfig uses `strict`, `noUncheckedIndexedAccess` (array/record indexing returns `T | undefined`), `verbatimModuleSyntax` (use `import type` for type-only imports), and `allowImportingTsExtensions` (either omit or include the extension in imports — pick one and stay consistent).

## State & persistence

- `cities.json` holds `{ cities, defaultCity }` (managed by `src/storage/citiesStorage.ts`); `settings.json` holds `{ unit }` (managed by `src/storage/settingsStorage.ts`). Both are gitignored.
- `citiesStorage.ts` migrates a legacy `data.json` (single `Store` object) into the two files and deletes it.
- Menu output format is prescribed in the README ("Ejemplo del menú" section); re-read it before implementing the UI.
