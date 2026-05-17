## Context

The kiosk portal is a Next.js App Router application deployed as a fixed fullscreen display for 8 residential blocks. The current implementation has two ergonomic gaps:

1. **Operator defaults are wrong**: The portal opens in English with a dark theme. The target audience speaks Cantonese and the site is a well-lit kiosk environment — Traditional Chinese and light theme are better defaults.
2. **Slides 1 & 2 hide building context**: Operators watching the floor grid cannot see any building-level figures (total entries, luggage warnings) without navigating to Slide 3. Adding a compact stats bar to Slides 1 & 2 lets them monitor both floor-level and building-level status simultaneously.

A secondary concern is maintainability: `KioskPortal` passes many props through intermediate components and duplicates label derivation patterns, and the README is silent on GitHub Pages deployment.

## Goals / Non-Goals

**Goals:**
- Change initial `theme` state to `"light"` and initial `language` state to `"zh-Hant"` in `KioskPortal`.
- Render a compact `SummaryStatsBar` inside the `slide-header` of Slides 1 and 2, showing the 5 summary figures at ~70% the normal size.
- Extract `SummaryStatsBar` from `SummaryMetrics` so the component is reusable without duplication.
- Simplify `KioskPortal` prop-threading by deriving repeated values once.
- Document GitHub Pages deployment steps in `README.md`.
- Add/update unit and E2E tests for all new behaviours.

**Non-Goals:**
- Changing the data model, polling logic, or slide transition timing.
- Redesigning Slide 3 layout.
- Adding any new translations beyond what is already in `i18n.ts`.

## Decisions

### Decision 1: `SummaryStatsBar` as a new component with `compact` prop

**Decision**: Rename the existing `SummaryMetrics` component to `SummaryStatsBar` and add an optional `compact?: boolean` prop. When `compact` is true, the component applies a CSS modifier class (`summary-stats-bar--compact`) that reduces font sizes and card padding via a CSS class rather than inline styles.

**Rationale**: A single component with a prop is the smallest change — no duplication of metric-card markup. CSS class-based sizing keeps the component pure and testable. Retaining the original export name as a re-export avoids breaking Slide 3's import.

**Alternatives considered**:
- Separate `CompactSummaryMetrics` component — redundant code.
- Inline styles — harder to override and test.

### Decision 2: Stats bar placement inside `FloorGrid` slide header

**Decision**: Add an optional `summaryMetrics` prop to `FloorGrid`. When provided, render `<SummaryStatsBar metrics={summaryMetrics} compact />` in the `slide-header` alongside the existing title and timestamp.

**Rationale**: `FloorGrid` already owns the slide header markup. Adding it there localises the change and avoids another wrapper component. The prop is optional, so `FloorGrid` used in other contexts remains unchanged.

### Decision 3: Default state change approach

**Decision**: Change the `useState` initial values in `KioskPortal` directly: `useState<ThemeMode>("light")` and `useState<Language>("zh-Hant")`.

**Rationale**: The simplest correct change. No new configuration or environment variables are needed.

### Decision 4: GitHub Pages deployment via `next export` + static hosting

**Decision**: Document a static-export approach in the README using `output: "export"` in `next.config.mjs` and deploying the `out/` directory to the `gh-pages` branch using the `gh-pages` npm package or GitHub Actions. Include a prominent caveat that the `/api/movements` route will not run on GitHub Pages — users must configure a public Google Sheets CSV URL via `NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL` and bake data fetching into the client.

**Rationale**: GitHub Pages serves only static files. Next.js API routes require a Node.js server. The cleanest workaround is moving data fetching to a client-side fetch of a public CSV URL. This is already supported by the CSV parsing path in `src/lib/csv.ts`.

**Alternatives considered**:
- Vercel (preferred, but the user asks about GitHub Pages specifically).
- Static JSON file checked into the repo — stale data, not suitable for a live kiosk.

## Risks / Trade-offs

- **Stats bar on mobile**: The compact bar adds visual weight to Slides 1 & 2. On very small screens the header may overflow. Mitigated by setting `overflow: hidden` on the header row and testing at kiosk resolution (≥1280 px wide).
- **GitHub Pages API routes**: Moving to a static export removes server-side features. Documented clearly in README.
- **E2E tests checking default language**: Existing E2E tests assert English labels (e.g., `"Pause"`, `"Floors 1-16"`). Switching the default to `zh-Hant` will break those assertions. All affected tests must be updated to use the Chinese equivalents.

## Migration Plan

1. Change state defaults in `KioskPortal`.
2. Refactor `SummaryMetrics` → `SummaryStatsBar` with `compact` prop.
3. Add `summaryMetrics` prop to `FloorGrid`; render `SummaryStatsBar compact` in header.
4. Wire metrics through `KioskPortal` to both `FloorGrid` calls.
5. Add CSS for `.summary-stats-bar--compact`.
6. Update unit tests; update and add E2E tests.
7. Update README with GitHub Pages section.

No data schema changes, no migrations, no deployment steps beyond a standard `npm run build`.

## Open Questions

- None.
