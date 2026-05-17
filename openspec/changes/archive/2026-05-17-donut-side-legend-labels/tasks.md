# Tasks

## 1. Geometry helper
- [x] 1.1 Add `src/lib/donut-geometry.ts` exporting `buildAnnularPath(cx,cy,rOuter,rInner,startFrac,endFrac)` and `sliceMidpoint(cx,cy,radius,startFrac,endFrac)`.
- [x] 1.2 Cover both helpers with unit tests (paths return non-empty `M..A..L..A..Z` strings; midpoint angle equals `(start+end)/2 * 2π`).

## 2. Slice annotations
- [x] 2.1 In `DonutChart`, for each slice with fraction ≥ 0.03, render a polyline leader from the outer radius to a point past the ring and a `<text>` showing `${label} ${pct}%`.
- [x] 2.2 Anchor text `start` / `end` based on slice midpoint angle so labels never collide with the SVG edge.
- [x] 2.3 Suppress annotations when total is 0 or fraction < 0.03; never block the legend.

## 3. Side-by-side layout
- [x] 3.1 Restructure `.donut-card` CSS: `display: grid; grid-template-columns: 1fr 1fr;` with chart on the left, legend on the right; gap tightens at narrow widths.
- [x] 3.2 Replace single-column legend with new `donut-legend.tsx`: each row uses `swatch · label · percent · value`; font sized via `clamp` so all 7 buckets fit at 100% Chrome on a 1920×1080 monitor.
- [x] 3.3 Remove `overflow: hidden` on legend; allow `min-width: 0` text-truncation only on label, keep percent/value always visible.

## 4. Refactor donut component
- [x] 4.1 Extract `<DonutLegend />` to its own file.
- [x] 4.2 `donut-chart.tsx` only composes title + SVG + `<DonutLegend />`; geometry calls come from `donut-geometry.ts`.

## 5. Visual redesign
- [x] 5.1 Update `app/globals.css` palette: warmer slate base (`#0b0f1d`), magenta→aqua accent (`#ec4899 → #22d3ee`), inner card highlight + thicker glow border.
- [x] 5.2 Update `chart-palette.ts` slice colors to match the new background contrast (status, buckets, staff-count).
- [x] 5.3 Light theme: paired neutrals with the same accent ramp.

## 6. Verification
- [x] 6.1 Unit tests: annotation rendered with `%`, leader polyline emitted, small slices (<3%) skipped, side-by-side layout assertions skipped (CSS).
- [x] 6.2 E2E: assert `.donut-card` has the chart's SVG bounding box left of the legend's bounding box; assert at least one `.donut-annotation` text node exists; assert each legend row in the Duration Distribution chart is visible without horizontal scroll.
- [x] 6.3 Run `npm test`, `npm run build`, `npx tsc --noEmit`, `npx playwright test`, `openspec validate donut-side-legend-labels --strict`.
