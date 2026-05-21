## Context

The summary slide renders two donut cards via `SummaryCharts` and `DonutChart`. Each `DonutChart` uses a `.donut-body` grid with two columns: one for `.donut-chart-wrap` and one for `.donut-legend`.

The current CSS uses nearly equal columns, so the legend takes about half the available width.

## Decision

Use CSS grid column sizing directly on `.donut-body`:

- `.donut-chart-wrap`: `minmax(0, 7fr)`
- `.donut-legend`: `minmax(0, 3fr)`

This creates a 70% / 30% split inside each donut card body without changing React component structure or data flow.

The SVG remains centered within the chart column and continues to respect card height constraints. The legend keeps its existing row layout and overflow-safe text ellipsis.

## Alternatives Considered

- **Whole-slide 70/30 split:** rejected because the requirement is about each chart versus its label/legend part, not about the two-card grid across the summary slide.
- **CSS custom property:** possible, but unnecessary because this is a single fixed product requirement.
