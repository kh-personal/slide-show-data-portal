# Charts, Pause Controls & Visual Redesign

## Why

Operators need richer visibility into resident movements (status, dwell time, CAS staff dispersion), interactive control over the slideshow (pause, jump), broader Traditional Chinese labelling (floors, units, house names), and a more visually engaging dashboard. The current portal only shows aggregate counts, runs an unstoppable slide loop, and only translates a subset of labels.

## What Changes

- Add CSV column `CSA Staff No` (free-text ID(s) of CAS staff entering with the resident); display next to the existing CAS staff count in each populated unit cell.
- Add derived `flatStatus` field per record (`Not Reg` / `Reg` / `Visiting` / `Completed`) computed from entry/exit times. Optional `Flat Status` sheet column overrides the derivation.
- Add four rounded-border pie charts on the summary slide arranged in a 2×2 grid below the existing metric cards: Flat Status, Duration Distribution, CSA Staff In-Flat Duration Distribution, CSA Staff Count Distribution. Duration buckets: 0–30 / 31–60 / 61–90 / 91–120 / 121–150 / 151–180 / 180+ minutes.
- Add a pause toggle and prev/next slide buttons in the control bar. While paused, auto-rotation stops and the operator can navigate freely; resuming restarts the timer from the active slide.
- Extend i18n: translate floor labels (`1樓` / `1/F`), unit labels (`01室`), and all house names to Traditional Chinese (宏仁/道/新/建/泰/昌/盛/志閣).
- Redesign dashboard visual style: new color palettes for both themes, refined typography, gradient/elevated cards and charts.
- Refactor: extract `useSlideshow` hook, `useKioskControls` hook, and split pie-chart rendering into a reusable `<PieChart />` component.

## Impact

- Affected specs: `sheet-data-ingestion`, `floor-grid-display`, `summary-metrics`, `kiosk-runtime`.
- Affected code: `src/lib/models.ts`, `src/lib/csv.ts`, `src/lib/movements.ts`, `src/lib/sample-data.ts`, `src/lib/i18n.ts`, `src/components/kiosk-portal.tsx`, `src/components/floor-grid.tsx`, `src/components/summary-slide.tsx`, new `src/components/pie-chart.tsx`, new hooks under `src/lib/hooks/`, `app/globals.css`.
- Tests: extend unit tests for status/duration/CSA distributions and translation maps; add E2E tests for pause control, manual nav, language toggles for floors/units/house names.
