# Design Notes

## Geometry
`buildAnnularPath(cx, cy, R, r, startFrac, endFrac)` — large-arc flag = `(endFrac-startFrac) > 0.5`.
`sliceMidpoint(cx, cy, radius, startFrac, endFrac)` returns `{x,y, angleRad}` for placing leaders and labels.

## SVG slice annotation
- Compute `mid = (startFrac+endFrac)/2 * 2π` (0 = top, clockwise).
- Leader: from outer-radius midpoint (R = 90) → bend at `R+10` → horizontal segment to `R+18` toward side.
- Text anchor: `end` when `sin(mid) < 0` (left half), `start` otherwise.
- Text content: `${label} ${Math.round(fraction*100)}%`. Skip when `fraction < 0.03`.
- SVG `viewBox` widened to `-10 0 220 200` so labels have room without clipping.

## Card layout
```
.donut-card {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: clamp(8px, 1vw, 18px);
}
.donut-chart-wrap { aspect-ratio: 1.1 / 1; min-height: 0; }
.donut-legend { font-size: clamp(11px, 1.05vw, 16px); }
.donut-legend li { grid-template-columns: 14px 1fr auto auto; }
```
The grid keeps SVG square-ish on the left and gives the legend the full right column. Legend rows use 4 columns: swatch, label (truncates), percent, value.

## Palette refresh
- Dark: `--bg-deep #06070f`, `--bg #0b0f1d`, `--panel #161b34`, accent `#ec4899 → #22d3ee`, glow `0 0 0 1px rgba(236,72,153,0.28), 0 20px 50px rgba(6,7,15,0.6)`.
- Light: accent `#be185d → #0e7490`.
- Slice colors retuned: status (`#94a3b8`, `#38bdf8`, `#facc15`, `#22c55e`), buckets `#22d3ee → #6366f1 → #a855f7 → #ec4899 → #f59e0b → #ef4444 → #b91c1c`.

## Refactor split
- `src/lib/donut-geometry.ts` — pure math.
- `src/components/donut-legend.tsx` — legend table.
- `src/components/donut-chart.tsx` — composes title + SVG + `<DonutLegend />`.
