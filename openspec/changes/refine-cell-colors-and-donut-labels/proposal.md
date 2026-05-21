# Refine Cell Colors and Donut Labels

## Why

Two visual bugs reported:

1. Flat cell background colors do not strictly follow the selected Entry Date + AM/PM session. Fallback records currently show white, hiding the fact that they belong to another session. Coloring should be strictly state-driven and only applied when the record matches the selected period.
2. The donut chart leader lines, added to fix dense label overlap, are now drawn even when not needed. Labels should sit close to the chart with leader lines only when required to avoid overlap.

## What Changes

- Floor grid cell color rules become strictly tied to selected Entry Date + AM/PM and time fields:
  - White: matching record present, no entry time.
  - Yellow (active/packing): matching record present, entry time set, no exit time.
  - Green (completed): matching record present, both entry and exit times set.
  - Light grey: anything else, including fallback records from other dates/sessions.
- Donut chart label rendering: place labels as close to slices as possible; only insert leader lines when a label would otherwise overlap a neighbor; never draw lines for already non-overlapping labels.

## Impact

- Specs: `floor-grid-display`, `kiosk-slideshow`
- Code: `src/lib/movements.ts`, `src/components/donut-chart.tsx`, `app/globals.css`
- Tests: `tests/unit/movements.test.ts`, `tests/unit/donut-chart.test.ts`, `tests/e2e/portal.spec.ts`
