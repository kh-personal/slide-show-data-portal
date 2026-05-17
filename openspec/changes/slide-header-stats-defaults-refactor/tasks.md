## 1. Default State Changes

- [x] 1.1 In `src/components/kiosk-portal.tsx`, change `useState<ThemeMode>("dark")` to `useState<ThemeMode>("light")`
- [x] 1.2 In `src/components/kiosk-portal.tsx`, change `useState<Language>("en")` to `useState<Language>("zh-Hant")`

## 2. Refactor SummaryMetrics → SummaryStatsBar

- [x] 2.1 Rename `src/components/summary-metrics.tsx` to `src/components/summary-stats-bar.tsx`; rename the exported function from `SummaryMetrics` to `SummaryStatsBar`; add optional `compact?: boolean` prop; apply CSS class `summary-stats-bar--compact` on the root element when `compact` is true
- [x] 2.2 Update `src/components/summary-slide.tsx` to import `SummaryStatsBar` from `./summary-stats-bar` (replacing the old `SummaryMetrics` import)

## 3. Add Compact Stats Bar to Floor-Grid Slides

- [x] 3.1 In `src/components/floor-grid.tsx`, add optional prop `summaryMetrics?: SummaryMetricsType`; when provided, render `<SummaryStatsBar metrics={summaryMetrics} compact />` inside the `slide-header` div
- [x] 3.2 In `src/components/kiosk-portal.tsx`, pass `summaryMetrics={metrics}` to both `<FloorGrid>` calls (Slide 1 and Slide 2)

## 4. CSS for Compact Stats Bar

- [x] 4.1 In the global stylesheet, add `.summary-stats-bar--compact` rules that reduce font size and padding for `.metric-card`, `.metric-value`, and `.metric-label` to approximately 70% of their normal size; ensure the bar does not overflow the slide header

## 5. Update Unit Tests

- [x] 5.1 Create `tests/unit/summary-stats-bar.test.ts`: test that `SummaryStatsBar` renders all 5 metric labels and values; test that the `summary-stats-bar--compact` CSS class is applied when `compact={true}` and absent when `compact` is omitted

## 6. Update E2E Tests

- [x] 6.1 In `tests/e2e/portal.spec.ts`, update all assertions that depend on the English default (e.g., `"Pause"` → `"暫停"`, `"Floors 1-16"` → `"1至16樓"`, `"House Name"` → `"樓宇名稱"`, `"Light"` → `"淺色"`) to reflect the new Traditional Chinese default language
- [x] 6.2 In `tests/e2e/portal.spec.ts`, update the theme test: since default is now `light`, verify `data-theme="light"` on load; verify clicking the theme button switches to `dark`
- [x] 6.3 Add an E2E test that verifies the compact stats bar (`.summary-stats-bar`) is visible inside the slide-1 and slide-2 headers with non-empty metric values

## 7. Documentation

- [x] 7.1 Add a "Deploy to GitHub Pages" section to `README.md` explaining: (a) set `output: "export"` in `next.config.mjs`, (b) set `NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL` as a public CSV URL (API routes are unavailable on GitHub Pages), (c) run `npm run build` to produce the `out/` folder, (d) deploy `out/` to the `gh-pages` branch via `gh-pages` npm package or GitHub Actions; include the caveat that server-side `/api/movements` is not available in a static export

## 8. Verification

- [x] 8.1 Run `npm test` and confirm all unit tests pass
- [x] 8.2 Run `npm run test:e2e` and confirm all E2E tests pass
- [x] 8.3 Run `npm run build` and confirm no TypeScript or build errors
