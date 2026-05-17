# Donut Charts & Large-Display Redesign

## Why

The summary slide will be shown on a 30-inch screen viewed from a distance. Today's 2×2 pie cards waste space on a small SVG plus a two-column legend with tiny text, so neither the chart nor the labels read well from far away. We need donut charts that dominate each card (70–80% of card area) with bold, single-column legends sized for distance viewing, plus a fresh, high-contrast visual palette.

## What Changes

- Replace the existing `PieChart` SVG slices with donut slices (hollow center) and render a center label showing the total count.
- Resize each chart card so the donut occupies ~70–80% of the card area; render the legend as a single column with large, easy-to-read rows (color swatch · label · value), bumped font size.
- Restructure the summary slide so charts breathe: bigger cards, larger card titles, bigger metric cards above the charts.
- Refresh the overall dashboard palette: deeper, more saturated dark background with a vivid indigo/cyan accent gradient; refined light theme with stronger neutrals; new donut slice palette tuned for far-away contrast.
- Refactor: extract `DonutChart` component (replacing `PieChart`), pull slice-color tables into a shared `chart-palette` module, and split the summary slide into smaller pieces (`SummaryMetrics`, `SummaryCharts`).

## Impact

- Affected specs: `summary-metrics`.
- Affected code: `src/components/pie-chart.tsx` → `src/components/donut-chart.tsx`, `src/components/summary-slide.tsx`, new `src/components/summary-metrics.tsx` + `src/components/summary-charts.tsx`, new `src/lib/chart-palette.ts`, `app/globals.css`.
- Tests: update unit tests that touch the chart component contract; add an e2e check confirming the donut SVG has a hollow center and legend rows render with the larger styling.
