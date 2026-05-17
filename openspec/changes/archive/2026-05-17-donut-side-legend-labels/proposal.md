# Donut Side Legend & Slice Annotations

## Why

On a 100% Chrome window the current single-column legend underneath each donut still gets clipped when there are 7 buckets (Duration / CSA Staff In-Flat charts). The chart and legend also fight for the same vertical space, so neither dominates. Operators want the donut on the left, every legend label visible on the right side, and a slice-by-slice annotation (`label · NN%`) right next to the ring so the per-slice value is readable without scanning back to the legend.

## What Changes

- Switch each donut card from a vertical (chart-top / legend-bottom) layout to a horizontal (chart-left / legend-right) layout.
- Ensure every legend entry is visible in the right column at 100% Chrome zoom: shrink-to-fit font scaling, allow up to 2 stacked column-groups when there are many entries, and remove the previous overflow-hidden clipping.
- Render slice annotations on the SVG itself: each non-zero slice gets a leader line from the ring to a `label NN%` text positioned just outside the donut so a viewer can read share+name without consulting the legend. Hide the annotation when the slice is too small to fit (<3%).
- Refactor: extract `src/lib/donut-geometry.ts` for arc/midpoint math, split the legend into its own component (`donut-legend.tsx`), and let `donut-chart.tsx` only compose pieces.
- Refresh the visual palette: warmer slate base, electric magenta→aqua accent ramp, glassier card surface with stronger inner highlight, and updated slice colors tuned for the new background.

## Impact

- Affected specs: `summary-metrics`.
- Affected code: `src/components/donut-chart.tsx`, new `src/components/donut-legend.tsx`, new `src/lib/donut-geometry.ts`, `src/lib/chart-palette.ts`, `app/globals.css`.
- Tests: extend `tests/unit/donut-chart.test.ts` to cover annotation rendering + percentage math + small-slice suppression; update e2e to assert the legend sits to the right of the SVG and the annotation `text` elements render.
