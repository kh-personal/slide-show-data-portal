## 1. Tests First

- [x] 1.1 Add unit tests that floor rows prefer selected-session records but fall back to other dated/sessioned records for the selected house.
- [x] 1.2 Add unit tests that flat-cell details group Entry Date + AM/PM and Entry + Exit rows.
- [x] 1.3 Add e2e tests for no theme toggle, contained unit header labels, filled fallback cell visibility, hover magnifier height/font, light contrast colors, and non-overlapping donut labels.

## 2. Implementation

- [x] 2.1 Remove theme state/toggle and keep `data-theme="light"`.
- [x] 2.2 Update floor-row record selection to use selected-session preference plus all-session fallback.
- [x] 2.3 Update `FloorGrid` detail rows to group date/session and Entry/Exit.
- [x] 2.4 Tune light-theme colors and hover magnifier sizing.
- [x] 2.5 Spread donut labels with leader lines to avoid overlap.

## 3. Validation

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `npm run build`.
- [x] 3.3 Run `npm run test:e2e`.
- [x] 3.4 Run `openspec validate light-theme-and-cell-detail-refinements --strict`.
