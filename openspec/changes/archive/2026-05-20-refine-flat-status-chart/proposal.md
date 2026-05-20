## Why

The Flat Status donut chart currently surfaces a `Reg` slice that is essentially a degenerate edge case (exit time without entry time) and uses the label "Not Registered" which does not match the operator's mental model. Operators want a simpler chart that only distinguishes flats that have not yet been started, are currently being visited, or have been completed.

## What Changes

- Remove the `Reg` value from the `FlatStatus` model, palette, translations, derivation, and chart legend.
- Rename status `Not Reg` to `Not Started` everywhere (type, derivation, distribution, palette, translations); display label becomes `Not Started` in English and `未開始` in Traditional Chinese.
- Update the first donut (Flat Status) to only render the three remaining slices.
- Update specs and tests to reflect the three-status model.

## Impact

- Affected specs: `summary-metrics`, `sheet-data-ingestion`
- Affected code: `src/lib/models.ts`, `src/lib/movements.ts`, `src/lib/chart-palette.ts`, `src/lib/i18n.ts`, `src/components/summary-charts.tsx`, related unit tests
