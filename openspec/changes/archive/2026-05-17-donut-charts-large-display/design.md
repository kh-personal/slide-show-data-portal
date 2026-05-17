# Design Notes

## Donut chart
- SVG `viewBox="0 0 200 200"`. Outer radius 90, inner radius 56 (~38% hollow).
- Each slice is an annular sector path: `M x1o y1o A R R 0 large 1 x2o y2o L x2i y2i A r r 0 large 0 x1i y1i Z`.
- Single full-slice case (fraction ≥ 0.999): render two concentric `<circle>` (outer fill + inner background) instead of an arc to avoid a zero-length path.
- Center: `<text>` with the total count (or `0` when empty).
- Container: chart + single-column legend in a vertical flex layout. Chart wrapper gets `flex: 0 0 ~75%` of the card; legend takes the remainder.

## Palette
`src/lib/chart-palette.ts`
- `STATUS_COLORS`: Not Reg `#64748b`, Reg `#38bdf8`, Visiting `#facc15`, Completed `#22c55e`.
- `BUCKET_COLORS`: cyan→indigo→violet→pink→amber→red ramp tuned for high saturation.
- `STAFF_COUNT_COLORS`: 8-tone rotating palette (same gamut).

## Layout (30-inch optimized)
- Donut SVG: ~75% of card height, min 180px.
- Legend rows: `display: grid; grid-template-columns: 18px 1fr auto;` font-size clamp(16px, 1.6vw, 24px); swatch 16×16 with 4px radius.
- Card titles: clamp(20px, 1.8vw, 32px), bold, accent gradient text.
- Metric values: clamp(40px, 5vw, 80px).

## Visual redesign
- Dark theme: `--bg-deep #04060f`, `--bg #0a1224`, `--panel rgba(22, 32, 58, 0.85)`, accent gradient `#7c3aed → #06b6d4`, glow border `0 0 0 1px rgba(124,58,237,0.35), 0 24px 48px rgba(4,6,15,0.6)`.
- Light theme: `--bg #f4f5fb`, `--panel #ffffff`, accent `#4338ca → #0891b2`.

## Refactor split
- `summary-slide.tsx`: header + composes `<SummaryMetrics />` + `<SummaryCharts />`.
- `summary-metrics.tsx`: renders the 5 metric cards.
- `summary-charts.tsx`: builds slice arrays via memoized distribution helpers and renders the 4 donut cards.
