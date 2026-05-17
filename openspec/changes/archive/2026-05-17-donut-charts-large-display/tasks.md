# Tasks

## 1. Donut chart component
- [x] 1.1 Add `src/components/donut-chart.tsx` exporting `<DonutChart title, data, emptyLabel />`; render an annular ring (outer arc + inner-radius cutout) with a large center number showing the total.
- [x] 1.2 Move slice color tables out of `summary-slide.tsx` into `src/lib/chart-palette.ts` (status, duration buckets, staff-count rotation) tuned for distance contrast.
- [x] 1.3 Delete `src/components/pie-chart.tsx` once nothing references it.

## 2. Summary slide refactor
- [x] 2.1 Split `summary-slide.tsx` into `summary-metrics.tsx` (metric cards) and `summary-charts.tsx` (2×2 donut grid); `summary-slide.tsx` becomes a thin composition.
- [x] 2.2 Memoize distribution helper results inside `summary-charts.tsx`.

## 3. Layout for 30-inch viewing
- [x] 3.1 CSS: donut SVG fills ~75% of card height; single-column legend with large rows, swatch + label + value; tabular-nums on values.
- [x] 3.2 Bump metric card and chart card font sizes; tighten spacing so all four cards fit the kiosk stage without scroll.

## 4. Visual redesign
- [x] 4.1 Refresh `app/globals.css` palette: darker base, brighter indigo→cyan accent, redesigned card surface with subtle gradient + glow border.
- [x] 4.2 Update light theme tokens for matching contrast.
- [x] 4.3 Add donut-specific tokens (ring background, center text gradient).

## 5. Verification
- [x] 5.1 Update unit tests to assert donut SVG has an inner cutout and center total.
- [x] 5.2 Update / add e2e test verifying all four donut cards render with legend rows.
- [x] 5.3 Run `npm test`, `npm run build`, `npx tsc --noEmit`, `npx playwright test`, `openspec validate donut-charts-large-display --strict`.
