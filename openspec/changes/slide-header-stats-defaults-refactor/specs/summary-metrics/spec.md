## MODIFIED Requirements

### Requirement: SummaryStatsBar supports compact rendering mode

The `SummaryStatsBar` component (previously `SummaryMetrics`) SHALL accept an optional `compact` boolean prop. When `compact` is `true`, the component SHALL apply a CSS modifier class that reduces the visual size of all metric cards. When `compact` is `false` or omitted, the component SHALL render at full size as before.

#### Scenario: Full-size rendering on Slide 3

- **WHEN** `SummaryStatsBar` renders without the `compact` prop (or with `compact={false}`)
- **THEN** metric cards render at their standard size as displayed on the summary slide

#### Scenario: Compact rendering on floor-grid slides

- **WHEN** `SummaryStatsBar` renders with `compact={true}`
- **THEN** metric cards render visually smaller via the `summary-stats-bar--compact` CSS modifier class
