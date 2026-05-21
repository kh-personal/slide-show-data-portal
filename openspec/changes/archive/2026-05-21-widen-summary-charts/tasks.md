## 1. Tests First

- [x] 1.1 Update the summary slide e2e chart test to assert each donut chart body gives the chart area at least 70% of the body width and keeps the legend to the right.

## 2. Implementation

- [x] 2.1 Update `.donut-body` CSS to use a 70% chart / 30% legend column split.
- [x] 2.2 Ensure the donut SVG still scales within the enlarged chart area without overflowing the card or stage.

## 3. Validation

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `npm run build`.
- [x] 3.3 Run `npm run test:e2e`.
- [x] 3.4 Run `openspec validate widen-summary-charts --strict`.
