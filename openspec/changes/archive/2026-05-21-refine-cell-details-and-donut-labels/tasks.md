## 1. Tests First

- [x] 1.1 Add unit tests for `filled` cell tone when Entry Date + AM/PM exist without entry/exit times.
- [x] 1.2 Add unit tests that `FloorGrid` renders Entry Date and AM/PM above Entry when present.
- [x] 1.3 Add e2e tests for larger contained floor/unit labels, filled white cells, hover magnification, and donut slice label font size/containment.

## 2. Implementation

- [x] 2.1 Update `CellTone` and `getRoomTone` to distinguish `filled` records from `empty` cells.
- [x] 2.2 Update `FloorGrid` to render Entry Date and AM/PM rows above Entry details.
- [x] 2.3 Add CSS for white filled cells, hover magnification, and magnified detail font size.
- [x] 2.4 Increase donut slice label font size while preserving current donut geometry.
- [x] 2.5 Keep floor labels and unit header labels enlarged and contained.

## 3. Validation

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `npm run build`.
- [x] 3.3 Run `npm run test:e2e`.
- [x] 3.4 Run `openspec validate refine-cell-details-and-donut-labels --strict`.
