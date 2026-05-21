## Why

The summary slide donut charts currently share horizontal space nearly evenly with their legends. This makes the chart area feel too small for kiosk viewing, especially when the slide is viewed from a distance.

The chart graphic should dominate each donut card while the legend remains available beside it.

## What Changes

- Update each summary donut card so the chart area occupies at least 70% of the card body width.
- Keep the legend/label area beside the chart and constrained to the remaining 30% width.
- Preserve the existing two-chart summary slide structure and side legend placement.
- Add e2e coverage that measures the rendered chart/legend split.

## Impact

- Affected specs: `kiosk-slideshow`
- Affected code: `app/globals.css`
- Affected tests: `tests/e2e/portal.spec.ts`
